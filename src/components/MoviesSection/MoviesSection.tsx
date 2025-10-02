import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/Weather';
import { MovieRecommendation, CreateMovieRecommendationData } from '@/types/MovieRecommendation';
import AddMovieModal from './AddMovieModal';
import MovieDetailsModal from './MovieDetailsModal';

interface MoviesSectionProps {
  weather: WeatherData;
  participants: string[];
}

/**
 * Seção de recomendações de filmes e séries - gerencia recomendações entre dois usuários
 * Busca filmes/séries diretamente do TMDB
 */
const MoviesSection = ({ weather, participants }: MoviesSectionProps) => {
  const [movies, setMovies] = useState<MovieRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieRecommendation | null>(null);
  const [expanded, setExpanded] = useState(false);

  /**
   * Carrega a lista de recomendações filtradas por participantes
   */
  const loadMovies = async () => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/movies/list?participants=${participantsParam}`);
      const data = await response.json();
      
      if (data.success && data.movieRecommendations) {
        setMovies(data.movieRecommendations);
      }
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deleta uma recomendação
   */
  const deleteMovie = async (movieId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta recomendação?')) {
      return;
    }

    try {
      const response = await fetch(`/api/movies/delete?id=${movieId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMovies(movies.filter(movie => movie._id !== movieId));
      } else {
        throw new Error(data.message || 'Erro ao deletar recomendação');
      }
    } catch (error) {
      console.error('Erro ao deletar recomendação:', error);
      alert('Erro ao deletar recomendação: ' + (error as Error).message);
    }
  };

  /**
   * Salva uma nova recomendação
   */
  const saveMovie = async (movieData: CreateMovieRecommendationData) => {
    try {
      const response = await fetch('/api/movies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...movieData,
          participants,
          createdBy: participants[0]
        })
      });

      const data = await response.json();

      if (data.success && data.movieRecommendation) {
        setMovies([data.movieRecommendation, ...movies]);
        setShowAddModal(false);
      } else {
        throw new Error(data.message || 'Erro ao criar recomendação');
      }
    } catch (error) {
      console.error('Erro ao criar recomendação:', error);
      alert('Erro ao criar recomendação: ' + (error as Error).message);
    }
  };

  /**
   * Abre modal de detalhes
   */
  const openDetails = (movie: MovieRecommendation) => {
    setSelectedMovie(movie);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <>
      {/* Card principal */}
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 transition-all duration-300 ${
        weather.isDaytime 
          ? 'bg-white/30 border border-white/20' 
          : 'bg-purple-950/30 border border-purple-800/20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">🎬</div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                Pra gente assistir
              </h2>
              <p className={`text-sm sm:text-base ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                {movies.length} {movies.length === 1 ? 'recomendação' : 'recomendações'} de filmes e séries
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 sm:p-3 rounded-full transition-all transform hover:scale-105 ${
              weather.isDaytime
                ? 'bg-white/50 hover:bg-white/70 text-gray-700'
                : 'bg-purple-600/50 hover:bg-purple-600/70 text-white'
            }`}
          >
            <span className={`text-lg sm:text-xl transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>
        </div>

        {/* Conteúdo expandido */}
        {expanded && (
          <div className="space-y-4">
            {/* Lista de recomendações */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Carregando recomendações...
                </p>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎬</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Nenhuma recomendação ainda
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  Clique no botão abaixo para adicionar a primeira recomendação!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      weather.isDaytime
                        ? 'bg-white/20 border-white/30 hover:bg-white/30'
                        : 'bg-purple-900/20 border-purple-700/30 hover:bg-purple-800/30'
                    }`}
                    onClick={() => openDetails(movie)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Poster */}
                      <div className="flex-shrink-0">
                        {movie.posterPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <div className={`w-16 h-24 rounded-lg flex items-center justify-center ${
                            weather.isDaytime ? 'bg-gray-200' : 'bg-gray-700'
                          }`}>
                            <span className="text-2xl">🎬</span>
                          </div>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-bold text-lg truncate ${
                              weather.isDaytime ? 'text-gray-800' : 'text-white'
                            }`}>
                              {movie.title}
                            </h3>
                            <p className={`text-sm ${
                              weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                            }`}>
                              {movie.type === 'movie' ? 'Filme' : 'Série'} • {new Date(movie.releaseDate).getFullYear()}
                            </p>
                            {movie.notes && (
                              <p className={`text-sm mt-1 italic ${
                                weather.isDaytime ? 'text-gray-500' : 'text-purple-300'
                              }`}>
                                &quot;{movie.notes}&quot;
                              </p>
                            )}
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 ml-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className={`text-sm font-medium ${
                              weather.isDaytime ? 'text-gray-700' : 'text-white'
                            }`}>
                              {movie.voteAverage.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Gêneros */}
                        {movie.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {movie.genres.slice(0, 3).map((genre, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  weather.isDaytime
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-purple-800/50 text-purple-200'
                                }`}
                              >
                                {genre}
                              </span>
                            ))}
                            {movie.genres.length > 3 && (
                              <span className={`text-xs ${
                                weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                              }`}>
                                +{movie.genres.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Botão de deletar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMovie(movie._id!);
                        }}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${
                          weather.isDaytime
                            ? 'hover:bg-red-100 text-red-600'
                            : 'hover:bg-red-900/50 text-red-400'
                        }`}
                        title="Deletar recomendação"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão de adicionar */}
            <div className="pt-4 border-t border-white/20">
              <button
                onClick={() => setShowAddModal(true)}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  weather.isDaytime
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                ➕ Adicionar Recomendação
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar recomendação */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={saveMovie}
        weather={weather}
        participants={participants}
      />

      {/* Modal de detalhes da recomendação */}
      <MovieDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedMovie(null);
        }}
        movie={selectedMovie}
        weather={weather}
      />
    </>
  );
};

export default MoviesSection;
