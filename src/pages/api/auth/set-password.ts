import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { SetPasswordData, AuthResponse } from '@/types/User';

/**
 * API para definir senha do usuário
 * Só permite definir senha para usuários que ainda não têm senha
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { username, password }: SetPasswordData = req.body;

    // Validações básicas
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Conectar ao MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('portifolio');
    const usersCollection = db.collection('users');

    // Buscar usuário
    const user = await usersCollection.findOne({ username });

    if (!user) {
      await client.close();
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se usuário já tem senha
    if (user.hashedPassword) {
      await client.close();
      return res.status(400).json({
        success: false,
        message: 'Usuário já possui senha definida'
      });
    }

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Atualizar usuário com a senha
    const updateResult = await usersCollection.updateOne(
      { username },
      { 
        $set: { 
          hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    await client.close();

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao definir senha'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Senha definida com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao definir senha:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
