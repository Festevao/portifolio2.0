import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { PlaceEvent, PlaceEventResponse, CreatePlaceEventData } from '@/types/PlaceEvent';

/**
 * API para criar um novo evento/lugar
 * POST /api/places/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaceEventResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { title, description, location, date, participants }: CreatePlaceEventData & { participants: string[] } = req.body;

    // Validações básicas
    if (!title || !location?.name || !location?.address || !location?.coordinates || !participants) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const placesCollection = db.collection('places');

    // Cria o novo evento
    const newPlaceEvent: Omit<PlaceEvent, '_id'> = {
      title,
      description,
      location,
      date: date ? new Date(date) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants,
      createdBy: participants[0] // O criador é automaticamente participante
    };

    const result = await placesCollection.insertOne(newPlaceEvent);

    if (result.insertedId) {
      const createdEvent = await placesCollection.findOne({ _id: result.insertedId });
      
      return res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        placeEvent: createdEvent as unknown as PlaceEvent
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar evento'
      });
    }

  } catch (error) {
    console.error('Erro ao criar lugar:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
