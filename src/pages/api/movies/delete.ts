import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { MovieRecommendationResponse } from '@/types/MovieRecommendation';

/**
 * API para deletar uma recomendação de filme/série
 * DELETE /api/movies/delete?id=123
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieRecommendationResponse>) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'ID da recomendação é obrigatório'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const moviesCollection = db.collection('movieRecommendations');

    // Verifica se a recomendação existe
    const existingRecommendation = await moviesCollection.findOne({ _id: id });
    
    if (!existingRecommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recomendação não encontrada'
      });
    }

    // Deleta a recomendação
    const result = await moviesCollection.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: 'Recomendação deletada com sucesso'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar recomendação'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar recomendação de filme:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
