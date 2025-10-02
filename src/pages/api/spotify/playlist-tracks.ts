import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { SpotifySearchResult } from '@/types/SharedPlaylist';
import { AuthOptions } from 'next-auth';

/**
 * API para obter músicas de uma playlist do Spotify
 * GET /api/spotify/playlist-tracks?playlistId=id
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SpotifySearchResult | { message: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Método não permitido'
    });
  }

  try {
    const { playlistId } = req.query;

    if (!playlistId || typeof playlistId !== 'string') {
      return res.status(400).json({
        message: 'ID da playlist é obrigatório'
      });
    }

    // Verifica se o usuário está autenticado
    const session = await getServerSession(req, res, authOptions as AuthOptions);
    
    console.log('Session data:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      accessTokenLength: session?.accessToken?.length
    });
    
    if (!session?.accessToken) {
      return res.status(401).json({
        message: 'Usuário não autenticado ou token não encontrado'
      });
    }

    // Busca músicas da playlist no Spotify
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!tracksResponse.ok) {
      const errorData = await tracksResponse.json().catch(() => ({}));
      console.error('Spotify API error:', {
        status: tracksResponse.status,
        statusText: tracksResponse.statusText,
        error: errorData
      });
      
      // Se o token expirou, retorna 401 para que o frontend possa lidar
      if (tracksResponse.status === 401) {
        return res.status(401).json({
          message: 'Token expirado - faça login novamente'
        });
      }
      
      throw new Error(`Spotify API error: ${tracksResponse.status} - ${errorData.error?.message || tracksResponse.statusText}`);
    }

    const data = await tracksResponse.json();
    
    // Transforma os dados para o formato esperado
    const transformedData: SpotifySearchResult = {
      tracks: {
        items: data.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map((artist: any) => ({ name: artist.name })),
          album: {
            name: item.track.album.name,
            images: item.track.album.images
          },
          duration_ms: item.track.duration_ms,
          preview_url: item.track.preview_url,
          external_urls: {
            spotify: item.track.external_urls.spotify
          }
        }))
      }
    };

    return res.status(200).json(transformedData);

  } catch (error) {
    console.error('Erro ao buscar músicas da playlist:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}