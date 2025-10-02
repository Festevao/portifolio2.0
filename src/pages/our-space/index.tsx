import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { User } from '@/types/User';
import { WeatherData } from '@/types/Weather';
import WeatherBackground from '@/components/WeatherBackground/WeatherBackground';
import TutorialModal from '@/components/TutorialModal/TutorialModal';
import PlacesSection from '@/components/PlacesSection/PlacesSection';
import MusicSection from '@/components/MusicSection/MusicSection';
import { useGeolocation } from '@/hooks/useGeolocation';

interface OurSpaceProps {
  meUser: User;
  otherUser: User;
}

/**
 * Página "Nosso Espaço" - um ambiente personalizado para dois usuários
 * Com fundo animado baseado no clima e tutorial interativo com IA
 */
const OurSpace = ({ meUser, otherUser }: OurSpaceProps) => {
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  /**
   * Verifica se o tutorial já foi concluído
   */
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  /**
   * Busca o clima quando a localização estiver disponível
   */
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  /**
   * Busca dados do clima baseado nas coordenadas
   */
  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);

    try {
      const response = await fetch(`/api/weather/get?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar clima');
      }

      const data = await response.json();

      if (data.success && data.weather) {
        setWeather(data.weather);
      } else {
        throw new Error(data.message || 'Erro ao buscar clima');
      }
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      // Clima padrão em caso de erro
      setWeather({
        temperature: 25,
        description: 'clima desconhecido',
        condition: 'clear',
        isDaytime: true,
        city: 'Desconhecida',
        country: 'BR'
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  /**
   * Callback quando o tutorial é concluído
   */
  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  /**
   * Solicita permissão de localização novamente
   */
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => window.location.reload(),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            '🔒 Permissão de localização negada.\n\n' +
            'Para permitir:\n\n' +
            '• Chrome/Edge: Clique no ícone 🔒 ao lado da URL → Permissões → Localização → Permitir\n\n' +
            '• Firefox: Clique no ícone 🔒 ao lado da URL → Permissões → Localização → Permitir\n\n' +
            '• Safari: Safari → Preferências → Sites → Localização → Permitir\n\n' +
            'Depois de permitir, clique em "Tentar Novamente".'
          );
        } else {
          alert('Erro ao obter localização. Tente novamente.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const isLoading = geoLoading || weatherLoading;

  /**
   * Renderiza tela de loading
   */
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Carregando...</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
            <p className="text-white text-xl font-semibold">
              {geoLoading ? 'Obtendo sua localização...' : 'Buscando informações do clima...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  /**
   * Renderiza erro de geolocalização
   */
  if (geoError) {
    return (
      <>
        <Head>
          <title>Erro - Nosso Espaço</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Permissão de Localização</h2>
            <p className="text-gray-700 mb-4 font-medium">{geoError}</p>
            <p className="text-sm text-gray-600 mb-6">
              Esta página precisa da sua localização para mostrar o clima atual e criar um ambiente personalizado. ✨
            </p>

            {/* Instruções */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 font-semibold mb-2">💡 Como permitir:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Clique no ícone 🔒 ao lado da URL</li>
                <li>• Localize "Localização" nas permissões</li>
                <li>• Selecione "Permitir"</li>
                <li>• Clique no botão abaixo</li>
              </ul>
            </div>

            <button 
              onClick={requestLocationPermission}
              className="w-full bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-3"
            >
              🌍 Permitir Localização
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition-all"
            >
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <SessionProvider>
      <Head>
        <title>Nosso Espaço - {meUser.nome}</title>
      </Head>

      <WeatherBackground weather={weather} />

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal meUser={meUser} onComplete={handleTutorialComplete} />
      )}

      {/* Conteúdo Principal */}
      <div className="relative min-h-screen flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-4xl z-10">
          {/* Header de Boas-vindas */}
          <div className={`text-center backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-6 border transition-all duration-500 ${
            weather.isDaytime 
              ? 'bg-white/40 border-white/30' 
              : 'bg-purple-950/40 border-purple-800/30'
          }`}>
            <div className="flex flex-col items-center gap-4">
              {meUser.avatar && (
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse ${
                    weather.isDaytime 
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-500'
                  }`} />
                  <img 
                    src={meUser.avatar} 
                    alt={meUser.nome}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 shadow-xl transition-all duration-500 ${
                      weather.isDaytime 
                        ? 'border-amber-200/70' 
                        : 'border-white/50'
                    }`}
                  />
                </div>
              )}
              
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-800' : 'text-white'
                }`}>
                  Bem-vind{meUser.gender === "FEM" ? "a" : "o"}, {meUser.nome.split(' ')[0]}! ✨
                </h1>
                <p className={`text-base md:text-lg transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                }`}>
                  Este é o nosso cantinho especial 💜
                </p>
              </div>
            </div>
          </div>

          {/* Seção de Lugares */}
          <PlacesSection weather={weather} participants={[meUser.username, otherUser.username]} />

          {/* Seção de Músicas */}
          <MusicSection weather={weather} participants={[meUser.username, otherUser.username]} />

          {/* Botão para rever tutorial */}
          <div className="text-center">
            <button
              onClick={() => {
                localStorage.removeItem('tutorialCompleted');
                setShowTutorial(true);
              }}
              className={`px-4 py-2 rounded-full font-medium shadow-lg transform hover:scale-105 transition-all text-sm ${
                weather.isDaytime
                  ? 'bg-white/80 text-purple-600 hover:bg-white'
                  : 'bg-purple-600/80 text-white hover:bg-purple-600'
              }`}
            >
              🤖 Rever Tutorial
            </button>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

/**
 * Valida os query params e busca os usuários antes de renderizar
 * Redireciona para home se algum usuário não existir
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { me, other } = context.query;

  if (!me || !other || typeof me !== 'string' || typeof other !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    const usersResponse = await fetch(`${baseUrl}/api/users/check?me=${me}&other=${other}`);
    
    if (!usersResponse.ok) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const usersData = await usersResponse.json();

    if (!usersData.success || !usersData.users) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        meUser: usersData.users.me,
        otherUser: usersData.users.other,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default OurSpace;
