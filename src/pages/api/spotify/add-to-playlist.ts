import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { AddTrackToPlaylistData } from '@/types/SharedPlaylist';
import { AuthOptions } from 'next-auth';

/**
 * API para adicionar uma música à playlist do Spotify
 * POST /api/spotify/add-to-playlist
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ success: boolean; message?: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { playlistId, trackId }: AddTrackToPlaylistData = req.body;

    if (!playlistId || !trackId) {
      return res.status(400).json({
        success: false,
        message: 'ID da playlist e da música são obrigatórios'
      });
    }

    // Verifica se o usuário está autenticado
    const session = await getServerSession(req, res, authOptions as AuthOptions);
    
    if (!session?.accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Adiciona música à playlist no Spotify
    const addResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`]
        })
      }
    );

    if (!addResponse.ok) {
      const errorData = await addResponse.json();
      throw new Error(`Spotify API error: ${addResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Música adicionada à playlist com sucesso'
    });

  } catch (error) {
    console.error('Erro ao adicionar música à playlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}