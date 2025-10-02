import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { SpotifySearchResult } from '@/types/SharedPlaylist';

/**
 * API para obter informações de uma playlist do Spotify
 * GET /api/spotify/playlist-info?playlistId=id
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ success: boolean; playlist?: any; message?: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { playlistId } = req.query;

    if (!playlistId || typeof playlistId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'ID da playlist é obrigatório'
      });
    }

    // Verifica se o usuário está autenticado
    const session = await getServerSession(req, res, {});
    
    if (!session?.accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Busca informações da playlist no Spotify
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!playlistResponse.ok) {
      throw new Error(`Spotify API error: ${playlistResponse.status}`);
    }

    const playlistData = await playlistResponse.json();

    return res.status(200).json({
      success: true,
      playlist: {
        id: playlistData.id,
        name: playlistData.name,
        description: playlistData.description,
        images: playlistData.images,
        external_urls: playlistData.external_urls,
        tracks: {
          total: playlistData.tracks.total
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar informações da playlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
