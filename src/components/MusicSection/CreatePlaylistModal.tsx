import { useState } from 'react';
import { WeatherData } from '@/types/Weather';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (playlistUrl: string) => Promise<void>;
  weather: WeatherData;
}

const CreatePlaylistModal = ({ isOpen, onClose, onSave, weather }: CreatePlaylistModalProps) => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!playlistUrl.trim()) {
      alert('Por favor, insira a URL da playlist do Spotify.');
      return;
    }
    setLoading(true);
    try {
      await onSave(playlistUrl);
      onClose();
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      alert('Erro ao criar playlist. Verifique a URL e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden ${
        weather.isDaytime
          ? 'bg-white/90 border border-white/20'
          : 'bg-purple-950/90 border border-purple-800/20'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
              weather.isDaytime ? 'text-gray-800' : 'text-white'
            }`}>
              🔗 Criar Playlist Compartilhada
            </h3>
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

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <p className={`${weather.isDaytime ? 'text-gray-700' : 'text-purple-200'}`}>
              Para criar uma playlist compartilhada, por favor, crie uma playlist no Spotify e cole a URL dela aqui.
            </p>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
              }`}>
                URL da Playlist do Spotify
              </label>
              <input
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="Ex: https://open.spotify.com/playlist/..."
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  weather.isDaytime
                    ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                    : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                }`}
              />
            </div>
          </div>

          <div className="flex gap-3 p-4 sm:p-6 border-t border-white/20 flex-shrink-0">
            <button
              onClick={onClose}
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
              disabled={loading || !playlistUrl.trim()}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                weather.isDaytime
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? 'Criando...' : 'Criar Playlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
