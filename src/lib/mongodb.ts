// lib/mongo.ts
import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI não está definida");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedDb && cachedClient) return { client: cachedClient, db: cachedDb };

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(); // usa o db default da URI
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}
