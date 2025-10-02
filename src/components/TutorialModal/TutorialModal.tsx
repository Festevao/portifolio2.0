import { useState, useEffect } from 'react';
import { User } from '@/types/User';
import GbraAvatar from './GbraAvatar';

interface TutorialModalProps {
  meUser: User;
  onComplete: () => void;
}

interface StepContent {
  avatarMode: 'booting' | 'waking' | 'excited' | 'formal' | 'presenting' | 'waving' | 'celebrating';
  animation?: string;
  title: string;
  message: string;
  subtitle: string;
  buttonText?: string;
  autoAdvance?: boolean;
  showUserPhoto?: boolean;
}

/**
 * Modal de tutorial com a IA G'bra
 * Sistema de 7 etapas que apresenta a página para o usuário
 */
const TutorialModal = ({ meUser, onComplete }: TutorialModalProps) => {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Avança para a próxima etapa
   */
  const nextStep = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  /**
   * Fecha o modal e marca como concluído
   */
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      localStorage.setItem('tutorialCompleted', 'true');
      onComplete();
    }, 300);
  };

  /**
   * Retorna o conteúdo da etapa atual
   */
  const getStepContent = (): StepContent => {
    switch (step) {
      case 1:
        return {
          avatarMode: 'booting',
          animation: 'pulse',
          title: 'Iniciando Sistema',
          message: 'IA de Relações Interpessoais iniciando...',
          subtitle: 'Aguarde enquanto carrego os módulos principais',
          autoAdvance: true
        };

      case 2:
        return {
          avatarMode: 'waking',
          animation: 'bounce',
          title: 'Sistema Ativo',
          message: 'Opa! Acordei! 😴',
          subtitle: 'Pera um minuto que já vou te analisar...',
          buttonText: 'Continuar'
        };

      case 3:
        return {
          avatarMode: 'excited',
          animation: 'shake',
          title: 'Análise de Perfil',
          message: `Nuuuuu, pera aí! ${meUser.avatar ? '📸' : ''}`,
          subtitle: `Se eu soubesse que era ${meUser.nome.split(' ')[0]}, uma pessoa tão especial, eu te esperava acordado! ✨`,
          showUserPhoto: true,
          buttonText: 'Obrigado! 😊'
        };

      case 4:
        return {
          avatarMode: 'formal',
          animation: 'fade',
          title: 'Apresentação Formal',
          message: 'Bem, vou me apresentar adequadamente...',
          subtitle: `Vou ter que pedir pro meu desenvolvedor me avisar quando tiver visita tão importante assim! Mas enfim, meu nome é G'bra, sou uma IA treinada pra te atender por aqui. Meu dev me deixou responsável por analisar sua estadia e ajudar você a se aproximar um pouco dele. Deixa eu te dar um resumo do que fazemos aqui...`,
          buttonText: 'Entendi! 👍'
        };

      case 5:
        return {
          avatarMode: 'presenting',
          animation: 'bounce',
          title: 'Propósito do Espaço',
          message: 'Este é um lugar focado em VOCÊS!',
          subtitle: `Estamos querendo unir seus gostos e compartilhar informações um do outro. (Não confia muito no meu dev não, se ele pedir cartão frente e verso, NÃO PASSA! 😅)\n\nAqui você pode:\n• Compartilhar músicas 🎵\n• Descobrir gostos em comum 💕\n• Ver lugares que querem visitar juntos 🗺️\n• E ver as coisas que o lindão (meu dev) posta 📝`,
          buttonText: 'Legal! 🚀'
        };

      case 6:
        return {
          avatarMode: 'waving',
          animation: 'wave',
          title: 'Explorando Livremente',
          message: 'Bem, agora que te apresentei o lugar...',
          subtitle: `Vou te deixar livre pra explorar! Não se preocupe, vou estar agindo por debaixo dos panos pra sugerir coisas e estreitar esses laços. 💜\n\nE lembra: se tiver ideias pra melhorar esse espaço, é só comentar com meu dev!`,
          buttonText: 'Vamos lá! ✨'
        };

      case 7:
        return {
          avatarMode: 'celebrating',
          animation: 'bounce',
          title: 'Preparado?',
          message: 'Tudo pronto!',
          subtitle: 'Aproveite seu tempo aqui e explore tudo que preparamos com carinho! 💖',
          buttonText: 'Começar! 🚀'
        };

      default:
        return {
          avatarMode: 'booting',
          animation: 'pulse',
          title: '',
          message: '',
          subtitle: '',
          buttonText: 'Continuar'
        };
    }
  };

  /**
   * Auto-avança na etapa 1 após 2 segundos
   */
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        nextStep();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const content = getStepContent();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-lg w-full p-4 sm:p-6 md:p-8 transform transition-all animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Avatar G'bra */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <GbraAvatar mode={content.avatarMode} animation={content.animation} />
        </div>

        {/* Foto do usuário (etapa 3) */}
        {content.showUserPhoto && meUser.avatar && (
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <img 
                src={meUser.avatar} 
                alt={meUser.nome}
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
          </div>
        )}

        {/* Título */}
        {content.title && (
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center mb-2 sm:mb-3">
            {content.title}
          </h2>
        )}

        {/* Mensagem */}
        <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 font-semibold mb-2 sm:mb-3">
          {content.message}
        </p>

        {/* Subtítulo */}
        <p className="text-sm sm:text-base md:text-lg text-center text-gray-600 mb-4 sm:mb-6 md:mb-8 whitespace-pre-line leading-relaxed">
          {content.subtitle}
        </p>

        {/* Indicador de progresso */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-6 sm:w-8 bg-purple-600'
                  : s < step
                  ? 'w-1.5 sm:w-2 bg-purple-400'
                  : 'w-1.5 sm:w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Botão */}
        {!content.autoAdvance && (
          <button
            onClick={nextStep}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            {content.buttonText || 'Continuar'}
          </button>
        )}

        {/* Loading na etapa 1 */}
        {content.autoAdvance && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialModal;

