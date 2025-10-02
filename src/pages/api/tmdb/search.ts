import { NextApiRequest, NextApiResponse } from 'next';
import { TMDBSearchResult } from '@/types/MovieRecommendation';

/**
 * API para buscar filmes e séries no TMDB
 * GET /api/tmdb/search?query=termo&type=movie|tv|multi
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { query, type = 'multi', page = '1' } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro query é obrigatório'
      });
    }

    const apiKey = process.env.TMDB_API_KEY;
    console.log('TMDB_API_KEY exists:', !!apiKey);
    console.log('TMDB_API_KEY length:', apiKey?.length);
    console.log('TMDB_API_KEY preview:', apiKey?.substring(0, 8) + '...');
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'API key do TMDB não configurada'
      });
    }

    const baseUrl = 'https://api.themoviedb.org/3';
    let searchUrl: string;

    // Determina a URL de busca baseada no tipo
    switch (type) {
      case 'movie':
        searchUrl = `${baseUrl}/search/movie`;
        break;
      case 'tv':
        searchUrl = `${baseUrl}/search/tv`;
        break;
      case 'multi':
      default:
        searchUrl = `${baseUrl}/search/multi`;
        break;
    }

    const fullUrl = `${searchUrl}?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR&include_adult=false`;
    console.log('TMDB request URL:', fullUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(fullUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error response:', errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data: TMDBSearchResult = await response.json();
    
    console.log('TMDB raw results count:', data.results?.length);
    console.log('First raw result:', data.results?.[0]);

    // Filtra resultados para remover itens sem poster
    const filteredResults = data.results.filter(item => {
      const hasPoster = !!item.poster_path;
      const hasTitle = !!(item as any).title; // Para filmes
      const hasName = !!(item as any).name; // Para séries
      
      console.log('Item filter check:', {
        id: item.id,
        hasPoster,
        hasTitle,
        hasName,
        title: (item as any).title,
        name: (item as any).name,
        poster_path: item.poster_path
      });
      
      return hasPoster && (hasTitle || hasName);
    });

    console.log('Filtered results count:', filteredResults.length);
    console.log('First filtered result:', filteredResults[0]);

    return res.status(200).json({
      success: true,
      results: filteredResults,
      total_pages: data.total_pages,
      total_results: data.total_results
    });

  } catch (error) {
    console.error('Erro ao buscar no TMDB:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
