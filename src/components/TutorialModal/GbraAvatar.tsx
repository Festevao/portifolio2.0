interface GbraAvatarProps {
  mode: 'booting' | 'waking' | 'excited' | 'formal' | 'presenting' | 'waving' | 'celebrating';
  animation?: string;
}

/**
 * Avatar animado do G'bra com diferentes roupas e poses
 * Cada modo representa uma etapa diferente do tutorial
 */
const GbraAvatar = ({ mode, animation }: GbraAvatarProps) => {
  /**
   * Retorna a configuração visual para cada modo
   */
  const getAvatarConfig = () => {
    switch (mode) {
      case 'booting':
        return {
          outfit: 'bg-gradient-to-br from-gray-700 to-gray-900', // Robô desligado
          accessory: '⚙️',
          pose: 'opacity-50',
          eyes: '😴',
          bgGlow: 'from-gray-400 to-gray-600'
        };
      
      case 'waking':
        return {
          outfit: 'bg-gradient-to-br from-blue-500 to-cyan-500', // Acordando
          accessory: '💤',
          pose: '',
          eyes: '😴',
          bgGlow: 'from-blue-400 to-cyan-400'
        };
      
      case 'excited':
        return {
          outfit: 'bg-gradient-to-br from-pink-500 to-rose-500', // Empolgado
          accessory: '💕',
          pose: 'scale-110',
          eyes: '😍',
          bgGlow: 'from-pink-400 to-rose-400'
        };
      
      case 'formal':
        return {
          outfit: 'bg-gradient-to-br from-purple-600 to-indigo-700', // Terno/formal
          accessory: '🎩',
          pose: '',
          eyes: '🤵',
          bgGlow: 'from-purple-400 to-indigo-500'
        };
      
      case 'presenting':
        return {
          outfit: 'bg-gradient-to-br from-amber-500 to-orange-600', // Apresentando
          accessory: '🎯',
          pose: 'rotate-6',
          eyes: '🎯',
          bgGlow: 'from-amber-400 to-orange-500'
        };
      
      case 'waving':
        return {
          outfit: 'bg-gradient-to-br from-green-500 to-emerald-600', // Acenando
          accessory: '👋',
          pose: '-rotate-12',
          eyes: '👋',
          bgGlow: 'from-green-400 to-emerald-500'
        };
      
      case 'celebrating':
        return {
          outfit: 'bg-gradient-to-br from-yellow-400 to-orange-500', // Celebrando
          accessory: '🎉',
          pose: 'scale-110',
          eyes: '🎉',
          bgGlow: 'from-yellow-400 to-orange-400'
        };
      
      default:
        return {
          outfit: 'bg-gradient-to-br from-purple-500 to-pink-500',
          accessory: '🤖',
          pose: '',
          eyes: '🤖',
          bgGlow: 'from-purple-400 to-pink-400'
        };
    }
  };

  const config = getAvatarConfig();

  return (
    <div className="relative flex justify-center items-center">
      {/* Glow de fundo */}
      <div className={`absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r ${config.bgGlow} blur-2xl opacity-40 animate-pulse`} />
      
      {/* Container do Avatar */}
      <div className={`relative ${animation ? `animate-${animation}` : ''}`}>
        {/* Corpo do Avatar */}
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full ${config.outfit} ${config.pose} transition-all duration-500 shadow-2xl border-2 sm:border-4 border-white/30 flex items-center justify-center overflow-hidden`}>
          {/* Brilho interno */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* Rosto/Olhos */}
          <div className="text-3xl sm:text-4xl md:text-6xl z-10 transition-all duration-300">
            {config.eyes}
          </div>
          
          {/* Detalhes decorativos (círculos como botões) */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 flex gap-1 sm:gap-2">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-white/40" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-white/40" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-white/40" />
          </div>
        </div>
        
        {/* Acessório flutuante */}
        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 text-2xl sm:text-3xl md:text-4xl animate-bounce">
          {config.accessory}
        </div>
        
        {/* Nome tag */}
        <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full shadow-lg">
          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            G'bra
          </span>
        </div>
      </div>
    </div>
  );
};

export default GbraAvatar;

