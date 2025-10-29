import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Annotation, AnnotationResponse } from '@/types/Annotation';

interface CreateAnnotationData {
  fromUser: string;
  aboutUser: string;
  content: string;
}

/**
 * API para criar uma nova anotação pessoal
 * POST /api/annotations/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<AnnotationResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { fromUser, aboutUser, content }: CreateAnnotationData = req.body;

    // Validações básicas
    if (!fromUser || !aboutUser || !content) {
      return res.status(400).json({
        success: false,
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    if (fromUser === aboutUser) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível criar anotação sobre si mesmo'
      });
    }

    if (content.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Conteúdo da anotação deve ter pelo menos 3 caracteres'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const annotationsCollection = db.collection('annotations');

    // Cria a nova anotação
    const newAnnotation: Omit<Annotation, '_id'> = {
      fromUser,
      aboutUser,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await annotationsCollection.insertOne(newAnnotation);

    if (result.insertedId) {
      const createdAnnotation = await annotationsCollection.findOne({ _id: result.insertedId });

      return res.status(201).json({
        success: true,
        message: 'Anotação criada com sucesso',
        annotation: createdAnnotation as unknown as Annotation
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar anotação'
      });
    }

  } catch (error) {
    console.error('Erro ao criar anotação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
