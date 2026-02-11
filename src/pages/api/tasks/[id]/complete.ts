// pages/api/tasks/[id]/complete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const xApiKey = "5121"; 
  if (req.headers?.["x-api-key"] !== xApiKey) {
    return res.status(403).json({ error: "Usuário não permitido" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Task ID é obrigatório" });

  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const result = await tasksCollection.findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { $set: { status: "done", completedAt: new Date() } },
      { returnDocument: "after" } // retorna a task atualizada
    );

    if (!(result?.status === 'done')) return res.status(404).json({ error: "Task não encontrada" });

    res.status(200).json(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao concluir a task" });
  }
}
