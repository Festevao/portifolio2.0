import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { AuthOptions } from 'next-auth';

/**
 * API para verificar o status da sessão e tokens
 * GET /api/auth/debug
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions as AuthOptions);
    
    return res.status(200).json({
      success: true,
      session: {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasAccessToken: !!session?.accessToken,
        accessTokenLength: session?.accessToken?.length,
        userEmail: session?.user?.email,
        userName: session?.user?.name,
        // Não vamos expor o token completo por segurança
        accessTokenPreview: session?.accessToken ? `${session.accessToken.substring(0, 20)}...` : null
      }
    });

  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
