import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Message, MessageResponse } from '@/types/Message';

/**
 * API para listar mensagens entre dois usuários com paginação
 * GET /api/messages/list?participants=user1,user2&page=1&limit=10&type=all|sent|received
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MessageResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { participants, page = '1', limit = '10', type = 'all' } = req.query;

    if (!participants || typeof participants !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro participants é obrigatório'
      });
    }

    // Converte string "user1,user2" em array ["user1", "user2"]
    const participantsArray = participants.split(',').map(p => p.trim());

    if (participantsArray.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Deve haver exatamente 2 participantes'
      });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const client = await clientPromise;
    const db = client.db('portifolio');
    const messagesCollection = db.collection('messages');

    // Query base: mensagens entre os dois usuários
    let query: any = {
      participants: {
        $all: participantsArray
      }
    };

    // Filtro por tipo de mensagem
    if (type === 'sent' && participantsArray[0]) {
      query.sender = participantsArray[0];
    } else if (type === 'received' && participantsArray[0]) {
      query.recipient = participantsArray[0];
    }

    // Ordenação: mensagens mais recentes primeiro
    const sort = { createdAt: -1 };

    // Busca total de documentos para paginação
    const totalCount = await messagesCollection.countDocuments(query);

    // Busca mensagens com paginação
    const messages = await messagesCollection
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
      messages: messages as unknown as Message[],
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
    console.error('Erro ao listar mensagens:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
