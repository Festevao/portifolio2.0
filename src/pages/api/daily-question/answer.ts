import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { DailyQuestionResponse, AnswerDailyQuestionData } from '@/types/DailyQuestion';

/**
 * API para responder uma pergunta do dia
 * PUT /api/daily-question/answer
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<DailyQuestionResponse>) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { questionId, answer, answeredBy }: AnswerDailyQuestionData = req.body;

    if (!questionId || !answer || !answeredBy) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    if (!ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: 'ID da pergunta inválido'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const questionsCollection = db.collection('dailyQuestions');

    const objectId = new ObjectId(questionId);

    // Verificar se a pergunta existe
    const existingQuestion = await questionsCollection.findOne({ _id: objectId });

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Pergunta não encontrada'
      });
    }

    // Verificar se o usuário já respondeu
    const existingAnswers = existingQuestion.answers || [];
    const userAlreadyAnswered = existingAnswers.some((a: any) => a.username === answeredBy);

    if (userAlreadyAnswered) {
      return res.status(400).json({
        success: false,
        message: 'Você já respondeu esta pergunta'
      });
    }

    // Adicionar nova resposta ao array
    const newAnswer = {
      username: answeredBy,
      answer,
      answeredAt: new Date()
    };

    const result = await questionsCollection.updateOne(
      { _id: objectId },
      {
        $push: { answers: newAnswer } as any,
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount > 0) {
      const updatedQuestion = await questionsCollection.findOne({ _id: objectId });

      return res.status(200).json({
        success: true,
        message: 'Pergunta respondida com sucesso',
        question: updatedQuestion as any
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao responder pergunta'
      });
    }

  } catch (error) {
    console.error('Erro ao responder pergunta:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
