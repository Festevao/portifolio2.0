import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { Tag, TimeWeights } from '../../../lib/tagInterface';
const client = new MongoClient(process.env.MONGODB_URI!);

interface TaskFilters {
  status?: string[];
  createdFrom?: string;
  createdTo?: string;
  completedFrom?: string;
  completedTo?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const xApiKey = "5121"; 
  if (req.headers?.["x-api-key"] !== xApiKey) {
    return res.status(403).json({ error: "Usuário não permitido" });
  }

  try {
    await client.connect();
    const db = client.db();
    const tasksCollection = db.collection("tasks");
    const tagsCollection = db.collection<Tag>("tags");

    // Paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const status = Array.isArray(req.query.status)
      ? req.query.status
      : typeof req.query.status === "string"
        ? req.query.status.split(",")
        : undefined;
    // Filtros
    const filters: TaskFilters = {
      status,
      createdFrom: req.query.createdFrom as string,
      createdTo: req.query.createdTo as string,
      completedFrom: req.query.completedFrom as string,
      completedTo: req.query.completedTo as string,
    };

    // Hora atual e período do dia
    const currentHour = new Date().getHours();
    let period: keyof TimeWeights;
    if (currentHour < 6) period = "dawn";
    else if (currentHour < 12) period = "morning";
    else if (currentHour < 18) period = "afternoon";
    else period = "night";

    // Monta match de filtros
    const match: any = {};
    if (filters.status) match.status = { $in: filters.status };
    if (filters.createdFrom || filters.createdTo) {
      match.createdAt = {};
      if (filters.createdFrom) match.createdAt.$gte = new Date(filters.createdFrom);
      if (filters.createdTo) match.createdAt.$lte = new Date(filters.createdTo);
    }
    if (filters.completedFrom || filters.completedTo) {
      match.completedAt = {};
      if (filters.completedFrom) match.completedAt.$gte = new Date(filters.completedFrom);
      if (filters.completedTo) match.completedAt.$lte = new Date(filters.completedTo);
    }

   const tasks = await tasksCollection.aggregate([
  { $match: match },

  {
    $lookup: {
      from: "tags",
      localField: "tagsIds",
      foreignField: "_id",
      as: "tags",
    },
  },

  // Hora atual SP
  {
    $addFields: {
      spHour: {
        $hour: {
          date: "$$NOW",
          timezone: "America/Sao_Paulo",
        },
      },
    },
  },

  // Período
  {
    $addFields: {
      period: {
        $switch: {
          branches: [
            { case: { $lt: ["$spHour", 6] }, then: "dawn" },
            { case: { $lt: ["$spHour", 12] }, then: "morning" },
            { case: { $lt: ["$spHour", 18] }, then: "afternoon" },
          ],
          default: "night",
        },
      },
    },
  },

  // Peso base das tags
  {
    $addFields: {
      tagWeight: {
        $let: {
          vars: { decayFactor: 0.7 },
          in: {
            $sum: {
              $map: {
                input: { $range: [0, { $size: "$tags" }] },
                as: "index",
                in: {
                  $let: {
                    vars: {
                      tag: { $arrayElemAt: ["$tags", "$$index"] },
                    },
                    in: {
                      $multiply: [
                        "$$tag.weight",
                        {
                          $getField: {
                            field: "$period",
                            input: "$$tag.timeWeights",
                          },
                        },
                        { $pow: ["$$decayFactor", "$$index"] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Deadline Factor melhorado
  {
    $addFields: {
      deadlineFactor: {
        $cond: [
          { $or: [{ $eq: ["$deadLine", null] }, { $not: ["$deadLine"] }] },
          1,
          {
            $let: {
              vars: {
                diffDays: {
                  $divide: [
                    { $subtract: [{ $toDate: "$deadLine" }, "$$NOW"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
              in: {
                $switch: {
                  branches: [
                    // Mais de 7 dias → quase neutro
                    {
                      case: { $gt: ["$$diffDays", 7] },
                      then: 1,
                    },

                    // Entre 0 e 7 dias → cresce progressivamente
                    {
                      case: { $gte: ["$$diffDays", 0] },
                      then: {
                        $add: [
                          1,
                          {
                            $multiply: [
                              { $subtract: [7, "$$diffDays"] },
                              0.15,
                            ],
                          },
                        ],
                      },
                    },

                    // Já passou → crescimento mais agressivo
                    {
                      case: { $lt: ["$$diffDays", 0] },
                      then: {
                        $add: [
                          2,
                          {
                            $multiply: [
                              { $abs: "$$diffDays" },
                              0.25,
                            ],
                          },
                        ],
                      },
                    },
                  ],
                  default: 1,
                },
              },
            },
          },
        ],
      },
    },
  },

  // Peso final
  {
    $addFields: {
      calculatedWeight: {
        $multiply: ["$tagWeight", "$deadlineFactor"],
      },
    },
  },

  { $sort: { calculatedWeight: -1, createdAt: -1 } },

  { $skip: skip },
  { $limit: limit },
]).toArray();


    const total = await tasksCollection.countDocuments(match);

    return res.status(200).json({
      page,
      limit,
      total,
      tasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
