import { useState } from 'react';
import { SpotifyTrack } from '@/types/SharedPlaylist';
import { WeatherData } from '@/types/Weather';

interface MusicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: SpotifyTrack | null;
  weather: WeatherData;
}

/**
 * Modal para visualizar detalhes completos de uma música da playlist com player embebido
 */
const MusicDetailsModal = ({ isOpen, onClose, track, weather }: MusicDetailsModalProps) => {
  const [playerType, setPlayerType] = useState<'embed' | 'preview'>('embed');

  if (!isOpen || !track) return null;

  /**
   * Formata duração em mm:ss
   */
  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return '';
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Formata data para exibição
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Gera URL do embed do Spotify para uma música
   */
  const getSpotifyEmbedUrl = () => {
    return `https://open.spotify.com/embed/track/${track.id}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden ${
        weather.isDaytime 
          ? 'bg-white/90 border border-white/20' 
          : 'bg-purple-950/90 border border-purple-800/20'
      }`}>
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header fixo */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎵</div>
              <div>
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  {track.name}
                </h3>
                <p className={`text-xs sm:text-sm ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
                }`}>
                  {track.artists[0].name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações da Música */}
              <div className="space-y-6">
                {/* Capa e informações básicas */}
                <div className="flex items-start gap-4">
                  {track.album.images[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-lg"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-2 ${
                      weather.isDaytime ? 'text-gray-800' : 'text-white'
                    }`}>
                      {track.name}
                    </h4>
                    
                    <div className={`space-y-1 text-sm ${
                      weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                    }`}>
                      <p className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{track.artists[0].name}</span>
                      </p>
                      
                      {track.album && (
                        <p className="flex items-center gap-2">
                          <span>💿</span>
                          <span>{track.album.name}</span>
                        </p>
                      )}
                      
                      {track.duration_ms && (
                        <p className="flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{formatDuration(track.duration_ms)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informações de Adição */}
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    ℹ️ Informações
                  </h4>
                  <div className={`p-4 rounded-xl ${
                    weather.isDaytime
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-gray-900/30 border border-gray-700/30'
                  }`}>
                    <div className="space-y-2 text-sm">
                        <p className={`${
                          weather.isDaytime ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          <strong>ID Spotify:</strong> {track.id}
                        </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  🎵 Player
                </h4>

                {/* Botões de tipo de player */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlayerType('embed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      playerType === 'embed'
                        ? weather.isDaytime
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500 text-white'
                        : weather.isDaytime
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-700 text-white hover:bg-purple-600'
                    }`}
                  >
                    🎧 Player Completo
                  </button>
                  {track.preview_url && (
                    <button
                      onClick={() => setPlayerType('preview')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        playerType === 'preview'
                          ? weather.isDaytime
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-500 text-white'
                          : weather.isDaytime
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-purple-700 text-white hover:bg-purple-600'
                      }`}
                    >
                      ▶️ Preview (30s)
                    </button>
                  )}
                </div>

                {/* Player embebido do Spotify */}
                {playerType === 'embed' && (
                  <div className="rounded-xl overflow-hidden border-2 border-gray-300">
                    <iframe
                      src={getSpotifyEmbedUrl()}
                      width="100%"
                      height="380"
                      frameBorder="0"
                      allow="encrypted-media"
                      className="w-full"
                    />
                  </div>
                )}

                {/* Player de preview */}
                {playerType === 'preview' && track.preview_url && (
                  <div className={`p-6 rounded-xl border-2 ${
                    weather.isDaytime
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-purple-900/30 border-purple-700/30'
                  }`}>
                    <div className="text-center">
                      <div className="mb-4">
                        {track.album.images[0] && (
                          <img
                            src={track.album.images[0].url}
                            alt={track.name}
                            className="w-32 h-32 rounded-lg object-cover mx-auto shadow-lg"
                          />
                        )}
                      </div>
                      
                      <h5 className={`text-lg font-bold mb-2 ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        {track.name}
                      </h5>
                      
                      <p className={`text-sm mb-4 ${
                        weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                      }`}>
                        {track.artists[0].name}
                      </p>
                      
                      <audio
                        controls
                        className="w-full"
                        preload="metadata"
                      >
                        <source src={track.preview_url} type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                      
                      <p className={`text-xs mt-2 ${
                        weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                      }`}>
                        Preview de 30 segundos
                      </p>
                    </div>
                  </div>
                )}

                {/* Link para Spotify */}
                <div className="text-center">
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                      weather.isDaytime
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    🎵 Abrir no Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Fechar */}
          <div className="flex justify-center p-4 sm:p-6 border-t border-white/20 flex-shrink-0">
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                weather.isDaytime
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-purple-700 text-white hover:bg-purple-600'
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicDetailsModal;