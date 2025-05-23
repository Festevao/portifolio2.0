import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ValidationPage = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Verifica se o query param 'access' está setado como 'vem'
    if (router.query.access === 'vem') {
      setIsAuthorized(true);
    } else if (router.isReady) {
      // Se o router está pronto e não tem o access correto, redireciona
      router.push('/');
    }
  }, [router.query.access, router.isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula uma validação/processamento
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (inputValue.trim().length > 0 && inputValue === 'a658b52f68') {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setInputValue('');
    setSubmitStatus('idle');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p>Verificando autorização...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Portal de Validação Institucional</title>
        <meta name="description" content="Portal de validação para acesso institucional" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative z-10 max-w-md w-full">
          {/* Container principal */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Imagem institucional */}
            <div className="text-center mb-8">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                <div className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center p-4">
                  <img
                    src="/img/education/ufsj.png"
                    alt="Logo UFSJ"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Texto Lorem Ipsum estilizado */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Portal Institucional UFSJ
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Validação de atestado de matrícula
                </p>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="validation-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificação
                </label>
                <input
                  id="validation-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Insira o código de validação"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Status do envio */}
              {submitStatus === 'success' && (
                <>
                  <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                    ✓ Validação realizada com sucesso!
                  </div>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/atestado de matrícula.pdf';
                      link.download = 'atestado-de-matricula.pdf';
                      link.click();
                    }}
                    className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Baixar Atestado de Matrícula
                  </button>
                </>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  ✗ Erro na validação. Não foi possível encontrar um atestado de matrícula para o código informado.
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Validando...
                    </div>
                  ) : (
                    'Validar'
                  )}
                </button>

                {submitStatus !== 'idle' && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </form>

            {/* Rodapé */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-xs">
                Portal seguro • Acesso restrito
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidationPage; 