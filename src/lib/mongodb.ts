import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, adicione a variável MONGODB_URI no arquivo .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Cria e retorna uma conexão com o MongoDB
 * Utiliza cache em desenvolvimento para evitar múltiplas conexões
 */
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

