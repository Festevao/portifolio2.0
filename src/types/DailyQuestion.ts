/**
 * Tipos para o sistema de pergunta do dia
 */

export interface UserAnswer {
  username: string;
  answer: string;
  answeredAt: Date;
}

export interface DailyQuestion {
  _id: string;
  question: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  answers: UserAnswer[]; // Array de respostas dos usuários
  contextData: {
    moviesCount: number;
    placesCount: number;
    messagesCount: number;
    musicCount: number;
    hasMovieGenres: boolean;
    hasPlaceDates: boolean;
    hasMessageImages: boolean;
  };
}

export interface CreateDailyQuestionData {
  participants: string[];
}

export interface AnswerDailyQuestionData {
  questionId: string;
  answer: string;
  answeredBy: string;
}

export interface DailyQuestionResponse {
  success: boolean;
  message?: string;
  question?: DailyQuestion;
  questions?: DailyQuestion[];
}

export interface GenerateQuestionRequest {
  participants: string[];
  contextData: {
    movies: Array<{
      title: string;
      mediaType: 'movie' | 'tv';
      genres: string[];
      voteAverage: number;
      observation?: string;
      createdBy: string;
    }>;
    places: Array<{
      title: string;
      description?: string;
      date?: string;
      createdBy: string;
    }>;
    messages: Array<{
      content: string;
      sender: string;
      recipient: string;
      hasImages: boolean;
      createdAt: string;
    }>;
    music: Array<{
      playlistUrl?: string;
      trackCount?: number;
    }>;
    previousQuestions: Array<{
      question: string;
      answer?: string;
      createdAt: string;
    }>;
  };
}

export interface HuggingFaceResponse {
  success: boolean;
  question?: string;
  error?: string;
}
