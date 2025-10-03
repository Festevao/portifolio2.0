import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

interface CheckPasswordResponse {
  success: boolean;
  needsPassword: boolean;
  userExists: boolean;
  message?: string;
}

/**
 * API para verificar se um usuário precisa definir senha
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckPasswordResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      needsPassword: false,
      userExists: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        needsPassword: false,
        userExists: false,
        message: 'Username é obrigatório'
      });
    }

    // Conectar ao MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('portifolio');
    const usersCollection = db.collection('users');

    // Buscar usuário
    const user = await usersCollection.findOne({ username });

    await client.close();

    if (!user) {
      return res.status(404).json({
        success: false,
        needsPassword: false,
        userExists: false,
        message: 'Usuário não encontrado'
      });
    }

    const needsPassword = !user.hashedPassword;

    return res.status(200).json({
      success: true,
      needsPassword,
      userExists: true,
      message: needsPassword 
        ? 'Usuário precisa definir senha' 
        : 'Usuário já possui senha'
    });

  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    
    return res.status(500).json({
      success: false,
      needsPassword: false,
      userExists: false,
      message: 'Erro interno do servidor'
    });
  }
}
