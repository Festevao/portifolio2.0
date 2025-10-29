import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Annotation, AnnotationResponse } from '@/types/Annotation';

/**
 * API para listar anotações de um usuário sobre outro
 * GET /api/annotations/list?fromUser=username&aboutUser=username
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<AnnotationResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { fromUser, aboutUser } = req.query;

    // Validações básicas
    if (!fromUser || !aboutUser || typeof fromUser !== 'string' || typeof aboutUser !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros fromUser e aboutUser são obrigatórios'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const annotationsCollection = db.collection('annotations');

    // Busca todas as anotações do usuário sobre o outro usuário
    const annotations = await annotationsCollection
      .find({ 
        fromUser: fromUser,
        aboutUser: aboutUser
      })
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .toArray();

    return res.status(200).json({
      success: true,
      message: `${annotations.length} anotações encontradas`,
      annotations: annotations as unknown as Annotation[]
    });

  } catch (error) {
    console.error('Erro ao buscar anotações:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
