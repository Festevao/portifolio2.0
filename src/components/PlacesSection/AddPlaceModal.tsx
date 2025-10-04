import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CreatePlaceEventData } from '@/types/PlaceEvent';
import { WeatherData } from '@/types/Weather';
import MapComponent from './MapComponent';

// Importação dinâmica para evitar problemas de SSR
const MapComponentDynamic = dynamic(() => import('./MapComponent'), { ssr: false });

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (placeData: CreatePlaceEventData) => Promise<void>;
  weather: WeatherData;
  participants: string[];
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

/**
 * Modal para adicionar novo lugar usando OpenStreetMap (gratuito)
 */
const AddPlaceModal = ({ isOpen, onClose, onSave, weather, participants }: AddPlaceModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo por padrão
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Busca endereço usando API route interna (evita problemas de CSP)
   */
  const searchAddress = async (query: string) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `/api/location/search?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();

      if (!data.success) {
        console.error('Erro na busca:', data.message);
        alert(data.message || 'Erro ao buscar endereço. Tente novamente.');
        return;
      }

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const newLocation: LocationData = {
          lat: result.lat,
          lng: result.lng,
          address: result.address,
          name: result.name
        };
        
        console.log('Endereço encontrado:', newLocation);
        setLocation(newLocation);
        setMapCenter([newLocation.lat, newLocation.lng]);
        
        // Força atualização do mapa
        setTimeout(() => {
          setMapCenter([newLocation.lat, newLocation.lng]);
        }, 100);
      } else {
        alert('Endereço não encontrado. Tente uma busca mais específica.');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar endereço. Tente novamente.');
    }
  };

  /**
   * Handle da seleção de localização no mapa
   */
  const handleLocationSelect = (newLocation: LocationData) => {
    console.log('handleLocationSelect chamado com:', newLocation);
    setLocation(newLocation);
  };

  /**
   * Salva o lugar
   */
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título do lugar');
      return;
    }

    if (!location) {
      alert('Por favor, selecione uma localização no mapa');
      return;
    }

    setLoading(true);
    try {
      const placeData: CreatePlaceEventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        location: {
          name: location.name,
          address: location.address,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          }
        },
        date: formData.date ? new Date(formData.date) : undefined
      };

      await onSave(placeData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar lugar:', error);
      alert('Erro ao salvar lugar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fecha o modal e limpa os dados
   */
  const handleClose = () => {
    setFormData({ title: '', description: '', date: '' });
    setLocation(null);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

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
            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${
              weather.isDaytime ? 'text-gray-800' : 'text-white'
            }`}>
              🗺️ Adicionar Novo Lugar
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Título do Lugar *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Restaurante Japonês, Parque Ibirapuera..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    weather.isDaytime
                      ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                      : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Observações sobre o lugar..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                    weather.isDaytime
                      ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                      : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Data do Evento (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    weather.isDaytime
                      ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                      : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                  }`}
                />
              </div>

              {/* Busca de endereço */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Buscar Endereço
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        searchAddress(searchQuery);
                      }
                    }}
                    placeholder="Digite um endereço..."
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      weather.isDaytime
                        ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                        : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                    }`}
                  />
                  <button
                    onClick={() => searchAddress(searchQuery)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      weather.isDaytime
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-500 text-white hover:bg-purple-400'
                    }`}
                  >
                    🔍
                  </button>
                </div>
                <p className={`text-xs mt-1 ${
                  weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                }`}>
                  Digite o endereço e pressione Enter ou clique em 🔍
                </p>
              </div>

              {/* Localização selecionada */}
              {location && (
                <div className={`p-4 rounded-xl border ${
                  weather.isDaytime
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-900/30 border-green-700'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    weather.isDaytime ? 'text-green-800' : 'text-green-200'
                  }`}>
                    📍 Localização Selecionada
                  </h4>
                  <p className={`text-sm ${
                    weather.isDaytime ? 'text-green-700' : 'text-green-300'
                  }`}>
                    <strong>{location.name}</strong>
                  </p>
                  <p className={`text-xs ${
                    weather.isDaytime ? 'text-green-600' : 'text-green-400'
                  }`}>
                    {location.address}
                  </p>
                </div>
              )}
            </div>

            {/* Mapa */}
            <div className="h-80 lg:h-96">
              <div className="h-full rounded-xl overflow-hidden border-2 border-gray-300">
                <MapComponentDynamic
                  key={`${mapCenter[0]}-${mapCenter[1]}`} // Força re-render quando centro muda
                  center={mapCenter}
                  location={location}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
              <p className={`text-xs mt-2 text-center ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
              }`}>
                Digite um endereço e clique em 🔍 para localizar no mapa
              </p>
            </div>
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
              disabled={loading || !formData.title.trim() || !location}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                weather.isDaytime
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? '💾 Salvando...' : '✅ Salvar Lugar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlaceModal;
