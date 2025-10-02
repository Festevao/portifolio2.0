import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

/**
 * API para verificar o status do token do Spotify
 * GET /api/auth/token-status
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Verifica se o token ainda é válido fazendo uma requisição simples
    const testResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const isTokenValid = testResponse.ok;

    return res.status(200).json({
      success: true,
      hasSession: !!session,
      hasAccessToken: !!session.accessToken,
      accessTokenLength: session.accessToken?.length,
      isTokenValid,
      userEmail: session.user?.email,
      userName: session.user?.name,
      tokenTestStatus: testResponse.status,
      tokenTestStatusText: testResponse.statusText
    });

  } catch (error) {
    console.error('Erro ao verificar status do token:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
