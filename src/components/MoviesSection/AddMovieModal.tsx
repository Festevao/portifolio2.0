import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/Weather';
import { CreateMovieRecommendationData, TMDBSearchResult, TMDBMovie, TMDBTVShow } from '@/types/MovieRecommendation';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movieData: CreateMovieRecommendationData) => Promise<void>;
  weather: WeatherData;
  participants: string[];
}

/**
 * Modal para adicionar nova recomendação de filme/série usando TMDB
 */
const AddMovieModal = ({ isOpen, onClose, onSave, weather, participants }: AddMovieModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [searchType, setSearchType] = useState<'multi' | 'movie' | 'tv'>('multi');

  /**
   * Busca filmes/séries no TMDB
   */
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}&type=${searchType}`);
      const data = await response.json();
      
      console.log('Search response:', data);
      console.log('Results count:', data.results?.length);
      console.log('First result:', data.results?.[0]);
      
      if (data.success && data.results) {
        setSearchResults(data.results);
        console.log('Search results set:', data.results.length);
      } else {
        console.log('No results or error:', data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      alert('Erro ao buscar filmes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Debounce da busca
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  /**
   * Fecha o modal e limpa o estado
   */
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMovie(null);
    setNotes('');
    onClose();
  };

  /**
   * Salva a recomendação
   */
  const handleSave = async () => {
    if (!selectedMovie) {
      alert('Selecione um filme ou série primeiro');
      return;
    }

    setLoading(true);
    try {
      const isMovie = 'title' in selectedMovie;
      const movieData: CreateMovieRecommendationData = {
        tmdbId: selectedMovie.id,
        title: isMovie ? selectedMovie.title : selectedMovie.name,
        originalTitle: isMovie ? selectedMovie.original_title : selectedMovie.original_name,
        overview: selectedMovie.overview,
        posterPath: selectedMovie.poster_path,
        backdropPath: selectedMovie.backdrop_path,
        releaseDate: isMovie ? selectedMovie.release_date : selectedMovie.first_air_date,
        voteAverage: selectedMovie.vote_average,
        voteCount: selectedMovie.vote_count,
        genres: [], // Será preenchido com detalhes se necessário
        type: isMovie ? 'movie' : 'tv',
        status: 'Released', // Valor padrão
        notes: notes.trim() || undefined
      };

      await onSave(movieData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar recomendação:', error);
      alert('Erro ao salvar recomendação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
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
              🎬 Adicionar Recomendação
            </h2>
            <button
              onClick={handleClose}
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
          {/* Tipo de busca */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              weather.isDaytime ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Tipo de busca:
            </label>
            <div className="flex gap-2">
              {[
                { value: 'multi', label: 'Tudo' },
                { value: 'movie', label: 'Filmes' },
                { value: 'tv', label: 'Séries' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSearchType(option.value as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchType === option.value
                      ? weather.isDaytime
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : weather.isDaytime
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de busca */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              weather.isDaytime ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Buscar filme ou série:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome do filme ou série..."
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                weather.isDaytime
                  ? 'bg-white border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-gray-800 border-gray-600 focus:ring-purple-400 focus:border-purple-400 text-white'
              }`}
            />
          </div>

          {/* Resultados da busca */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                Buscando...
              </p>
            </div>
          )}

          {searchResults.length > 0 && !loading && (
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-3 ${
                weather.isDaytime ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Resultados:
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((item) => {
                  const isMovie = 'title' in item;
                  const isSelected = selectedMovie?.id === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMovie(item)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                        isSelected
                          ? weather.isDaytime
                            ? 'bg-purple-50 border-purple-300'
                            : 'bg-purple-900/30 border-purple-600'
                          : weather.isDaytime
                            ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                          {item.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                              alt={isMovie ? item.title : item.name}
                              className="w-12 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className={`w-12 h-16 rounded flex items-center justify-center ${
                              weather.isDaytime ? 'bg-gray-200' : 'bg-gray-700'
                            }`}>
                              <span className="text-lg">🎬</span>
                            </div>
                          )}
                        </div>

                        {/* Informações */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium truncate ${
                            weather.isDaytime ? 'text-gray-800' : 'text-white'
                          }`}>
                            {isMovie ? item.title : item.name}
                          </h4>
                          <p className={`text-sm ${
                            weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {isMovie ? 'Filme' : 'Série'} • {isMovie ? item.release_date : item.first_air_date}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-500 text-sm">⭐</span>
                            <span className={`text-sm ${
                              weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {item.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observações */}
          {selectedMovie && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                weather.isDaytime ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Observações (opcional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Por que você recomenda este filme/série?"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                  weather.isDaytime
                    ? 'bg-white border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-gray-800 border-gray-600 focus:ring-purple-400 focus:border-purple-400 text-white'
                }`}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-6 border-t ${
          weather.isDaytime ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                weather.isDaytime
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedMovie || loading}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                weather.isDaytime
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? 'Salvando...' : 'Salvar Recomendação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
