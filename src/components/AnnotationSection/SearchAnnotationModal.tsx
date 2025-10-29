import { useState } from 'react';
import { WeatherData } from '@/types/Weather';
import { Annotation } from '@/types/Annotation';

interface SearchAnnotationModalProps {
  weather: WeatherData;
  meUser: {
    username: string;
    nome: string;
    avatar?: string;
  };
  otherUser: {
    username: string;
    nome: string;
    avatar?: string;
  };
  onClose: () => void;
}

/**
 * Modal para busca inteligente nas anotações usando IA
 */
const SearchAnnotationModal = ({ weather, meUser, otherUser, onClose }: SearchAnnotationModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Realiza busca com IA
   */
  const handleSearch = async () => {
    if (!prompt.trim()) {
      alert('Digite o que você está procurando');
      return;
    }

    if (prompt.trim().length < 10) {
      alert('A busca deve ter pelo menos 10 caracteres');
      return;
    }

    try {
      setSearching(true);
      setHasSearched(false);
      setSearchResult('');
      setFilteredAnnotations([]);

      const response = await fetch('/api/annotations/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUser: meUser.username,
          aboutUser: otherUser.username,
          prompt: prompt.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setFilteredAnnotations(data.relevantAnnotations || []);
        setSearchResult(data.searchResults || '');
        setHasSearched(true);
      } else {
        alert(`Erro na busca: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao realizar busca');
    } finally {
      setSearching(false);
    }
  };

  /**
   * Exemplo de prompts
   */
  const examplePrompts = [
    'Vai ser aniversário dessa pessoa, me ajude a descobrir informações úteis que posso usar',
    'Preciso comprar um presente, quais são os gostos e preferências dela?',
    'Vamos sair para jantar, o que ela gosta de comer?',
    'Quero planejar um encontro divertido, que atividades ela curte?'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 z-50">
      <div className={`w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border transition-all duration-500 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto ${
        weather.isDaytime 
          ? 'bg-white/95 border-white/50' 
          : 'bg-purple-950/95 border-purple-800/50'
      }`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl">🔍</div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  Busca Inteligente
                </h3>
                <p className={`text-xs sm:text-sm transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                }`}>
                  IA vai analisar suas anotações sobre {otherUser.nome.split(' ')[0]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={searching}
              className={`text-xl sm:text-2xl p-1 transition-colors duration-300 ${
                searching 
                  ? 'opacity-50 cursor-not-allowed'
                  : weather.isDaytime 
                    ? 'text-gray-600 hover:text-gray-800' 
                    : 'text-purple-300 hover:text-white'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Exemplos de prompts */}
          <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl transition-colors duration-500 ${
            weather.isDaytime ? 'bg-blue-50' : 'bg-purple-900/30'
          }`}>
            <p className={`text-xs sm:text-sm font-medium mb-3 transition-colors duration-500 ${
              weather.isDaytime ? 'text-blue-800' : 'text-blue-300'
            }`}>
              💡 Exemplos de buscas:
            </p>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  disabled={searching}
                  className={`w-full text-left text-xs p-2 rounded-lg transition-all duration-300 ${
                    searching
                      ? 'opacity-50 cursor-not-allowed'
                      : weather.isDaytime
                        ? 'text-blue-700 hover:bg-blue-100 border border-blue-200'
                        : 'text-blue-200 hover:bg-purple-800/50 border border-purple-700'
                  }`}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Campo de busca */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors duration-500 ${
              weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
            }`}>
              O que você está procurando?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Vai ser aniversário dessa pessoa, me ajude a descobrir informações úteis..."
              className={`w-full h-16 sm:h-20 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border resize-none transition-all duration-300 ${
                weather.isDaytime
                  ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500'
                  : 'bg-purple-900/40 border-purple-700 text-white placeholder-purple-300 focus:border-purple-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              maxLength={300}
              disabled={searching}
            />
            <div className={`text-right text-xs mt-1 transition-colors duration-500 ${
              weather.isDaytime ? 'text-gray-500' : 'text-purple-300'
            }`}>
              {prompt.length}/300 caracteres
            </div>
          </div>

          {/* Botão de busca */}
          <button
            onClick={handleSearch}
            disabled={searching || !prompt.trim() || prompt.trim().length < 10}
            className={`w-full py-2 sm:py-3 px-4 text-sm sm:text-base rounded-xl font-medium mb-4 sm:mb-6 transition-all duration-300 ${
              searching || !prompt.trim() || prompt.trim().length < 10
                ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                : weather.isDaytime
                  ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {searching ? (
              <div className="flex items-center justify-center gap-2">
                <div className="inline-block animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white"></div>
                <span className="text-xs sm:text-sm">Analisando suas anotações...</span>
              </div>
            ) : (
              '🤖 Buscar com IA'
            )}
          </button>

          {/* Resultado da busca */}
          {hasSearched && (
            <div className="space-y-4">
              {/* Anotações encontradas */}
              {filteredAnnotations.length > 0 ? (
                <div className={`p-4 rounded-xl border transition-all duration-500 ${
                  weather.isDaytime 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-blue-900/20 border-blue-700/50'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-lg">📋</div>
                    <h4 className={`font-medium transition-colors duration-500 ${
                      weather.isDaytime ? 'text-blue-800' : 'text-blue-300'
                    }`}>
                      {filteredAnnotations.length} Anotação{filteredAnnotations.length > 1 ? 'ões' : ''} Relevante{filteredAnnotations.length > 1 ? 's' : ''}:
                    </h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {filteredAnnotations.map((annotation, index) => (
                      <div 
                        key={annotation._id || index}
                        className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                          weather.isDaytime
                            ? 'bg-white/70 border-blue-200'
                            : 'bg-blue-800/20 border-blue-600/30'
                        }`}
                      >
                        <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-500 ${
                          weather.isDaytime ? 'text-blue-900' : 'text-blue-100'
                        }`}>
                          {annotation.content}
                        </p>
                        <p className={`text-xs mt-1 transition-colors duration-500 ${
                          weather.isDaytime ? 'text-blue-600' : 'text-blue-300'
                        }`}>
                          {new Date(annotation.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border text-center transition-all duration-500 ${
                  weather.isDaytime 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-gray-900/20 border-gray-700/50'
                }`}>
                  <div className="text-3xl mb-2">🔍</div>
                  <p className={`font-medium transition-colors duration-500 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-gray-300'
                  }`}>
                    Nenhuma anotação relevante encontrada
                  </p>
                  <p className={`text-sm mt-1 transition-colors duration-500 ${
                    weather.isDaytime ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Tente refinar sua busca ou criar mais anotações
                  </p>
                </div>
              )}

              {/* Sugestão da IA (se houver) */}
              {searchResult && (
                <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-500 ${
                  weather.isDaytime 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-green-900/20 border-green-700/50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-base sm:text-lg">🤖</div>
                    <h4 className={`text-sm sm:text-base font-medium transition-colors duration-500 ${
                      weather.isDaytime ? 'text-green-800' : 'text-green-300'
                    }`}>
                      Sugestão da IA:
                    </h4>
                  </div>
                  <div className={`text-xs sm:text-sm leading-relaxed transition-colors duration-500 ${
                    weather.isDaytime ? 'text-green-700' : 'text-green-200'
                  }`}>
                    {searchResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botão fechar */}
          <div className="flex justify-end mt-4 sm:mt-6">
            <button
              onClick={onClose}
              disabled={searching}
              className={`w-full sm:w-auto py-2 px-4 sm:px-6 text-sm sm:text-base rounded-xl font-medium transition-all duration-300 ${
                searching
                  ? 'opacity-50 cursor-not-allowed'
                  : weather.isDaytime
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-purple-800 text-white hover:bg-purple-700'
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

export default SearchAnnotationModal;
