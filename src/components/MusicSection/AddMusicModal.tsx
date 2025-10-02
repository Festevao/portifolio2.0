import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/Weather';
import { SpotifySearchResult, SpotifyTrack } from '@/types/SharedPlaylist';

interface AddMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trackId: string) => Promise<void>;
  weather: WeatherData;
  participants: string[];
}

/**
 * Modal para adicionar nova música à playlist compartilhada
 */
const AddMusicModal = ({ isOpen, onClose, onSave, weather, participants }: AddMusicModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifySearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);

  /**
   * Busca músicas no Spotify
   */
  const searchSpotify = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track`);
      const data = await response.json();
      
      if (data.tracks) {
        setSearchResults(data);
      } else {
        alert('Erro ao buscar músicas');
      }
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      alert('Erro ao buscar músicas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Seleciona uma música da busca
   */
  const selectTrack = (track: SpotifyTrack) => {
    setSelectedTrack(track);
  };

  /**
   * Adiciona a música à playlist
   */
  const handleSave = async () => {
    if (!selectedTrack) {
      alert('Por favor, selecione uma música');
      return;
    }

    setLoading(true);
    try {
      await onSave(selectedTrack.id);
      handleClose();
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      alert('Erro ao adicionar música. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fecha o modal e limpa os dados
   */
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSelectedTrack(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden ${
        weather.isDaytime 
          ? 'bg-white/90 border border-white/20' 
          : 'bg-purple-950/90 border border-purple-800/20'
      }`}>
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header fixo */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
              weather.isDaytime ? 'text-gray-800' : 'text-white'
            }`}>
              🎵 Adicionar Música à Playlist
            </h3>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-all hover:scale-110 flex-shrink-0 ${
                weather.isDaytime
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-purple-700 hover:bg-purple-600 text-white'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
              {/* Busca */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Buscar Música no Spotify
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        searchSpotify(searchQuery);
                      }
                    }}
                    placeholder="Digite o nome da música ou artista..."
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      weather.isDaytime
                        ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                        : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                    }`}
                  />
                  <button
                    onClick={() => searchSpotify(searchQuery)}
                    disabled={loading}
                    className={`px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${
                      weather.isDaytime
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-500 text-white hover:bg-purple-400'
                    }`}
                  >
                    {loading ? '🔍' : '🔍'}
                  </button>
                </div>
                <p className={`text-xs mt-1 ${
                  weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                }`}>
                  Digite o nome e pressione Enter ou clique em 🔍
                </p>
              </div>

              {/* Resultados da busca */}
              {searchResults && searchResults.tracks?.items && (
                <div className="space-y-4">
                  <h4 className={`text-lg font-semibold ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    Resultados da Busca
                  </h4>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.tracks.items.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedTrack?.id === track.id
                            ? weather.isDaytime
                              ? 'bg-purple-100 border-purple-300'
                              : 'bg-purple-800/50 border-purple-600'
                            : weather.isDaytime
                              ? 'bg-white/50 border-gray-200 hover:bg-white/70'
                              : 'bg-purple-900/30 border-purple-700/30 hover:bg-purple-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {track.album.images[0] && (
                            <img
                              src={track.album.images[0].url}
                              alt={track.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              weather.isDaytime ? 'text-gray-800' : 'text-white'
                            }`}>
                              {track.name}
                            </p>
                            <p className={`text-sm truncate ${
                              weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                            }`}>
                              {track.artists[0].name} • {track.album.name}
                            </p>
                            {track.preview_url && (
                              <p className={`text-xs ${
                                weather.isDaytime ? 'text-green-600' : 'text-green-400'
                              }`}>
                                🎧 Preview disponível
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Música selecionada */}
              {selectedTrack && (
                <div className={`p-4 rounded-xl border ${
                  weather.isDaytime
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-900/30 border-green-700'
                }`}>
                  <h4 className={`font-medium mb-3 ${
                    weather.isDaytime ? 'text-green-800' : 'text-green-200'
                  }`}>
                    🎵 Música Selecionada
                  </h4>
                  
                  <div className="flex items-start gap-3">
                    {selectedTrack.album.images[0] && (
                      <img
                        src={selectedTrack.album.images[0].url}
                        alt={selectedTrack.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    
                    <div className="flex-1">
                      <p className={`font-bold ${
                        weather.isDaytime ? 'text-green-800' : 'text-green-200'
                      }`}>
                        {selectedTrack.name}
                      </p>
                      <p className={`text-sm ${
                        weather.isDaytime ? 'text-green-600' : 'text-green-300'
                      }`}>
                        {selectedTrack.artists[0].name} • {selectedTrack.album.name}
                      </p>
                      {selectedTrack.preview_url && (
                        <p className={`text-xs mt-1 ${
                          weather.isDaytime ? 'text-green-600' : 'text-green-400'
                        }`}>
                          🎧 Preview de 30s disponível
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões fixos */}
          <div className="flex gap-3 p-4 sm:p-6 border-t border-white/20 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                weather.isDaytime
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-purple-700 text-white hover:bg-purple-600'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !selectedTrack}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                weather.isDaytime
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? '💾 Adicionando...' : '✅ Adicionar à Playlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMusicModal;