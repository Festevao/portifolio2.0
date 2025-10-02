import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/Weather';
import { MovieRecommendation, TMDBMovieDetails, TMDBTVDetails } from '@/types/MovieRecommendation';

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieRecommendation | null;
  weather: WeatherData;
}

/**
 * Modal para exibir detalhes completos de uma recomendação de filme/série
 */
const MovieDetailsModal = ({ isOpen, onClose, movie, weather }: MovieDetailsModalProps) => {
  const [tmdbDetails, setTmdbDetails] = useState<TMDBMovieDetails | TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Carrega detalhes adicionais do TMDB
   */
  const loadTMDBDetails = async () => {
    if (!movie) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tmdb/details?type=${movie.type}&id=${movie.tmdbId}`);
      const data = await response.json();
      
      if (data.success && data.details) {
        setTmdbDetails(data.details);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && movie) {
      loadTMDBDetails();
    } else {
      setTmdbDetails(null);
    }
  }, [isOpen, movie]);

  if (!isOpen || !movie) return null;

  const isMovie = movie.type === 'movie';
  const details = tmdbDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
        weather.isDaytime 
          ? 'bg-white' 
          : 'bg-gray-900'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b ${
          weather.isDaytime ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl sm:text-2xl font-bold ${
              weather.isDaytime ? 'text-gray-800' : 'text-white'
            }`}>
              🎬 {movie.title}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                weather.isDaytime
                  ? 'hover:bg-gray-100 text-gray-600'
                  : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Poster e informações básicas */}
            <div className="lg:col-span-1">
              <div className="sticky top-0">
                {/* Poster */}
                <div className="mb-4">
                  {movie.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      className="w-full rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className={`w-full aspect-[2/3] rounded-xl flex items-center justify-center ${
                      weather.isDaytime ? 'bg-gray-200' : 'bg-gray-700'
                    }`}>
                      <span className="text-6xl">🎬</span>
                    </div>
                  )}
                </div>

                {/* Informações básicas */}
                <div className={`p-4 rounded-xl ${
                  weather.isDaytime ? 'bg-gray-50' : 'bg-gray-800'
                }`}>
                  <div className="space-y-3">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <span className={`text-lg font-bold ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        {movie.voteAverage.toFixed(1)}
                      </span>
                      <span className={`text-sm ${
                        weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        ({movie.voteCount} avaliações)
                      </span>
                    </div>

                    {/* Ano */}
                    <div>
                      <span className={`text-sm font-medium ${
                        weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {isMovie ? 'Lançamento:' : 'Estreia:'}
                      </span>
                      <p className={`font-medium ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        {new Date(movie.releaseDate).getFullYear()}
                      </p>
                    </div>

                    {/* Tipo */}
                    <div>
                      <span className={`text-sm font-medium ${
                        weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Tipo:
                      </span>
                      <p className={`font-medium ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        {isMovie ? 'Filme' : 'Série'}
                      </p>
                    </div>

                    {/* Duração/Episódios */}
                    {details && (
                      <div>
                        <span className={`text-sm font-medium ${
                          weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {isMovie ? 'Duração:' : 'Episódios:'}
                        </span>
                        <p className={`font-medium ${
                          weather.isDaytime ? 'text-gray-800' : 'text-white'
                        }`}>
                          {isMovie 
                            ? `${(details as TMDBMovieDetails).runtime} min`
                            : `${(details as TMDBTVDetails).number_of_episodes} episódios em ${(details as TMDBTVDetails).number_of_seasons} temporadas`
                          }
                        </p>
                      </div>
                    )}

                    {/* Status */}
                    {details && (
                      <div>
                        <span className={`text-sm font-medium ${
                          weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          Status:
                        </span>
                        <p className={`font-medium ${
                          weather.isDaytime ? 'text-gray-800' : 'text-white'
                        }`}>
                          {details.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sinopse */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  Sinopse
                </h3>
                <p className={`leading-relaxed ${
                  weather.isDaytime ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {movie.overview || 'Sinopse não disponível.'}
                </p>
              </div>

              {/* Gêneros */}
              {movie.genres.length > 0 && (
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    Gêneros
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          weather.isDaytime
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-purple-800/50 text-purple-200'
                        }`}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observações */}
              {movie.notes && (
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    Observações
                  </h3>
                  <div className={`p-4 rounded-xl ${
                    weather.isDaytime ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700/30'
                  }`}>
                    <p className={`italic ${
                      weather.isDaytime ? 'text-yellow-800' : 'text-yellow-200'
                    }`}>
                      "{movie.notes}"
                    </p>
                  </div>
                </div>
              )}

              {/* Informações adicionais do TMDB */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                  <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                    Carregando detalhes...
                  </p>
                </div>
              ) : details && (
                <div className="space-y-4">
                  {/* Tagline */}
                  {details.tagline && (
                    <div>
                      <h3 className={`text-lg font-bold mb-3 ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        Tagline
                      </h3>
                      <p className={`italic text-lg ${
                        weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        "{details.tagline}"
                      </p>
                    </div>
                  )}

                  {/* Produção */}
                  {details.production_companies && details.production_companies.length > 0 && (
                    <div>
                      <h3 className={`text-lg font-bold mb-3 ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        Produção
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.production_companies.slice(0, 5).map((company, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              weather.isDaytime
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-blue-800/50 text-blue-200'
                            }`}
                          >
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links externos */}
                  <div>
                    <h3 className={`text-lg font-bold mb-3 ${
                      weather.isDaytime ? 'text-gray-800' : 'text-white'
                    }`}>
                      Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {details.homepage && (
                        <a
                          href={details.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                            weather.isDaytime
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          🌐 Site Oficial
                        </a>
                      )}
                      {movie.imdbId && (
                        <a
                          href={`https://www.imdb.com/title/${movie.imdbId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                            weather.isDaytime
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-yellow-600 text-white hover:bg-yellow-700'
                          }`}
                        >
                          🎬 IMDb
                        </a>
                      )}
                      <a
                        href={`https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${movie.tmdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                          weather.isDaytime
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        🎭 TMDB
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações da recomendação */}
              <div className={`p-4 rounded-xl ${
                weather.isDaytime ? 'bg-gray-50' : 'bg-gray-800'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  Sobre esta recomendação
                </h3>
                <div className="space-y-2 text-sm">
                  <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span className="font-medium">Recomendado por:</span> {movie.createdBy}
                  </p>
                  <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span className="font-medium">Adicionado em:</span> {new Date(movie.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span className="font-medium">Participantes:</span> {movie.participants.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-6 border-t ${
          weather.isDaytime ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
              weather.isDaytime
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
