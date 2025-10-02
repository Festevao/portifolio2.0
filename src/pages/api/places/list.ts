import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { PlaceEvent, PlaceEventResponse, CreatePlaceEventData } from '@/types/PlaceEvent';

/**
 * API para listar todos os eventos/lugares
 * GET /api/places/list
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaceEventResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('portifolio');
    const placesCollection = db.collection('places');

    // Busca todos os eventos ordenados por data (mais recentes primeiro)
    const placeEvents = await placesCollection
      .find({})
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
