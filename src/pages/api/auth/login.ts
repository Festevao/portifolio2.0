import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginData, AuthResponse, User } from '@/types/User';

/**
 * API para login e geração de tokens JWT
 * Retorna access token e refresh token
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
    const { username, password }: LoginData = req.body;

    // Validações básicas
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
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

    // Verificar se usuário tem senha definida
    if (!user.hashedPassword) {
      await client.close();
      return res.status(400).json({
        success: false,
        message: 'Usuário precisa definir uma senha primeiro',
        needsPassword: true
      });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      await client.close();
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    await client.close();

    // Gerar tokens JWT
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';

    const accessToken = jwt.sign(
      { 
        username: user.username,
        userId: user._id?.toString()
      },
      accessTokenSecret,
      { expiresIn: '15m' } // Access token expira em 15 minutos
    );

    const refreshToken = jwt.sign(
      { 
        username: user.username,
        userId: user._id?.toString()
      },
      refreshTokenSecret,
      { expiresIn: '7d' } // Refresh token expira em 7 dias
    );

    // Remover senha do objeto de usuário antes de retornar
    const { hashedPassword, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: userWithoutPassword as unknown as User,
      message: 'Login realizado com sucesso!'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
