import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { SharedPlaylist, PlaylistResponse } from '@/types/SharedPlaylist';

/**
 * API para obter a playlist compartilhada entre dois usuários
 * GET /api/playlist/shared?participants=user1,user2
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaylistResponse>) {
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
        message: 'Participantes não fornecidos'
      });
    }

    const participantsArray = participants.split(',');
    if (participantsArray.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Deve haver exatamente 2 participantes'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const playlistCollection = db.collection('sharedPlaylists');

    // Busca playlist compartilhada entre os dois usuários
    const playlist = await playlistCollection.findOne({
      participants: { $all: participantsArray }
    });

    if (!playlist) {
      // Se não existe, retorna null para que o frontend possa criar uma nova
      return res.status(200).json({
        success: true,
        playlist: null as unknown as SharedPlaylist
      });
    }

    return res.status(200).json({
      success: true,
      playlist: playlist as unknown as SharedPlaylist
    });

  } catch (error) {
    console.error('Erro ao obter playlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}