import { useState, useEffect } from 'react';
import { PlaceEvent, CreatePlaceEventData, PaginationInfo } from '@/types/PlaceEvent';
import { WeatherData } from '@/types/Weather';
import { isEventUpcoming, getEventHighlightColor, getEventProximityText, getEventTextColor } from '@/utils/eventUtils';
import AddPlaceModal from './AddPlaceModal';
import PlaceDetailsModal from './PlaceDetailsModal';

interface PlacesSectionProps {
  weather: WeatherData;
  participants: string[];
}

/**
 * Seção de lugares para ir - lista eventos e permite adicionar novos
 */
const PlacesSection = ({ weather, participants }: PlacesSectionProps) => {
  const [places, setPlaces] = useState<PlaceEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceEvent | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Carrega a lista de lugares filtrados por participantes com paginação
   */
  const loadPlaces = async (page: number = 1) => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/places/list?participants=${participantsParam}&page=${page}&limit=5`);
      const data = await response.json();
      
      if (data.success && data.placeEvents) {
        setPlaces(data.placeEvents);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Erro ao carregar lugares:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deleta um lugar
   */
  const deletePlace = async (placeId: string) => {
    if (!confirm('Tem certeza que deseja deletar este lugar?')) {
      return;
    }

    try {
      const response = await fetch(`/api/places/delete?id=${placeId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarrega a página atual após deletar
        await loadPlaces(currentPage);
      } else {
        alert('Erro ao deletar lugar: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao deletar lugar:', error);
      alert('Erro ao deletar lugar');
    }
  };

  /**
   * Salva um novo lugar
   */
  const savePlace = async (placeData: CreatePlaceEventData) => {
    try {
      const response = await fetch('/api/places/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...placeData,
          participants: participants
        })
      });

      const data = await response.json();

      if (data.success && data.placeEvent) {
        // Recarrega a primeira página para mostrar o novo evento
        await loadPlaces(1);
        setShowAddModal(false);
      } else {
        throw new Error(data.message || 'Erro ao criar lugar');
      }
    } catch (error) {
      console.error('Erro ao salvar lugar:', error);
      throw error;
    }
  };

  /**
   * Abre modal de detalhes de um lugar
   */
  const openPlaceDetails = (place: PlaceEvent) => {
    setSelectedPlace(place);
    setShowDetailsModal(true);
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

  useEffect(() => {
    loadPlaces();
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
            <div className="text-3xl sm:text-4xl">🗺️</div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                Bora lá qualquer hora ?
              </h2>
              <p className={`text-sm sm:text-base ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                {places.length} {places.length === 1 ? 'lugar' : 'lugares'} cadastrado{places.length !== 1 ? 's' : ''}
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
            {/* Lista de lugares */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Carregando lugares...
                </p>
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📍</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Nenhum lugar cadastrado ainda
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  Clique no botão abaixo para adicionar o primeiro!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place) => {
                  const isUpcoming = isEventUpcoming(place);
                  const highlightColor = getEventHighlightColor(place, weather.isDaytime);
                  const proximityText = getEventProximityText(place);
                  const textColor = getEventTextColor(place, weather.isDaytime);
                  
                  return (
                    <div
                      key={place._id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer relative overflow-hidden ${
                        isUpcoming && highlightColor
                          ? `${highlightColor} border-transparent shadow-lg`
                          : weather.isDaytime
                            ? 'bg-white/40 border-white/30 hover:bg-white/50'
                            : 'bg-purple-900/40 border-purple-700/30 hover:bg-purple-900/50'
                      }`}
                      onClick={() => openPlaceDetails(place)}
                    >
                      {/* Badge de proximidade */}
                      {isUpcoming && proximityText && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                          weather.isDaytime
                            ? 'bg-yellow-500 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          {proximityText}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h3 className={`font-bold text-lg mb-2 ${textColor}`}>
                            📍 {place.title}
                          </h3>
                          
                          {place.description && (
                            <p className={`text-sm ${
                              isUpcoming 
                                ? weather.isDaytime ? 'text-gray-700' : 'text-gray-200'
                                : weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                            }`}>
                              💭 {place.description}
                            </p>
                          )}
                          
                          {place.date && (
                            <p className={`text-xs mt-1 ${
                              isUpcoming
                                ? weather.isDaytime ? 'text-gray-600' : 'text-gray-300'
                                : weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                            }`}>
                              📅 {new Date(place.date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          
                          {!place.description && !place.date && (
                            <p className={`text-xs italic ${
                              weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                            }`}>
                              Clique para ver mais detalhes
                            </p>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlace(place._id!);
                          }}
                          className={`ml-4 p-2 rounded-full transition-all hover:scale-110 ${
                            weather.isDaytime
                              ? 'bg-red-100 hover:bg-red-200 text-red-600'
                              : 'bg-red-900/50 hover:bg-red-900/70 text-red-300'
                          }`}
                          title="Deletar lugar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {/* Controles de paginação */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <button
                      onClick={() => loadPlaces(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        weather.isDaytime
                          ? 'bg-white/40 text-gray-700 hover:bg-white/60 disabled:hover:bg-white/40'
                          : 'bg-purple-600/40 text-white hover:bg-purple-600/60 disabled:hover:bg-purple-600/40'
                      }`}
                    >
                      ← Anterior
                    </button>
                    
                    <span className={`text-sm font-medium ${
                      weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                    }`}>
                      Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => loadPlaces(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        weather.isDaytime
                          ? 'bg-white/40 text-gray-700 hover:bg-white/60 disabled:hover:bg-white/40'
                          : 'bg-purple-600/40 text-white hover:bg-purple-600/60 disabled:hover:bg-purple-600/40'
                      }`}
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Botão para adicionar */}
            <div className="pt-4 border-t border-white/20">
              <button
                onClick={() => setShowAddModal(true)}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  weather.isDaytime
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                ➕ Adicionar Novo Lugar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar lugar */}
      <AddPlaceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={savePlace}
        weather={weather}
        participants={participants}
      />

      {/* Modal de detalhes do lugar */}
      <PlaceDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPlace(null);
        }}
        place={selectedPlace}
        weather={weather}
      />
    </>
  );
};

export default PlacesSection;
