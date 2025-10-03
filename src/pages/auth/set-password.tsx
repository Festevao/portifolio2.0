import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SetPasswordPageProps {
  username: string;
}

/**
 * Página para definir senha do usuário
 * Só acessível para usuários que ainda não têm senha
 */
const SetPasswordPage = ({ username }: SetPasswordPageProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Submete o formulário para definir senha
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/set-password', {
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
        setSuccess(true);
        setTimeout(() => {
          // Redirecionar de volta para our-space
          const returnUrl = router.query.returnUrl as string;
          if (returnUrl) {
            window.location.href = returnUrl;
          } else {
            router.push('/');
          }
        }, 2000);
      } else {
        setError(data.message || 'Erro ao definir senha');
      }
    } catch (error) {
      console.error('Erro ao definir senha:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Definir Senha - {username}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Senha Definida com Sucesso!
              </h2>
              <p className="text-gray-600 mb-4">
                Redirecionando você de volta...
              </p>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔐</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Definir Senha
                </h1>
                <p className="text-gray-600">
                  Olá <strong>{username}</strong>! <br />
                  Para acessar seu espaço, você precisa definir uma senha.
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
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Digite a senha novamente"
                    required
                    minLength={6}
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
                      Definindo Senha...
                    </div>
                  ) : (
                    '🔐 Definir Senha'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Esta senha será necessária sempre que você acessar seu espaço personalizado. 
                  Mantenha-a segura! 🔒
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Valida se o usuário existe e se precisa definir senha
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { me } = context.query;

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

    // Se usuário já tem senha, redirecionar para login
    if (!data.needsPassword) {
      const returnUrl = context.query.returnUrl as string;
      const loginUrl = `/auth/login?me=${me}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
      
      return {
        redirect: {
          destination: loginUrl,
          permanent: false,
        },
      };
    }

    return {
      props: {
        username: me,
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

export default SetPasswordPage;
