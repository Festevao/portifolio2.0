import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlaceEvent } from '@/types/PlaceEvent';
import { WeatherData } from '@/types/Weather';

// Importação dinâmica para evitar problemas de SSR
const MapComponentDynamic = dynamic(() => import('./MapComponent'), { ssr: false });

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceEvent | null;
  weather: WeatherData;
}

/**
 * Modal para visualizar detalhes completos de um lugar/evento
 */
const PlaceDetailsModal = ({ isOpen, onClose, place, weather }: PlaceDetailsModalProps) => {
  if (!isOpen || !place) return null;

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
   * Formata data relativa (ex: "há 2 dias")
   */
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Amanhã';
    if (diffDays <= 7) return `Em ${diffDays - 1} dias`;
    return formatDate(date);
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
              <div className="text-3xl">📍</div>
              <div>
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  {place.title}
                </h3>
                <p className={`text-xs sm:text-sm ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
                }`}>
                  Criado por {place.createdBy}
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
            {/* Informações do Evento */}
            <div className="space-y-6">
              {/* Descrição */}
              {place.description && (
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    💭 Descrição
                  </h4>
                  <div className={`p-4 rounded-xl ${
                    weather.isDaytime
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-purple-900/30 border border-purple-700/30'
                  }`}>
                    <p className={`${
                      weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                    }`}>
                      {place.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Data do Evento */}
              {place.date && (
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    📅 Data do Evento
                  </h4>
                  <div className={`p-4 rounded-xl ${
                    weather.isDaytime
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-blue-900/30 border border-blue-700/30'
                  }`}>
                    <p className={`font-medium ${
                      weather.isDaytime ? 'text-blue-800' : 'text-blue-200'
                    }`}>
                      {formatDate(place.date)}
                    </p>
                    <p className={`text-sm ${
                      weather.isDaytime ? 'text-blue-600' : 'text-blue-300'
                    }`}>
                      {formatRelativeDate(place.date)}
                    </p>
                  </div>
                </div>
              )}

              {/* Localização */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  🗺️ Localização
                </h4>
                <div className={`p-4 rounded-xl ${
                  weather.isDaytime
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-green-900/30 border border-green-700/30'
                }`}>
                  <div className="space-y-2">
                    <div>
                      <p className={`font-medium ${
                        weather.isDaytime ? 'text-green-800' : 'text-green-200'
                      }`}>
                        📍 {place.location.name}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${
                        weather.isDaytime ? 'text-green-600' : 'text-green-300'
                      }`}>
                        🏠 {place.location.address}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${
                        weather.isDaytime ? 'text-green-500' : 'text-green-400'
                      }`}>
                        📊 Coordenadas: {place.location.coordinates.lat.toFixed(6)}, {place.location.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participantes */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  👥 Participantes
                </h4>
                <div className={`p-4 rounded-xl ${
                  weather.isDaytime
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-purple-900/30 border border-purple-700/30'
                }`}>
                  <div className="flex flex-wrap gap-2">
                    {place.participants.map((participant, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          weather.isDaytime
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-purple-800 text-purple-200'
                        }`}
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informações de Criação */}
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
                      <strong>Criado em:</strong> {formatDate(place.createdAt)}
                    </p>
                    <p className={`${
                      weather.isDaytime ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      <strong>Última atualização:</strong> {formatDate(place.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="h-80 lg:h-96">
              <h4 className={`text-lg font-semibold mb-3 ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                🗺️ Localização no Mapa
              </h4>
              <div className="h-full rounded-xl overflow-hidden border-2 border-gray-300">
                <MapComponentDynamic
                  center={[place.location.coordinates.lat, place.location.coordinates.lng]}
                  location={{
                    lat: place.location.coordinates.lat,
                    lng: place.location.coordinates.lng,
                    address: place.location.address,
                    name: place.location.name
                  }}
                  onLocationSelect={() => {}} // Read-only, não faz nada
                />
              </div>
              <p className={`text-xs mt-2 text-center ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
              }`}>
                Visualização da localização do evento
              </p>
            </div>
          </div>
          </div>

          {/* Botão de Fechar fixo */}
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

export default PlaceDetailsModal;
