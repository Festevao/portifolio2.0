import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { PlaceEvent, PlaceEventResponse, CreatePlaceEventData } from '@/types/PlaceEvent';

/**
 * API para listar eventos/lugares filtrados por participantes com paginação
 * GET /api/places/list?participants=user1,user2&page=1&limit=10
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaceEventResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { participants, page = '1', limit = '10' } = req.query;

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

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const client = await clientPromise;
    const db = client.db('portifolio');
    const placesCollection = db.collection('places');

    // Query para buscar eventos onde TODOS os participantes estão na lista
    const query = {
      participants: {
        $all: participantsArray
      }
    };

    // Ordenação: eventos com data primeiro (ordenados por data), depois eventos sem data (ordenados por criação)
    const sort: any = {
      date: -1, // Eventos com data ordenados por data (mais próximos primeiro)
      createdAt: -1 // Eventos sem data ordenados por criação (mais recentes primeiro)
    };

    // Busca total de documentos para paginação
    const totalCount = await placesCollection.countDocuments(query);

    // Busca eventos com paginação
    const placeEvents = await placesCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Calcula informações de paginação
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      placeEvents: placeEvents as unknown as PlaceEvent[],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Erro ao listar lugares:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
