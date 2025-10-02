import { useState } from 'react';
import { CreateMessageData } from '@/types/Message';
import { WeatherData } from '@/types/Weather';

interface AddMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (messageData: CreateMessageData) => void;
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
 * Modal para adicionar nova mensagem com suporte a Markdown
 */
const AddMessageModal = ({ isOpen, onClose, onSave, weather, participants, meUser, otherUser }: AddMessageModalProps) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Por favor, escreva uma mensagem');
      return;
    }

    setSaving(true);
    
    try {
      await onSave({
        content: content.trim(),
        sender: participants[0],
        recipient: participants[1],
        participants,
        images
      });
      
      // Limpa o formulário
      setContent('');
      setImages([]);
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Manipula o upload de imagens para o Cloudinary
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    
    // Adiciona todas as imagens ao FormData
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        formData.append('images', file);
      }
    }

    if (formData.getAll('images').length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    setUploading(true);
    
    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.urls) {
        setImages([...images, ...data.urls]);
      } else {
        throw new Error(data.message || 'Erro ao fazer upload das imagens');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload das imagens: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove uma imagem
   */
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
          <h3 className={`text-xl font-bold ${
            weather.isDaytime ? 'text-gray-900' : 'text-white'
          }`}>
            ✍️ Escrever mensagem
          </h3>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Destinatário */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
              }`}>
                💌 Enviando mensagem para:
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20">
                {otherUser.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.nome}
                    className="w-10 h-10 rounded-full object-cover border-2 shadow-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    {otherUser.nome.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className={`font-bold text-lg ${
                    weather.isDaytime ? 'text-gray-800' : 'text-white'
                  }`}>
                    {otherUser.nome}
                  </p>
                  <p className={`text-sm ${
                    weather.isDaytime ? 'text-gray-600' : 'text-purple-300'
                  }`}>
                    @{otherUser.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs de edição/preview */}
            <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !showPreview
                    ? weather.isDaytime
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-purple-600 text-white shadow-sm'
                    : weather.isDaytime
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-purple-200 hover:text-white'
                }`}
              >
                ✏️ Escrever
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  showPreview
                    ? weather.isDaytime
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-purple-600 text-white shadow-sm'
                    : weather.isDaytime
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-purple-200 hover:text-white'
                }`}
              >
                👁️ Visualizar
              </button>
            </div>

            {/* Editor de texto */}
            {!showPreview ? (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Mensagem (suporte a Markdown)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva sua mensagem aqui... Você pode usar Markdown para formatação:

**Texto em negrito**
*Texto em itálico*
`código`
~~texto riscado~~

# Título grande
## Título médio
### Título pequeno

Quebra de linha automática!"
                  className={`w-full h-64 p-4 rounded-xl border resize-none transition-all focus:outline-none focus:ring-2 ${
                    weather.isDaytime
                      ? 'bg-white border-gray-300 focus:ring-purple-500 text-gray-800'
                      : 'bg-purple-900/50 border-purple-600 focus:ring-purple-400 text-white'
                  }`}
                  required
                />
                
                {/* Dicas de Markdown */}
                <div className={`mt-2 text-xs ${
                  weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                }`}>
                  💡 Dicas: Use **negrito**, *itálico*, `código`, # títulos, ~~riscado~~
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                }`}>
                  Visualização
                </label>
                <div className={`w-full h-64 p-4 rounded-xl border overflow-y-auto ${
                  weather.isDaytime
                    ? 'bg-white border-gray-300 text-gray-800'
                    : 'bg-purple-900/50 border-purple-600 text-white'
                }`}>
                  {content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                      className="prose prose-sm max-w-none"
                    />
                  ) : (
                    <p className={`italic ${
                      weather.isDaytime ? 'text-gray-500' : 'text-purple-400'
                    }`}>
                      Nenhum conteúdo para visualizar
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Upload de imagens */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
              }`}>
                Imagens (opcional)
                {uploading && (
                  <span className="ml-2 text-blue-500 text-xs">
                    📤 Enviando...
                  </span>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className={`w-full p-3 rounded-xl border transition-all ${
                  uploading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  weather.isDaytime
                    ? 'bg-white border-gray-300 text-gray-800'
                    : 'bg-purple-900/50 border-purple-600 text-white'
                }`}
              />
              
              {/* Lista de imagens */}
              {images.length > 0 && (
                <div className="mt-3 space-y-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                      <img src={image} alt={`Imagem ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                      <span className="flex-1 text-sm truncate">Imagem {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 rounded-full hover:bg-red-500 text-red-600 hover:text-white transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          weather.isDaytime ? 'border-gray-200' : 'border-purple-700'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              weather.isDaytime
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving || !content.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              weather.isDaytime
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {saving ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMessageModal;
