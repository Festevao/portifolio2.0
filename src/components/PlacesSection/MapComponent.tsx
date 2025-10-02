import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix para ícones do Leaflet no Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

interface MapComponentProps {
  center: [number, number];
  location: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
}

/**
 * Componente do mapa com eventos de clique usando ref
 */
const MapComponent = ({ center, location, onLocationSelect }: MapComponentProps) => {
  const mapRef = useRef<L.Map>(null);

  // Move o mapa quando o centro muda
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13);
    }
  }, [center]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      const handleClick = async (e: L.LeafletMouseEvent) => {
        console.log('Mapa clicado!', e.latlng);
        const { lat, lng } = e.latlng;
        
        try {
          // Busca endereço reverso usando Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const result = await response.json();
          
          console.log('Resultado da busca reversa:', result);
          
          const newLocation: LocationData = {
            lat,
            lng,
            address: result.display_name || 'Localização selecionada',
            name: result.address?.name || result.address?.road || 'Local selecionado'
          };
          
          console.log('Nova localização:', newLocation);
          onLocationSelect(newLocation);
        } catch (error) {
          console.error('Erro ao buscar endereço reverso:', error);
          onLocationSelect({
            lat,
            lng,
            address: 'Localização selecionada',
            name: 'Local selecionado'
          });
        }
      };

      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }
  }, [onLocationSelect]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {location && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div>
              <strong>{location.name}</strong>
              <br />
              {location.address}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;