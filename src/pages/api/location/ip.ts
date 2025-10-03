import { NextApiRequest, NextApiResponse } from 'next';

interface IPLocationResponse {
  success: boolean;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  message?: string;
}

/**
 * API para obter localização do usuário baseada no endereço IP
 * Usado como fallback quando a geolocalização do navegador falha
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPLocationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    // Obter IP do usuário (considerando proxies)
    const forwarded = req.headers['x-forwarded-for'] as string;
    const userIP = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    // Se for localhost ou IP local, usar um IP público para teste
    let ipToUse = userIP;
    if (!userIP || userIP === '::1' || userIP === '127.0.0.1' || userIP?.startsWith('192.168.') || userIP?.startsWith('10.')) {
      // IP público do Google para teste em desenvolvimento
      ipToUse = '8.8.8.8';
    }

    // Usar serviço gratuito de geolocalização por IP
    const response = await fetch(`http://ip-api.com/json/${ipToUse}?fields=status,message,country,city,lat,lon`);
    
    if (!response.ok) {
      throw new Error('Erro ao consultar serviço de localização');
    }

    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error(data.message || 'Falha ao obter localização por IP');
    }

    return res.status(200).json({
      success: true,
      location: {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        country: data.country
      }
    });

  } catch (error) {
    console.error('Erro ao obter localização por IP:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao obter localização'
    });
  }
}
