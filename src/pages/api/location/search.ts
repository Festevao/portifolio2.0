import { NextApiRequest, NextApiResponse } from 'next';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  place_id: number;
  osm_type: string;
  osm_id: number;
}

interface LocationSearchResponse {
  success: boolean;
  results?: {
    lat: number;
    lng: number;
    address: string;
    name: string;
    place_id: number;
  }[];
  message?: string;
}

/**
 * API para buscar endereços usando Nominatim OpenStreetMap
 * GET /api/location/search?q=endereco&limit=5
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationSearchResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { q, limit = '5' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro de busca (q) é obrigatório'
      });
    }

    // Validar limite
    const searchLimit = Math.min(parseInt(limit as string) || 5, 10);

    // Fazer requisição para Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${searchLimit}&countrycodes=br&accept-language=pt-BR`;
    
    console.log('🗺️ Buscando endereço:', nominatimUrl);

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Portifolio2.0/1.0 (cadef@example.com)', // User-Agent é requerido pela API do Nominatim
      }
    });

    if (!response.ok) {
      console.error('❌ Erro ao buscar endereço:', response.statusText);
      return res.status(response.status).json({
        success: false,
        message: 'Erro ao buscar endereço no serviço de mapas'
      });
    }

    const data: NominatimResult[] = await response.json();

    // Transformar dados para o formato esperado pelo frontend
    const results = data.map(result => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      name: result.name || result.display_name.split(',')[0],
      place_id: result.place_id
    }));

    console.log('✅ Endereços encontrados:', results.length);

    return res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    console.error('❌ Erro ao buscar endereço:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar endereço'
    });
  }
}
