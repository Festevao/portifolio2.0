import { NextApiRequest, NextApiResponse } from 'next';
import { TMDBMovieDetails, TMDBTVDetails } from '@/types/MovieRecommendation';

/**
 * API para buscar detalhes de filme ou série no TMDB
 * GET /api/tmdb/details?type=movie|tv&id=123
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { type, id } = req.query;

    if (!type || !id || typeof type !== 'string' || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros type e id são obrigatórios'
      });
    }

    if (type !== 'movie' && type !== 'tv') {
      return res.status(400).json({
        success: false,
        message: 'Tipo deve ser "movie" ou "tv"'
      });
    }

    const apiKey = process.env.TMDB_API_KEY;
    console.log('TMDB_API_KEY exists:', !!apiKey);
    console.log('TMDB_API_KEY length:', apiKey?.length);
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'API key do TMDB não configurada'
      });
    }

    const baseUrl = 'https://api.themoviedb.org/3';
    const detailsUrl = `${baseUrl}/${type}/${id}?api_key=${apiKey}&language=pt-BR`;

    console.log('TMDB details URL:', detailsUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(detailsUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error response:', errorText);
      
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Filme ou série não encontrado'
        });
      }
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data: TMDBMovieDetails | TMDBTVDetails = await response.json();

    return res.status(200).json({
      success: true,
      details: data
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes no TMDB:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
