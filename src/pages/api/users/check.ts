import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { User } from '@/types/User';

interface CheckUsersResponse {
  success: boolean;
  users?: {
    me: User | null;
    other: User | null;
  };
  message?: string;
}

/**
 * API route que verifica se dois usuários existem no MongoDB
 * Recebe os query params "me" e "other" com os usernames
 * Retorna os dados dos usuários se existirem
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckUsersResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { me, other } = req.query;

  if (!me || !other || typeof me !== 'string' || typeof other !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'Os parâmetros "me" e "other" são obrigatórios' 
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('portifolio');
    const usersCollection = db.collection<User>('users');

    const [meUser, otherUser] = await Promise.all([
      usersCollection.findOne({ username: me }),
      usersCollection.findOne({ username: other })
    ]);

    if (!meUser || !otherUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Um ou mais usuários não encontrados' 
      });
    }

    return res.status(200).json({
      success: true,
      users: {
        me: meUser,
        other: otherUser
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
}

