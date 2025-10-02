import { WeatherData } from '@/types/Weather';
import Sun from './Sun';
import Moon from './Moon';
import Clouds from './Clouds';
import Rain from './Rain';

interface WeatherBackgroundProps {
  weather: WeatherData;
}

/**
 * Componente que renderiza o fundo animado baseado no clima
 * Ajusta cores, animações e elementos visuais de acordo com hora do dia e condições climáticas
 */
const WeatherBackground = ({ weather }: WeatherBackgroundProps) => {
  /**
   * Define as classes CSS baseadas no clima
   */
  const getBackgroundClasses = () => {
    if (weather.isDaytime) {
      return 'bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200';
    }
    return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-950';
  };

  return (
    <div className={`fixed inset-0 z-0 ${getBackgroundClasses()} transition-colors duration-1000`}>
      {/* Sol ou Lua */}
      {weather.isDaytime ? <Sun /> : <Moon />}

      {/* Nuvens se o céu estiver nublado ou chuvoso */}
      {(weather.condition === 'clouds' || weather.condition === 'rain' || weather.condition === 'thunderstorm') && (
        <Clouds isDaytime={weather.isDaytime} />
      )}

      {/* Chuva se estiver chovendo */}
      {(weather.condition === 'rain' || weather.condition === 'thunderstorm') && (
        <Rain isDaytime={weather.isDaytime} />
      )}

      {/* Overlay sutil para melhorar contraste */}
      <div className="absolute inset-0 bg-black/5" />
    </div>
  );
};

export default WeatherBackground;

