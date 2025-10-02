import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/Weather';
import { DailyQuestion } from '@/types/DailyQuestion';

interface DailyQuestionSectionProps {
  weather: WeatherData;
  participants: string[];
  meUser: {
    username: string;
    nome: string;
    avatar?: string;
  };
  otherUser: {
    username: string;
    nome: string;
    avatar?: string;
  };
}

/**
 * Seção da pergunta do dia - gerada por IA com base no contexto dos usuários
 */
const DailyQuestionSection = ({ weather, participants, meUser, otherUser }: DailyQuestionSectionProps) => {
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  /**
   * Carrega a pergunta do dia atual ou gera uma nova automaticamente
   */
  const loadTodayQuestion = async () => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/daily-question/get?participants=${participantsParam}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.question) {
          // Pergunta já existe
          setQuestion(data.question);
          // Verificar se o usuário atual ainda não respondeu
          const userAnswered = data.question.answers?.some((answer: any) => answer.username === meUser.username);
          if (!userAnswered) {
            setExpanded(true); // Auto-expandir se o usuário ainda não respondeu
          }
          setLoading(false);
        } else {
          // Não há pergunta para hoje, gerar automaticamente
          await generateQuestionAutomatically();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pergunta do dia:', error);
      setLoading(false);
    }
  };

  /**
   * Gera uma pergunta automaticamente (sem interação do usuário)
   */
  const generateQuestionAutomatically = async () => {
    try {
      const response = await fetch('/api/daily-question/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participants })
      });

      const data = await response.json();
      
      if (data.success && data.question) {
        setQuestion(data.question);
        setExpanded(true); // Auto-expandir pergunta nova
      } else {
        console.error('Erro ao gerar pergunta:', data.message);
      }
    } catch (error) {
      console.error('Erro ao gerar pergunta automaticamente:', error);
    } finally {
      setLoading(false);
    }
  };


  /**
   * Responde a pergunta do dia
   */
  const answerQuestion = async () => {
    if (!question || !answer.trim()) return;

    setAnswering(true);
    try {
      const response = await fetch('/api/daily-question/answer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: question._id,
          answer: answer.trim(),
          answeredBy: meUser.username
        })
      });

      const data = await response.json();
      
      if (data.success && data.question) {
        setQuestion(data.question);
        setAnswer('');
        setShowAnswerForm(false);
      } else {
        throw new Error(data.message || 'Erro ao responder pergunta');
      }
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      alert('Erro ao responder pergunta: ' + (error as Error).message);
    } finally {
      setAnswering(false);
    }
  };

  /**
   * Obtém informações do usuário pelo username
   */
  const getUserInfo = (username: string) => {
    if (username === meUser.username) {
      return meUser;
    } else if (username === otherUser.username) {
      return otherUser;
    }
    return { username, nome: username, avatar: undefined };
  };

  useEffect(() => {
    loadTodayQuestion();
  }, []);

  return (
    <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 transition-all duration-300 ${
      weather.isDaytime 
        ? 'bg-white/30 border border-white/20' 
        : 'bg-purple-950/30 border border-purple-800/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl">🤔</div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold ${
              weather.isDaytime ? 'text-gray-800' : 'text-white'
            }`}>
              Pergunta do Dia
            </h2>
            <div className="flex items-center gap-2">
              <p className={`text-sm sm:text-base ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                {question ? (
                  (() => {
                    const userAnswered = question.answers?.some(answer => answer.username === meUser.username);
                    const totalAnswers = question.answers?.length || 0;
                    const totalParticipants = question.participants.length;
                    
                    if (userAnswered) {
                      return `✅ Você respondeu • ${totalAnswers}/${totalParticipants} respostas`;
                    } else {
                      return `💭 Aguardando sua resposta • ${totalAnswers}/${totalParticipants} respostas`;
                    }
                  })()
                ) : '🎯 Gerada por IA'}
              </p>
              {question && !question.answers?.some(answer => answer.username === meUser.username) && (
                <div className="relative">
                  <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-2 sm:p-3 rounded-full transition-all transform hover:scale-105 ${
            weather.isDaytime
              ? 'bg-white/50 hover:bg-white/70 text-gray-700'
              : 'bg-purple-600/50 hover:bg-purple-600/70 text-white'
          }`}
        >
          <span className={`text-lg sm:text-xl transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </button>
      </div>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                {question ? 'Carregando pergunta do dia...' : 'Gerando pergunta personalizada...'}
              </p>
              {!question && (
                <p className={`text-sm mt-2 ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  Nossa IA está analisando suas atividades para criar uma pergunta única! ✨
                </p>
              )}
            </div>
          ) : question ? (
            <div className="space-y-4">
              {/* Pergunta */}
              <div className={`p-6 rounded-xl border-2 ${
                question.answers && question.answers.length > 0
                  ? weather.isDaytime
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-900/20 border-green-700/50'
                  : weather.isDaytime
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-blue-900/20 border-blue-700/50'
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-2xl">🤖</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      weather.isDaytime ? 'text-gray-800' : 'text-white'
                    }`}>
                      Pergunta Gerada por IA
                    </h3>
                    <p className={`text-base leading-relaxed ${
                      weather.isDaytime ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                      {question.question}
                    </p>
                  </div>
                </div>
                
                <div className={`text-xs ${
                  weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                }`}>
                  Criada em {new Date(question.createdAt).toLocaleDateString('pt-BR')} • 
                  Baseada em {question.contextData.moviesCount} filmes, {question.contextData.placesCount} lugares, {question.contextData.messagesCount} mensagens
                </div>
              </div>

              {/* Respostas dos usuários */}
              {question.answers && question.answers.length > 0 && (
                <div className="space-y-4">
                  <h4 className={`font-semibold text-lg ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    Respostas ({question.answers.length}/{question.participants.length})
                  </h4>
                  
                  {question.answers.map((answer, index) => {
                    const userInfo = getUserInfo(answer.username);
                    return (
                      <div key={index} className={`p-6 rounded-xl border ${
                        weather.isDaytime
                          ? 'bg-white/40 border-white/30'
                          : 'bg-purple-900/40 border-purple-700/30'
                      }`}>
                        <div className="flex items-start gap-3">
                          {/* Avatar do usuário que respondeu */}
                          <div className="flex-shrink-0">
                            {userInfo.avatar ? (
                              <img
                                src={userInfo.avatar}
                                alt={userInfo.nome}
                                className="w-10 h-10 rounded-full object-cover border-2 shadow-lg"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                                answer.username === meUser.username
                                  ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              }`}>
                                {userInfo.nome.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h5 className={`font-semibold mb-2 ${
                              weather.isDaytime ? 'text-gray-800' : 'text-white'
                            }`}>
                              {answer.username === meUser.username ? 'Sua resposta' : `Resposta de ${userInfo.nome}`}
                            </h5>
                            <p className={`text-sm leading-relaxed ${
                              weather.isDaytime ? 'text-gray-700' : 'text-gray-200'
                            }`}>
                              {answer.answer}
                            </p>
                            <div className={`text-xs mt-2 ${
                              weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                            }`}>
                              Respondida em {new Date(answer.answeredAt).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formulário de resposta (se o usuário ainda não respondeu) */}
              {!question.answers?.some(answer => answer.username === meUser.username) && (
                <div className="space-y-3">
                  {!showAnswerForm ? (
                    <button
                      onClick={() => setShowAnswerForm(true)}
                      className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                        weather.isDaytime
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700'
                          : 'bg-gradient-to-r from-green-600 to-purple-600 text-white hover:from-green-700 hover:to-purple-700'
                      }`}
                    >
                      💬 Responder Pergunta
                    </button>
                  ) : (
                    <div className={`p-4 rounded-xl border ${
                      weather.isDaytime
                        ? 'bg-white/20 border-white/30'
                        : 'bg-purple-900/20 border-purple-700/30'
                    }`}>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Escreva sua resposta aqui..."
                        className={`w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          weather.isDaytime
                            ? 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
                            : 'bg-gray-800/80 border-gray-600 text-white placeholder-gray-400'
                        }`}
                        rows={4}
                      />
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={answerQuestion}
                          disabled={answering || !answer.trim()}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            weather.isDaytime
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-700 text-white hover:bg-green-800'
                          }`}
                        >
                          {answering ? (
                            <>
                              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Enviando...
                            </>
                          ) : (
                            '✅ Enviar Resposta'
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowAnswerForm(false);
                            setAnswer('');
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            weather.isDaytime
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                Carregando pergunta do dia...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyQuestionSection;
