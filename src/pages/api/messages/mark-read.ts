import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { MessageResponse } from '@/types/Message';

/**
 * API para marcar uma mensagem como lida
 * PUT /api/messages/mark-read?id=messageId
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MessageResponse>) {
  if (req.method !== 'PUT') {
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
        message: 'ID da mensagem é obrigatório'
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
    const messagesCollection = db.collection('messages');

    // Converte string para ObjectId
    const objectId = new ObjectId(id);

    // Verifica se a mensagem existe
    const existingMessage = await messagesCollection.findOne({ _id: objectId });
    
    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Marca a mensagem como lida
    const result = await messagesCollection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          isRead: true,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({
        success: true,
        message: 'Mensagem marcada como lida'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao marcar mensagem como lida'
      });
    }

  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
