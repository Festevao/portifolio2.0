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
import MoviesSection from '@/components/MoviesSection/MoviesSection';
import MessagesSection from '@/components/MessagesSection/MessagesSection';
import DailyQuestionSection from '@/components/DailyQuestionSection/DailyQuestionSection';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/hooks/useAuth';

interface OurSpaceProps {
  meUser: User;
  otherUser: User;
  needsPassword: boolean;
}

/**
 * Página "Nosso Espaço" - um ambiente personalizado para dois usuários
 * Com fundo animado baseado no clima e tutorial interativo com IA
 */
const OurSpace = ({ meUser, otherUser, needsPassword }: OurSpaceProps) => {
  const { latitude, longitude, error: geoError, loading: geoLoading, source } = useGeolocation();
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth(meUser.username);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [aiGreeting, setAiGreeting] = useState<string>('Este é o nosso cantinho especial 💜');
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Flag para garantir hidratação consistente
  useEffect(() => {
    setIsClient(true);
  }, []);

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
   * Gera saudação personalizada com IA (alternando entre modo normal e fofoqueira)
   */
  const generateAiGreeting = async () => {
    try {
      const useFofoqueira = Math.random() < 0.1;
      const apiEndpoint = useFofoqueira || true ? '/api/ai-greeting/fofoqueira' : '/api/ai-greeting/generate';
      
      console.log(`🤖 Usando ${useFofoqueira ? 'MODO FOFOQUEIRA 👀' : 'modo normal'}`);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: meUser.nome.split(' ')[0], // Primeiro nome
          userGender: meUser.gender,
          participants: [meUser.username, otherUser.username]
        })
      });

      const data = await response.json();
      
      if (data.success && data.greeting) {
        setAiGreeting(data.greeting);
      }
    } catch (error) {
      console.error('Erro ao gerar saudação personalizada:', error);
      // Mantém a saudação padrão em caso de erro
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  /**
   * Carrega saudação personalizada quando a página é carregada
   */
  useEffect(() => {
    generateAiGreeting();
  }, [meUser.username, otherUser.username]);

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

  const formatGreeting = (greeting: string) => {
    if (greeting.startsWith('"') && greeting.endsWith("'")) {
      return greeting.slice(1, -1);
    }
    if (greeting.startsWith('"') && greeting.endsWith("'")) {
      return greeting.slice(1, -1);
    }
    return greeting;
  };

  /**
   * Redireciona para login se usuário não está autenticado
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = window.location.href;
      const loginUrl = needsPassword 
        ? `/auth/set-password?me=${meUser.username}&returnUrl=${encodeURIComponent(currentUrl)}`
        : `/auth/login?me=${meUser.username}&returnUrl=${encodeURIComponent(currentUrl)}`;
      
      window.location.href = loginUrl;
    }
  }, [isAuthenticated, authLoading, needsPassword, meUser.username]);

  const isLoading = geoLoading || weatherLoading || authLoading;

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
              {!isClient || authLoading
                ? 'Verificando acesso...'
                : geoLoading 
                  ? (source === 'ip' 
                      ? 'Carregando informações...' 
                      : 'Carregando informações...'
                    )
                  : 'Buscando informações do clima...'
              }
            </p>
            {isClient && geoLoading && source === 'ip' && (
              <p className="text-white/80 text-sm mt-2">
                Carregando informações...
              </p>
            )}
            {(!isClient || authLoading) && (
              <p className="text-white/80 text-sm mt-2">
                Verificando suas credenciais...
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  // Se não está autenticado mas não está carregando, não renderizar nada
  // O useEffect acima vai redirecionar
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Redirecionando...</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
            <p className="text-white text-xl font-semibold">
              Redirecionando para autenticação...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Se não tiver clima ainda mas não há erro, continue carregando
  if (!weather && !geoError) {
    return null;
  }

  // Se há erro e não conseguiu obter localização por IP, mostrar erro final
  if (geoError && !latitude && !longitude) {
    return (
      <>
        <Head>
          <title>Erro - Nosso Espaço</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar informações</h2>
            <p className="text-gray-700 mb-4 font-medium">
              Não foi possível carregar as informações do clima.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Tente recarregar a página ou verificar sua conexão com a internet. Se o problema persistir, contate o suporte.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Tentar Novamente
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
      <div className="relative min-h-screen flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden z-10">
        <div className="w-full max-w-4xl relative z-20">
          {/* Header de Boas-vindas */}
          <div className={`text-center mt-24 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-6 border transition-all duration-500 ${
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
                <div className={`text-base md:text-lg transition-colors duration-500 ${
                  weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                }`}>
                  {isLoadingGreeting ? (
                    <div className="flex items-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                      <span>Este é o nosso cantinho especial 💜</span>
                    </div>
                  ) : (
                    <p className="animate-fade-in">{formatGreeting(aiGreeting)}</p>
                  )}
                </div>
              </div>
              </div>
            </div>

          {/* Seção da Pergunta do Dia */}
          <DailyQuestionSection 
            weather={weather} 
            participants={[meUser.username, otherUser.username]} 
            meUser={meUser}
            otherUser={otherUser}
          />

          {/* Seção de Mensagens */}
          <MessagesSection 
            weather={weather} 
            participants={[meUser.username, otherUser.username]} 
            meUser={meUser}
            otherUser={otherUser}
          />

          {/* Seção de Lugares */}
          <PlacesSection weather={weather} participants={[meUser.username, otherUser.username]} />

          {/* Seção de Músicas */}
          <MusicSection weather={weather} participants={[meUser.username, otherUser.username]} />

          {/* Seção de Filmes e Séries */}
          <MoviesSection weather={weather} participants={[meUser.username, otherUser.username]} />

        </div>
      </div>
    </SessionProvider>
  );
};

/**
 * Valida os query params e busca os usuários antes de renderizar
 * Redireciona para home se algum usuário não existir
 * Verifica se o usuário "me" precisa definir senha
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
    // Usar NEXTAUTH_URL como base URL (deve ser pública)
    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
        
    // Buscar usuários
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

    // Verificar se usuário "me" precisa definir senha
    const passwordCheckResponse = await fetch(`${baseUrl}/api/auth/check-password?username=${me}`);
    const passwordCheckData = await passwordCheckResponse.json();

    let needsPassword = false;
    if (passwordCheckResponse.ok && passwordCheckData.success && passwordCheckData.userExists) {
      needsPassword = passwordCheckData.needsPassword;
    }

    return {
      props: {
        meUser: usersData.users.me,
        otherUser: usersData.users.other,
        needsPassword,
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
