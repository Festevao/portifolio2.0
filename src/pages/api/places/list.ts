import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { PlaceEvent, PlaceEventResponse, CreatePlaceEventData } from '@/types/PlaceEvent';

/**
 * API para listar eventos/lugares filtrados por participantes
 * GET /api/places/list?participants=user1,user2
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaceEventResponse>) {
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
    const placesCollection = db.collection('places');

    // Busca eventos onde TODOS os participantes estão na lista de participantes do evento
    const placeEvents = await placesCollection
      .find({
        participants: {
          $all: participantsArray // Todos os participantes devem estar no array
        }
      })
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      placeEvents: placeEvents as unknown as PlaceEvent[]
    });

  } catch (error) {
    console.error('Erro ao listar lugares:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
