import { useState } from 'react';
import { WeatherData } from '@/types/Weather';

interface AddAnnotationModalProps {
  weather: WeatherData;
  otherUser: {
    username: string;
    nome: string;
    avatar?: string;
  };
  onSave: (content: string) => Promise<void>;
  onClose: () => void;
}

/**
 * Modal para adicionar nova anotação
 */
const AddAnnotationModal = ({ weather, otherUser, onSave, onClose }: AddAnnotationModalProps) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  /**
   * Salva a anotação
   */
  const handleSave = async () => {
    if (!content.trim()) {
      alert('Digite o conteúdo da anotação');
      return;
    }

    if (content.trim().length < 3) {
      alert('A anotação deve ter pelo menos 3 caracteres');
      return;
    }

    try {
      setSaving(true);
      await onSave(content);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 z-50">
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border transition-all duration-500 max-h-[90vh] overflow-y-auto ${
        weather.isDaytime 
          ? 'bg-white/95 border-white/50' 
          : 'bg-purple-950/95 border-purple-800/50'
      }`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl">📝</div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  Nova Anotação
                </h3>
                <p className={`text-xs sm:text-sm transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                }`}>
                  Sobre {otherUser.nome.split(' ')[0]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className={`text-xl sm:text-2xl p-1 transition-colors duration-300 ${
                saving 
                  ? 'opacity-50 cursor-not-allowed'
                  : weather.isDaytime 
                    ? 'text-gray-600 hover:text-gray-800' 
                    : 'text-purple-300 hover:text-white'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Exemplos de anotações */}
          <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl transition-colors duration-500 ${
            weather.isDaytime ? 'bg-blue-50' : 'bg-purple-900/30'
          }`}>
            <p className={`text-xs sm:text-sm font-medium mb-2 transition-colors duration-500 ${
              weather.isDaytime ? 'text-blue-800' : 'text-blue-300'
            }`}>
              💡 Exemplos de anotações:
            </p>
            <ul className={`text-xs space-y-1 transition-colors duration-500 ${
              weather.isDaytime ? 'text-blue-700' : 'text-blue-200'
            }`}>
              <li>• Descobri que gosta de sushi</li>
              <li>• Tem medo de altura</li>
              <li>• Aniversário é em março</li>
              <li>• Gosta de filmes de terror</li>
            </ul>
          </div>

          {/* Campo de texto */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors duration-500 ${
              weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
            }`}>
              O que você descobriu?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Descobri que gosta muito de chocolate..."
              className={`w-full h-20 sm:h-24 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border resize-none transition-all duration-300 ${
                weather.isDaytime
                  ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500'
                  : 'bg-purple-900/40 border-purple-700 text-white placeholder-purple-300 focus:border-purple-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              maxLength={500}
              disabled={saving}
            />
            <div className={`text-right text-xs mt-1 transition-colors duration-500 ${
              weather.isDaytime ? 'text-gray-500' : 'text-purple-300'
            }`}>
              {content.length}/500 caracteres
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className={`w-full sm:flex-1 py-2 sm:py-3 px-4 text-sm sm:text-base rounded-xl font-medium transition-all duration-300 ${
                saving
                  ? 'opacity-50 cursor-not-allowed'
                  : weather.isDaytime
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-purple-800 text-white hover:bg-purple-700'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className={`w-full sm:flex-1 py-2 sm:py-3 px-4 text-sm sm:text-base rounded-xl font-medium transition-all duration-300 ${
                saving || !content.trim()
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                  : weather.isDaytime
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white"></div>
                  <span className="text-xs sm:text-sm">Salvando...</span>
                </div>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnnotationModal;
