import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { DailyQuestion, DailyQuestionResponse, GenerateQuestionRequest } from '@/types/DailyQuestion';

/**
 * API para criar uma nova pergunta do dia
 * POST /api/daily-question/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<DailyQuestionResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Deve haver exatamente 2 participantes'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    
    // Verificar se já existe pergunta para hoje
    const questionsCollection = db.collection('dailyQuestions');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingQuestion = await questionsCollection.findOne({
      participants: {
        $all: participants
      },
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingQuestion) {
      return res.status(200).json({
        success: true,
        question: existingQuestion as unknown as DailyQuestion,
        message: 'Pergunta do dia já existe'
      });
    }

    // Coletar dados de contexto de todas as collections
    const contextData = await collectContextData(db, participants, req);

    // Gerar pergunta usando Hugging Face
    const generateRequest: GenerateQuestionRequest = {
      participants,
      contextData
    };

    const generateResponse = await fetch(`${getBaseUrl(req)}/api/daily-question/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(generateRequest)
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      return res.status(500).json({
        success: false,
        message: `Erro ao gerar pergunta: ${errorData.error || 'Erro desconhecido'}`
      });
    }

    const { question: generatedQuestion } = await generateResponse.json();

    if (!generatedQuestion) {
      return res.status(500).json({
        success: false,
        message: 'Não foi possível gerar uma pergunta'
      });
    }

    // Salvar pergunta no banco
    const newQuestion: Omit<DailyQuestion, '_id'> = {
      question: generatedQuestion,
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: [], // Array vazio para as respostas
      contextData: {
        moviesCount: contextData.movies.length,
        placesCount: contextData.places.length,
        messagesCount: contextData.messages.length,
        musicCount: contextData.music.length,
        hasMovieGenres: contextData.movies.some((m: any) => m.genres.length > 0),
        hasPlaceDates: contextData.places.some((p: any) => p.date),
        hasMessageImages: contextData.messages.some((m: any) => m.hasImages)
      }
    };

    const result = await questionsCollection.insertOne(newQuestion);

    if (result.insertedId) {
      const createdQuestion = await questionsCollection.findOne({ _id: result.insertedId });

      return res.status(201).json({
        success: true,
        message: 'Pergunta do dia criada com sucesso',
        question: createdQuestion as unknown as DailyQuestion
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao salvar pergunta'
      });
    }

  } catch (error) {
    console.error('Erro ao criar pergunta do dia:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

/**
 * Coleta dados de contexto de todas as collections
 */
async function collectContextData(db: any, participants: string[], req: NextApiRequest) {
  const [moviesCollection, placesCollection, messagesCollection, playlistCollection, questionsCollection] = await Promise.all([
    db.collection('movieRecommendations'),
    db.collection('places'),
    db.collection('messages'),
    db.collection('sharedPlaylists'),
    db.collection('dailyQuestions')
  ]);

  const participantsQuery = { participants: { $all: participants } };

  // Buscar dados de todas as collections
  const [movies, places, messages, playlists, previousQuestions] = await Promise.all([
    moviesCollection.find(participantsQuery).sort({ createdAt: -1 }).limit(10).toArray(),
    placesCollection.find(participantsQuery).sort({ createdAt: -1 }).toArray(),
    messagesCollection.find(participantsQuery).sort({ createdAt: -1 }).limit(10).toArray(),
    playlistCollection.find(participantsQuery).toArray(),
    questionsCollection.find(participantsQuery).sort({ createdAt: -1 }).limit(10).toArray()
  ]);

  // Buscar tracks das playlists do Spotify (simplificado para evitar dependências externas)
  const musicTracks = [];
  // Por enquanto, vamos usar apenas informações básicas das playlists
  // Em uma implementação futura, pode-se buscar tracks via API do Spotify

  return {
    movies: movies.map((m: any) => ({
      title: m.title,
      mediaType: m.mediaType,
      genres: m.genres || [],
      voteAverage: m.voteAverage || 0,
      overview: m.overview || '',
      observation: m.observation,
      createdBy: m.createdBy
    })),
    places: places.map((p: any) => ({
      title: p.title,
      description: p.description,
      date: p.date ? new Date(p.date).toISOString() : undefined,
      location: p.location,
      createdBy: p.createdBy
    })),
    messages: messages.map((m: any) => ({
      content: m.content, // Conteúdo completo agora
      sender: m.sender,
      recipient: m.recipient,
      hasImages: !!(m.images && m.images.length > 0),
      createdAt: new Date(m.createdAt).toISOString()
    })),
    music: playlists.map((playlist: any) => ({
      playlistUrl: playlist.playlistUrl,
      playlistId: playlist.playlistId,
      createdBy: playlist.participants?.[0] || 'unknown'
    })),
    previousQuestions: previousQuestions.map((q: any) => ({
      question: q.question,
      answer: q.answer,
      createdAt: new Date(q.createdAt).toISOString()
    }))
  };
}

/**
 * Obtém a URL base da aplicação
 */
function getBaseUrl(req: NextApiRequest): string {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  return `${protocol}://${host}`;
}
