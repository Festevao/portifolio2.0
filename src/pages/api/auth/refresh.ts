import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '@/types/User';

/**
 * API para renovar access token usando refresh token
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
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token é obrigatório'
      });
    }

    // Verificar refresh token
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
    
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, refreshTokenSecret);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido ou expirado'
      });
    }

    // Gerar novo access token
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
    
    const newAccessToken = jwt.sign(
      { 
        username: decoded.username,
        userId: decoded.userId
      },
      accessTokenSecret,
      { expiresIn: '15m' } // Novo access token expira em 15 minutos
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: 'Token renovado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
