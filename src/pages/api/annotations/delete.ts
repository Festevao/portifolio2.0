import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { AnnotationResponse } from '@/types/Annotation';

/**
 * API para deletar uma anotação
 * DELETE /api/annotations/delete
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<AnnotationResponse>) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { annotationId, fromUser } = req.body;

    // Validações básicas
    if (!annotationId || !fromUser) {
      return res.status(400).json({
        success: false,
        error: 'ID da anotação e usuário são obrigatórios'
      });
    }

    // Verificar se o ID é válido
    if (!ObjectId.isValid(annotationId)) {
      return res.status(400).json({
        success: false,
        error: 'ID da anotação inválido'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const annotationsCollection = db.collection('annotations');

    // Verificar se a anotação existe e pertence ao usuário
    const annotation = await annotationsCollection.findOne({
      _id: new ObjectId(annotationId),
      fromUser: fromUser
    });

    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Anotação não encontrada ou você não tem permissão para deletá-la'
      });
    }

    // Deletar a anotação
    const result = await annotationsCollection.deleteOne({
      _id: new ObjectId(annotationId),
      fromUser: fromUser
    });

    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: 'Anotação deletada com sucesso'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Erro ao deletar anotação'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar anotação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
