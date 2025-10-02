/**
 * Representa as informações do clima
 */
export interface WeatherData {
  temperature: number;
  description: string;
  condition: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm';
  isDaytime: boolean;
  city: string;
  country: string;
}

/**
 * Resposta da API de clima
 */
export interface WeatherResponse {
  success: boolean;
  weather?: WeatherData;
  message?: string;
}

