import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { DailyQuestion, DailyQuestionResponse } from '@/types/DailyQuestion';

/**
 * API para buscar a pergunta do dia atual
 * GET /api/daily-question/get?participants=user1,user2
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<DailyQuestionResponse>) {
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

    const participantsArray = participants.split(',').map(p => p.trim());

    if (participantsArray.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Deve haver exatamente 2 participantes'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const questionsCollection = db.collection('dailyQuestions');

    // Buscar pergunta do dia atual (criada hoje)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayQuestion = await questionsCollection.findOne({
      participants: {
        $all: participantsArray
      },
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }, {
      sort: { createdAt: -1 }
    });

    if (todayQuestion) {
      return res.status(200).json({
        success: true,
        question: todayQuestion as unknown as DailyQuestion
      });
    }

    // Se não há pergunta para hoje, retorna null
    return res.status(200).json({
      success: true,
      question: undefined
    });

  } catch (error) {
    console.error('Erro ao buscar pergunta do dia:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
