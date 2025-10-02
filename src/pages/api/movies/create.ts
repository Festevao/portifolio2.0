import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { MovieRecommendation, MovieRecommendationResponse, CreateMovieRecommendationData } from '@/types/MovieRecommendation';

/**
 * API para criar uma nova recomendação de filme/série
 * POST /api/movies/create
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieRecommendationResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { 
      tmdbId, 
      title, 
      originalTitle, 
      overview, 
      posterPath, 
      backdropPath, 
      releaseDate, 
      voteAverage, 
      voteCount, 
      genres, 
      type, 
      runtime, 
      numberOfSeasons, 
      numberOfEpisodes, 
      status, 
      tagline, 
      homepage, 
      imdbId, 
      participants, 
      createdBy, 
      notes 
    }: CreateMovieRecommendationData & { participants: string[]; createdBy: string } = req.body;

    // Validações básicas
    if (!tmdbId || !title || !participants || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    const client = await clientPromise;
    const db = client.db('portifolio');
    const moviesCollection = db.collection('movieRecommendations');

    // Verifica se já existe uma recomendação com o mesmo TMDB ID para estes participantes
    const existingRecommendation = await moviesCollection.findOne({
      tmdbId,
      participants: { $all: participants }
    });

    if (existingRecommendation) {
      return res.status(409).json({
        success: false,
        message: 'Esta recomendação já existe para estes participantes'
      });
    }

    // Cria a nova recomendação
    const newMovieRecommendation: Omit<MovieRecommendation, '_id'> = {
      tmdbId,
      title,
      originalTitle,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      voteCount,
      genres,
      type,
      runtime,
      numberOfSeasons,
      numberOfEpisodes,
      status,
      tagline,
      homepage,
      imdbId,
      participants,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes
    };

    const result = await moviesCollection.insertOne(newMovieRecommendation);

    if (result.insertedId) {
      const createdRecommendation = await moviesCollection.findOne({ _id: result.insertedId });
      
      return res.status(201).json({
        success: true,
        message: 'Recomendação criada com sucesso',
        movieRecommendation: createdRecommendation as unknown as MovieRecommendation
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar recomendação'
      });
    }

  } catch (error) {
    console.error('Erro ao criar recomendação de filme:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
