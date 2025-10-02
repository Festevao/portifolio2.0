import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { PlaceEventResponse } from '@/types/PlaceEvent';
import { ObjectId } from 'mongodb';

/**
 * API para deletar um evento/lugar
 * DELETE /api/places/delete?id=eventId
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaceEventResponse>) {
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
        message: 'ID do evento não fornecido'
      });
    }

    // Valida se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const placesCollection = db.collection('places');

    // Converte string para ObjectId
    const objectId = new ObjectId(id);

    // Verifica se o evento existe
    const existingEvent = await placesCollection.findOne({ _id: objectId });
    
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Deleta o evento
    const result = await placesCollection.deleteOne({ _id: objectId });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar evento'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar lugar:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
