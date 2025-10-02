import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { SpotifySearchResult } from '@/types/SharedPlaylist';

/**
 * API para buscar músicas no Spotify
 * GET /api/spotify/search?q=query&type=track
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SpotifySearchResult | { message: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Método não permitido'
    });
  }

  try {
    const { q, type = 'track' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        message: 'Query de busca é obrigatória'
      });
    }

    // Verifica se o usuário está autenticado
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.accessToken) {
      return res.status(401).json({
        message: 'Usuário não autenticado'
      });
    }

    // Busca real no Spotify
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Spotify API error: ${searchResponse.status}`);
    }

    const data = await searchResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erro ao buscar no Spotify:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}