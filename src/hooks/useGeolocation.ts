import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  source: 'gps' | 'ip' | null;
}

/**
 * Hook customizado para obter a localização do usuário
 * Tenta primeiro a Geolocation API do navegador
 * Se falhar, usa IP como fallback
 */
export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    source: null,
  });

  /**
   * Obtém localização via endereço IP como fallback
   */
  const getLocationByIP = async () => {
    try {
      const response = await fetch('/api/location/ip');
      const data = await response.json();

      if (data.success && data.location) {
        setState({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          error: null,
          loading: false,
          source: 'ip',
        });
      } else {
        setState({
          latitude: null,
          longitude: null,
          error: 'Não foi possível obter sua localização',
          loading: false,
          source: null,
        });
      }
    } catch (error) {
      console.error('Erro ao obter localização por IP:', error);
      setState({
        latitude: null,
        longitude: null,
        error: 'Erro ao obter localização por IP',
        loading: false,
        source: null,
      });
    }
  };

  useEffect(() => {
    // Verificar se a Geolocation API está disponível
    if (!navigator.geolocation) {
      // Se não estiver disponível, tentar por IP
      getLocationByIP();
      return;
    }

    // Tentar obter localização via GPS primeiro
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          source: 'gps',
        });
      },
      (error) => {
        console.warn('Geolocalização falhou, tentando por IP:', error.message);
        
        // Se falhar, tentar por IP como fallback
        getLocationByIP();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
};

