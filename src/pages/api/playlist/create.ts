import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { SharedPlaylist, PlaylistResponse, CreateSharedPlaylistData } from '@/types/SharedPlaylist';

/**
 * API para criar uma nova playlist compartilhada
 * POST /api/playlist/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaylistResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { playlistUrl, participants, createdBy }: CreateSharedPlaylistData & { participants: string[]; createdBy: string } = req.body;

    if (!playlistUrl || !participants || !createdBy) {
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

    // Extrai o ID da playlist da URL do Spotify
    const playlistIdMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    const playlistId = playlistIdMatch ? playlistIdMatch[1] : null;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: 'URL da playlist inválida'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const playlistCollection = db.collection('sharedPlaylists');

    // Verifica se já existe uma playlist para estes participantes
    const existingPlaylist = await playlistCollection.findOne({
      participants: { $all: participants }
    });

    if (existingPlaylist) {
      return res.status(409).json({
        success: false,
        message: 'Já existe uma playlist compartilhada para estes participantes'
      });
    }

    // Cria a nova playlist compartilhada
    const newPlaylist: Omit<SharedPlaylist, '_id'> = {
      participants,
      playlistUrl,
      playlistId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy
    };

    const result = await playlistCollection.insertOne(newPlaylist);

    if (result.insertedId) {
      const createdPlaylist = await playlistCollection.findOne({ _id: result.insertedId });
      
      return res.status(201).json({
        success: true,
        message: 'Playlist compartilhada criada com sucesso',
        playlist: createdPlaylist as unknown as SharedPlaylist
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar playlist compartilhada'
      });
    }

  } catch (error) {
    console.error('Erro ao criar playlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
