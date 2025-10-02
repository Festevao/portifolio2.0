import { useState, useEffect } from 'react';
import { Message, CreateMessageData } from '@/types/Message';
import { WeatherData } from '@/types/Weather';
import AddMessageModal from './AddMessageModal';
import MessageDetailsModal from './MessageDetailsModal';

interface MessagesSectionProps {
  weather: WeatherData;
  participants: string[];
}

/**
 * Seção de mensagens entre usuários - "Queria te dizer"
 * Permite enviar mensagens com Markdown e imagens
 */
const MessagesSection = ({ weather, participants }: MessagesSectionProps) => {
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');

  /**
   * Carrega mensagens enviadas
   */
  const loadSentMessages = async () => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/messages/list?participants=${participantsParam}&type=sent&limit=5`);
      const data = await response.json();
      
      if (data.success && data.messages) {
        setSentMessages(data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens enviadas:', error);
    }
  };

  /**
   * Carrega mensagens recebidas
   */
  const loadReceivedMessages = async () => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/messages/list?participants=${participantsParam}&type=received&limit=5`);
      const data = await response.json();
      
      if (data.success && data.messages) {
        setReceivedMessages(data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens recebidas:', error);
    }
  };

  /**
   * Carrega todas as mensagens
   */
  const loadMessages = async () => {
    setLoading(true);
    await Promise.all([loadSentMessages(), loadReceivedMessages()]);
    setLoading(false);
  };

  /**
   * Salva uma nova mensagem
   */
  const saveMessage = async (messageData: CreateMessageData) => {
    try {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageData,
          participants,
          sender: participants[0], // Usuário atual
          recipient: participants[1] // Outro usuário
        })
      });

      const data = await response.json();

      if (data.success && data.message) {
        // Recarrega as mensagens
        await loadMessages();
        setShowAddModal(false);
      } else {
        throw new Error(data.message || 'Erro ao criar mensagem');
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      alert('Erro ao salvar mensagem: ' + (error as Error).message);
    }
  };

  /**
   * Deleta uma mensagem
   */
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta mensagem?')) return;
    
    try {
      const response = await fetch(`/api/messages/delete?id=${messageId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarrega as mensagens
        await loadMessages();
      } else {
        throw new Error(data.message || 'Erro ao deletar mensagem');
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      alert('Erro ao deletar mensagem: ' + (error as Error).message);
    }
  };

  /**
   * Marca uma mensagem como lida
   */
  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/mark-read?id=${messageId}`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Atualiza o estado local
        setReceivedMessages(prev => 
          prev.map(msg => 
            msg._id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  };

  /**
   * Abre detalhes da mensagem
   */
  const openMessageDetails = (message: Message) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
    
    // Marca como lida se for uma mensagem recebida não lida
    if (!message.isRead && message.recipient === participants[0]) {
      markAsRead(message._id);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const currentMessages = activeTab === 'sent' ? sentMessages : receivedMessages;
  const unreadCount = receivedMessages.filter(msg => !msg.isRead).length;

  return (
    <>
      {/* Card principal */}
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 transition-all duration-300 ${
        weather.isDaytime 
          ? 'bg-white/30 border border-white/20' 
          : 'bg-purple-950/30 border border-purple-800/20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">💌</div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                Queria te dizer
              </h2>
              <p className={`text-sm sm:text-base ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                {unreadCount > 0 && (
                  <span className="text-red-500 font-semibold">
                    {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                  </span>
                )}
                {unreadCount === 0 && 'Todas as mensagens lidas'}
              </p>
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
            {/* Tabs */}
            <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'received'
                    ? weather.isDaytime
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-purple-600 text-white shadow-sm'
                    : weather.isDaytime
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-purple-200 hover:text-white'
                }`}
              >
                📥 Mensagens pra mim ({receivedMessages.length})
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'sent'
                    ? weather.isDaytime
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-purple-600 text-white shadow-sm'
                    : weather.isDaytime
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-purple-200 hover:text-white'
                }`}
              >
                📤 Mensagens postadas ({sentMessages.length})
              </button>
            </div>

            {/* Lista de mensagens */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Carregando mensagens...
                </p>
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💭</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  {activeTab === 'received' ? 'Nenhuma mensagem recebida' : 'Nenhuma mensagem enviada'}
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  {activeTab === 'received' 
                    ? 'Aguardando mensagens...' 
                    : 'Envie sua primeira mensagem!'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      !message.isRead && activeTab === 'received'
                        ? weather.isDaytime
                          ? 'bg-blue-50 border-blue-200 shadow-md'
                          : 'bg-blue-900/30 border-blue-700/50 shadow-md'
                        : weather.isDaytime
                          ? 'bg-white/20 border-white/30 hover:bg-white/30'
                          : 'bg-purple-900/20 border-purple-700/30 hover:bg-purple-800/30'
                    }`}
                    onClick={() => openMessageDetails(message)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-bold text-lg ${
                            weather.isDaytime ? 'text-gray-800' : 'text-white'
                          }`}>
                            {activeTab === 'sent' ? '📤 Para' : '📥 De'} {activeTab === 'sent' ? participants[1] : participants[0]}
                          </h3>
                          {!message.isRead && activeTab === 'received' && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Nova
                            </span>
                          )}
                        </div>
                        
                        <div className={`text-sm ${
                          weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
                        }`}>
                          {message.content.length > 100 
                            ? `${message.content.substring(0, 100)}...` 
                            : message.content
                          }
                        </div>
                        
                        {message.images && message.images.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs">📷</span>
                            <span className={`text-xs ${
                              weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                            }`}>
                              {message.images.length} imagem{message.images.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        
                        <p className={`text-xs mt-2 ${
                          weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                        }`}>
                          {new Date(message.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message._id);
                        }}
                        className={`ml-4 p-2 rounded-full transition-all hover:scale-110 ${
                          weather.isDaytime
                            ? 'bg-red-100 hover:bg-red-200 text-red-600'
                            : 'bg-red-900/50 hover:bg-red-900/70 text-red-300'
                        }`}
                        title="Deletar mensagem"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão para adicionar */}
            <div className="pt-4 border-t border-white/20">
              <button
                onClick={() => setShowAddModal(true)}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  weather.isDaytime
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                ✍️ Escrever mensagem
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar mensagem */}
      {showAddModal && (
        <AddMessageModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={saveMessage}
          weather={weather}
          participants={participants}
        />
      )}

      {/* Modal para ver detalhes da mensagem */}
      {showDetailsModal && selectedMessage && (
        <MessageDetailsModal
          isOpen={showDetailsModal}
          onClose={() => { setShowDetailsModal(false); setSelectedMessage(null); }}
          message={selectedMessage}
          weather={weather}
          onDelete={deleteMessage}
        />
      )}
    </>
  );
};

export default MessagesSection;
