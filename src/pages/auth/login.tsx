import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface LoginPageProps {
  username: string;
  returnUrl?: string;
}

/**
 * Página de login para acessar o espaço protegido
 */
const LoginPage = ({ username, returnUrl }: LoginPageProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Submete o formulário de login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Digite sua senha');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Salvar tokens no localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Redirecionar
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          router.push('/');
        }
      } else {
        if (data.needsPassword) {
          // Usuário precisa definir senha primeiro
          const setPasswordUrl = `/auth/set-password?me=${username}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
          router.push(setPasswordUrl);
        } else {
          setError(data.message || 'Erro no login');
        }
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - {username}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Área Protegida
            </h1>
            <p className="text-gray-600">
              Olá <strong>{username}</strong>! <br />
              Digite sua senha para acessar seu espaço.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm font-medium">
                  ❌ {error}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite sua senha"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                '🚀 Entrar no Meu Espaço'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Esqueceu sua senha? Entre em contato com o suporte. 💜
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Valida se o usuário existe e redireciona conforme necessário
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { me, returnUrl } = context.query;

  if (!me || typeof me !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    // Verificar se usuário precisa definir senha
    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    const response = await fetch(`${baseUrl}/api/auth/check-password?username=${me}`);
    const data = await response.json();

    if (!data.success || !data.userExists) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // Se usuário precisa definir senha, redirecionar
    if (data.needsPassword) {
      const setPasswordUrl = `/auth/set-password?me=${me}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl as string)}` : ''}`;
      
      return {
        redirect: {
          destination: setPasswordUrl,
          permanent: false,
        },
      };
    }

    return {
      props: {
        username: me,
        returnUrl: returnUrl as string || null,
      },
    };
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default LoginPage;
