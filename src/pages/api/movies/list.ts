import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { MovieRecommendation, MovieRecommendationResponse } from '@/types/MovieRecommendation';

/**
 * API para listar recomendações de filmes/séries filtradas por participantes
 * GET /api/movies/list?participants=user1,user2
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieRecommendationResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { participants } = req.query;

    if (!participants || typeof participants !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro participants é obrigatório'
      });
    }

    // Converte string "user1,user2" em array ["user1", "user2"]
    const participantsArray = participants.split(',').map(p => p.trim());

    if (participantsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de participantes não pode estar vazia'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const moviesCollection = db.collection('movieRecommendations');

    // Busca recomendações onde TODOS os participantes estão na lista
    const movieRecommendations = await moviesCollection
      .find({
        participants: {
          $all: participantsArray // Todos os participantes devem estar no array
        }
      })
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .toArray();

    return res.status(200).json({
      success: true,
      movieRecommendations: movieRecommendations as unknown as MovieRecommendation[]
    });

  } catch (error) {
    console.error('Erro ao listar recomendações de filmes:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
