import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherResponse, WeatherData } from '@/types/Weather';

/**
 * API route que busca informações do clima baseado em coordenadas
 * Recebe latitude e longitude como query params
 * Usa a API Open-Meteo (gratuita, sem necessidade de API key)
 * Documentação: https://open-meteo.com/en/docs
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { lat, lon } = req.query;

  if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'Os parâmetros "lat" e "lon" são obrigatórios' 
    });
  }

  try {
    // Busca dados atuais com todos os parâmetros necessários
    // Baseado em: https://open-meteo.com/en/docs
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,cloud_cover,precipitation,rain,showers,snowfall&timezone=auto`;
    
    console.log('🌤️ Buscando clima:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error('❌ Erro ao buscar dados do clima:', response.statusText);
      return res.status(response.status).json({ 
        success: false, 
        message: 'Erro ao buscar dados do clima' 
      });
    }

    const data = await response.json();

    // is_day: 1 = dia, 0 = noite
    const isDaytime = data.current.is_day === 1;
    
    // weather_code: código WMO do clima (0-99)
    const weatherCode = data.current.weather_code;
    
    // Determina a condição do clima com base em múltiplos fatores
    const weatherCondition = determineWeatherCondition(
      weatherCode,
      data.current.cloud_cover,
      data.current.precipitation,
      data.current.rain,
      data.current.showers,
      data.current.snowfall
    );

    const weatherData: WeatherData = {
      temperature: Math.round(data.current.temperature_2m),
      description: getWeatherDescription(weatherCode),
      condition: weatherCondition,
      isDaytime,
      city: await getCityName(parseFloat(lat), parseFloat(lon)),
      country: 'BR'
    };

    console.log('✅ Clima processado:', weatherData);

    return res.status(200).json({
      success: true,
      weather: weatherData
    });
  } catch (error) {
    console.error('❌ Erro ao buscar clima:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
}

/**
 * Determina a condição do clima com base em múltiplos parâmetros
 * Prioriza precipitação atual sobre código WMO para maior precisão
 */
function determineWeatherCondition(
  code: number,
  cloudCover: number,
  precipitation: number,
  rain: number,
  showers: number,
  snowfall: number
): WeatherData['condition'] {
  // Prioridade 1: Verificar neve ativa
  if (snowfall > 0) {
    console.log('❄️ Neve detectada:', snowfall);
    return 'snow';
  }

  // Prioridade 2: Verificar chuva ativa
  if (precipitation > 0 || rain > 0 || showers > 0) {
    console.log('🌧️ Chuva detectada - precipitation:', precipitation, 'rain:', rain, 'showers:', showers);
    
    // Verificar se é tempestade (código 95-99)
    if (code >= 95) {
      console.log('⛈️ Tempestade detectada');
      return 'thunderstorm';
    }
    
    return 'rain';
  }

  // Prioridade 3: Usar código WMO
  // 0: Clear sky (céu limpo)
  if (code === 0) {
    console.log('☀️ Céu limpo detectado');
    return 'clear';
  }
  
  // 1-3: Mainly clear, partly cloudy, and overcast
  if (code >= 1 && code <= 3) {
    // Usar cobertura de nuvens para decisão mais precisa
    if (cloudCover < 20) {
      console.log('☀️ Predominantemente limpo - cloud cover:', cloudCover);
      return 'clear';
    }
    console.log('☁️ Nublado - cloud cover:', cloudCover);
    return 'clouds';
  }
  
  // 45, 48: Fog (neblina = nuvens baixas)
  if (code === 45 || code === 48) {
    console.log('🌫️ Neblina detectada');
    return 'clouds';
  }
  
  // 51-57: Drizzle (garoa)
  if (code >= 51 && code <= 57) {
    console.log('🌧️ Garoa (código)');
    return 'rain';
  }
  
  // 61-67: Rain (chuva)
  if (code >= 61 && code <= 67) {
    console.log('🌧️ Chuva (código)');
    return 'rain';
  }
  
  // 71-77: Snow (neve)
  if (code >= 71 && code <= 77) {
    console.log('❄️ Neve (código)');
    return 'snow';
  }
  
  // 80-86: Rain/Snow showers (pancadas)
  if (code >= 80 && code <= 86) {
    console.log('🌧️ Pancadas (código)');
    return 'rain';
  }
  
  // 95-99: Thunderstorm (tempestade)
  if (code >= 95 && code <= 99) {
    console.log('⛈️ Tempestade (código)');
    return 'thunderstorm';
  }
  
  // Fallback: usar cobertura de nuvens
  if (cloudCover > 50) {
    console.log('☁️ Nublado (fallback) - cloud cover:', cloudCover);
    return 'clouds';
  }
  
  console.log('☀️ Limpo (fallback) - cloud cover:', cloudCover);
  return 'clear';
}

/**
 * Retorna descrição em português do código WMO do clima
 * Baseado em: https://open-meteo.com/en/docs#weathervariables
 */
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'céu limpo',
    1: 'predominantemente limpo',
    2: 'parcialmente nublado',
    3: 'nublado',
    45: 'neblina',
    48: 'neblina com geada',
    51: 'garoa leve',
    53: 'garoa moderada',
    55: 'garoa forte',
    56: 'garoa congelante leve',
    57: 'garoa congelante forte',
    61: 'chuva leve',
    63: 'chuva moderada',
    65: 'chuva forte',
    66: 'chuva congelante leve',
    67: 'chuva congelante forte',
    71: 'neve leve',
    73: 'neve moderada',
    75: 'neve forte',
    77: 'granizo',
    80: 'pancadas de chuva leves',
    81: 'pancadas de chuva moderadas',
    82: 'pancadas de chuva fortes',
    85: 'pancadas de neve leves',
    86: 'pancadas de neve fortes',
    95: 'tempestade',
    96: 'tempestade com granizo leve',
    99: 'tempestade com granizo forte'
  };

  return descriptions[code] || 'céu limpo';
}

/**
 * Busca o nome da cidade usando geocoding reverso
 * Usa a API BigDataCloud (gratuita, sem necessidade de API key)
 * Documentação: https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
 */
async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    // BigDataCloud Free Reverse Geocoding API
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
    );

    const data = await response.json();
    
    // Prioridade: city > locality > principalSubdivision
    const cityName = data.city || data.locality || data.principalSubdivision || 'Sua Localização';
    
    return cityName;
  } catch (error) {
    console.error('⚠️ Erro ao buscar nome da cidade:', error);
    return 'Sua Localização';
  }
}
