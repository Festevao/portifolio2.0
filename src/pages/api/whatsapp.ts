import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import fs from "fs"; // fs normal, não fs/promises
import fsp from "fs/promises"; // só se precisar de writeFile/unlink async
import path from "path";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { connectToDatabase } from '@/lib/mongodb';
import { analyzeTextForTask } from '../../lib/taskInterface';
import { Tag } from '../../lib/tagInterface';

const adminNumber = "553284680116";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event, messages } = req.body;

    if (event.type !== "messages") {
      return res.status(200).json({ ok: true });
    }

    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");
    const allTags = await tagsCollection.find().toArray() as unknown as Tag[];

    await Promise.all(
      messages.map(async (message: any) => {
        const { type, from } = message;
        if (from !== adminNumber) return;

        // ===== TEXTO =====
        if (type === "text") {
          const text = message.text?.body || "";

          const taskDoc = await analyzeTextForTask(
            text, // ou text puro
            allTags,
            "whatsapp",
            message.id
          );

          // salva no Mongo
          await db.collection("tasks").insertOne(taskDoc);
          return;
        }

        // ===== ÁUDIO / VOZ =====
        if (type === "voice" || type === "audio") {
          const audioUrl = message.audio?.link || message.voice?.link;
          if (!audioUrl) return;

          // 1️⃣ download do áudio
          const audioResp = await fetch(audioUrl);
          const arrayBuffer = await audioResp.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // 2️⃣ gerar nome único para evitar sobreposição
          const tmpFileName = `audio-${uuidv4()}.ogg`;
          const tmpFilePath = path.join("/tmp", tmpFileName);

          try {
            // 3️⃣ salvar no tmp
            await fsp.writeFile(tmpFilePath, buffer);

            // 4️⃣ transcrever com Whisper
            const transcription = await openai.audio.transcriptions.create({
              file: fs.createReadStream(tmpFilePath),
              model: "whisper-1",
              language: "pt",
            });

            const taskDoc = await analyzeTextForTask(
              transcription.text, // ou text puro
              allTags,
              "whatsapp",
              message.id
            );

            // salva no Mongo
            await db.collection("tasks").insertOne(taskDoc);
          } finally {
            // 5️⃣ remove o arquivo temporário sempre, sucesso ou erro
            try {
              await fsp.unlink(tmpFilePath);
            } catch (err) {
              console.error("Erro ao remover arquivo temporário:", err);
            }
          }

          return;
        }
      })
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Invalid payload" });
  }
}
