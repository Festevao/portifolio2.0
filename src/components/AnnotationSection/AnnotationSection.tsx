import { useState, useEffect } from 'react';
import { Annotation } from '@/types/Annotation';
import { WeatherData } from '@/types/Weather';
import AddAnnotationModal from './AddAnnotationModal';
import SearchAnnotationModal from './SearchAnnotationModal';

interface AnnotationSectionProps {
  weather: WeatherData;
  participants: string[];
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
}

/**
 * Seção de anotações pessoais - "Descobertas sobre você"
 * Permite criar anotações e buscar com IA
 */
const AnnotationSection = ({ weather, participants, meUser, otherUser }: AnnotationSectionProps) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;

  /**
   * Carrega anotações do usuário sobre o outro usuário
   */
  const loadAnnotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/annotations/list?fromUser=${meUser.username}&aboutUser=${otherUser.username}`);
      const data = await response.json();
      
      if (data.success && data.annotations) {
        setAnnotations(data.annotations);
        setCurrentPage(1); // Reset para primeira página quando recarrega
      }
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega anotações quando componente monta
   */
  useEffect(() => {
    loadAnnotations();
  }, [meUser.username, otherUser.username]);

  /**
   * Salva uma nova anotação
   */
  const saveAnnotation = async (content: string) => {
    try {
      const response = await fetch('/api/annotations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUser: meUser.username,
          aboutUser: otherUser.username,
          content: content.trim()
        })
      });

      const data = await response.json();

      if (data.success && data.annotation) {
        // Recarrega as anotações
        loadAnnotations();
        setShowAddModal(false);
      } else {
        alert(`Erro ao salvar anotação: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      alert('Erro ao salvar anotação');
    }
  };

  /**
   * Deleta uma anotação
   */
  const deleteAnnotation = async (annotationId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta anotação?')) {
      return;
    }

    try {
      const response = await fetch('/api/annotations/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annotationId,
          fromUser: meUser.username
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recarrega as anotações
        loadAnnotations();
      } else {
        alert(`Erro ao deletar anotação: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
      alert('Erro ao deletar anotação');
    }
  };

  /**
   * Formata a data de criação
   */
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cálculos de paginação
  const totalPages = Math.ceil(annotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnotations = annotations.slice(startIndex, endIndex);

  /**
   * Navega para uma página específica
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Seção Principal */}
      <div className={`backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-6 border transition-all duration-500 ${
        weather.isDaytime 
          ? 'bg-white/40 border-white/30' 
          : 'bg-purple-950/40 border-purple-800/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📝</div>
            <div>
              <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                Descobertas sobre {otherUser.nome.split(' ')[0]}
              </h2>
              <p className={`text-sm transition-colors duration-500 ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                Suas anotações pessoais sobre esta pessoa
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowSearchModal(true)}
              disabled={annotations.length === 0}
              className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-full font-medium transition-all duration-300 ${
                annotations.length === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                  : weather.isDaytime
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="hidden sm:inline">🔍 Buscar</span>
              <span className="sm:hidden">🔍</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-full font-medium transition-all duration-300 ${
                weather.isDaytime
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="hidden sm:inline">➕ Anotar</span>
              <span className="sm:hidden">➕</span>
            </button>
          </div>
        </div>

        {/* Lista de Anotações */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className={`transition-colors duration-500 ${
              weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
            }`}>
              Carregando anotações...
            </p>
          </div>
        ) : annotations.length === 0 ? (
          <div className={`text-center py-8 transition-colors duration-500 ${
            weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
          }`}>
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg font-medium mb-2">Nenhuma anotação ainda</p>
            <p className="text-sm">
              Comece criando suas primeiras descobertas sobre {otherUser.nome.split(' ')[0]}!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lista de anotações da página atual */}
            <div className="space-y-3 sm:space-y-4">
              {currentAnnotations.map((annotation, index) => (
                <div 
                  key={annotation._id || index}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${
                    weather.isDaytime
                      ? 'bg-white/60 border-white/50 hover:bg-white/70'
                      : 'bg-purple-900/40 border-purple-700/50 hover:bg-purple-900/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                        weather.isDaytime ? 'text-gray-800' : 'text-white'
                      }`}>
                        {annotation.content}
                      </p>
                      <p className={`text-xs mt-2 transition-colors duration-500 ${
                        weather.isDaytime ? 'text-gray-500' : 'text-purple-300'
                      }`}>
                        {formatDate(annotation.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAnnotation(annotation._id!)}
                      className={`self-end sm:self-start text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full transition-all duration-300 ${
                        weather.isDaytime
                          ? 'text-red-600 hover:bg-red-100'
                          : 'text-red-400 hover:bg-red-900/30'
                      }`}
                      title="Deletar anotação"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/20">
                {/* Info da página */}
                <div className={`text-sm transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                }`}>
                  Página {currentPage} de {totalPages} • {annotations.length} anotações total
                </div>

                {/* Navegação */}
                <div className="flex items-center gap-2">
                  {/* Primeira página */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : weather.isDaytime
                          ? 'text-purple-600 hover:bg-purple-100'
                          : 'text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    ⏮️
                  </button>

                  {/* Página anterior */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : weather.isDaytime
                          ? 'text-purple-600 hover:bg-purple-100'
                          : 'text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    ◀️
                  </button>

                  {/* Números das páginas */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 text-xs rounded-full font-medium transition-all duration-300 ${
                            currentPage === pageNum
                              ? weather.isDaytime
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-purple-500 text-white shadow-lg'
                              : weather.isDaytime
                                ? 'text-purple-600 hover:bg-purple-100'
                                : 'text-purple-300 hover:bg-purple-900/30'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Próxima página */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : weather.isDaytime
                          ? 'text-purple-600 hover:bg-purple-100'
                          : 'text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    ▶️
                  </button>

                  {/* Última página */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : weather.isDaytime
                          ? 'text-purple-600 hover:bg-purple-100'
                          : 'text-purple-300 hover:bg-purple-900/30'
                    }`}
                  >
                    ⏭️
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAnnotationModal
          weather={weather}
          otherUser={otherUser}
          onSave={saveAnnotation}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showSearchModal && (
        <SearchAnnotationModal
          weather={weather}
          meUser={meUser}
          otherUser={otherUser}
          onClose={() => setShowSearchModal(false)}
        />
      )}
    </>
  );
};

export default AnnotationSection;
