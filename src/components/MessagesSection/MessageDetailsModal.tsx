import { Message } from '@/types/Message';
import { WeatherData } from '@/types/Weather';

interface MessageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message;
  weather: WeatherData;
  onDelete: (messageId: string) => void;
}

/**
 * Modal para visualizar detalhes completos de uma mensagem
 */
const MessageDetailsModal = ({ isOpen, onClose, message, weather, onDelete }: MessageDetailsModalProps) => {
  if (!isOpen) return null;

  /**
   * Converte Markdown básico para HTML
   */
  const markdownToHtml = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
      .replace(/`(.*?)`/g, '<code>$1</code>') // `code`
      .replace(/~~(.*?)~~/g, '<del>$1</del>') // ~~strikethrough~~
      .replace(/\n/g, '<br>') // quebras de linha
      .replace(/^### (.*$)/gm, '<h3>$1</h3>') // ### heading
      .replace(/^## (.*$)/gm, '<h2>$1</h2>') // ## heading
      .replace(/^# (.*$)/gm, '<h1>$1</h1>'); // # heading
  };

  /**
   * Manipula a deleção da mensagem
   */
  const handleDelete = () => {
    if (confirm('Tem certeza que deseja deletar esta mensagem?')) {
      onDelete(message._id);
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn`}>
      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
        weather.isDaytime ? 'bg-white/90 text-gray-800' : 'bg-purple-950/90 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          weather.isDaytime ? 'border-gray-200' : 'border-purple-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="text-2xl">💌</div>
            <div>
              <h3 className={`text-xl font-bold ${
                weather.isDaytime ? 'text-gray-900' : 'text-white'
              }`}>
                Mensagem
              </h3>
              <p className={`text-sm ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
              }`}>
                {new Date(message.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all hover:scale-110 ${
              weather.isDaytime
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-purple-800 text-purple-300'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            {/* Informações da mensagem */}
            <div className={`p-4 rounded-xl ${
              weather.isDaytime
                ? 'bg-gray-50 border border-gray-200'
                : 'bg-purple-900/30 border border-purple-700/30'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                  }`}>
                    De:
                  </label>
                  <p className={`text-lg font-semibold ${
                    weather.isDaytime ? 'text-gray-900' : 'text-white'
                  }`}>
                    {message.sender}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${
                    weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                  }`}>
                    Para:
                  </label>
                  <p className={`text-lg font-semibold ${
                    weather.isDaytime ? 'text-gray-900' : 'text-white'
                  }`}>
                    {message.recipient}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
                  }`}>
                    Status:
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.isRead
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.isRead ? '✅ Lida' : '📬 Não lida'}
                  </span>
                </div>
                
                {message.images && message.images.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
                    }`}>
                      Imagens:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      weather.isDaytime
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-blue-900/50 text-blue-200'
                    }`}>
                      📷 {message.images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo da mensagem */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
              }`}>
                Conteúdo:
              </label>
              <div className={`p-4 rounded-xl border min-h-[200px] ${
                weather.isDaytime
                  ? 'bg-white border-gray-300'
                  : 'bg-purple-900/50 border-purple-600'
              }`}>
                <div 
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(message.content) }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </div>

            {/* Imagens */}
            {message.images && message.images.length > 0 && (
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Imagens anexadas:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => window.open(image, '_blank')}
                          className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-white transition-all"
                        >
                          🔍 Ver em tamanho real
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${
          weather.isDaytime ? 'border-gray-200' : 'border-purple-700'
        }`}>
          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              weather.isDaytime
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-red-900/50 text-red-300 hover:bg-red-900/70'
            }`}
          >
            🗑️ Deletar
          </button>
          
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              weather.isDaytime
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsModal;
