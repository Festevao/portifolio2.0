import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Message, MessageResponse, CreateMessageData } from '@/types/Message';

/**
 * API para criar uma nova mensagem
 * POST /api/messages/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MessageResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { 
      content, 
      sender, 
      recipient, 
      participants, 
      images 
    }: CreateMessageData = req.body;

    // Validações básicas
    if (!content || !sender || !recipient || !participants) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    if (participants.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Deve haver exatamente 2 participantes'
      });
    }

    if (!participants.includes(sender) || !participants.includes(recipient)) {
      return res.status(400).json({
        success: false,
        message: 'Remetente e destinatário devem estar na lista de participantes'
      });
    }

    if (sender === recipient) {
      return res.status(400).json({
        success: false,
        message: 'Remetente e destinatário não podem ser o mesmo usuário'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const messagesCollection = db.collection('messages');

    // Cria a nova mensagem
    const newMessage: Omit<Message, '_id'> = {
      content,
      sender,
      recipient,
      participants,
      images: images || [],
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await messagesCollection.insertOne(newMessage);

    if (result.insertedId) {
      const createdMessage = await messagesCollection.findOne({ _id: result.insertedId });

      return res.status(201).json({
        success: true,
        message: 'Mensagem criada com sucesso',
        data: createdMessage as unknown as Message
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar mensagem'
      });
    }

  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
