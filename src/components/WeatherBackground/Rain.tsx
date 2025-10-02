/**
 * Componente de animação de chuva
 * Exibe gotas de chuva caindo com cores adaptadas para dia e noite
 */
interface RainProps {
  isDaytime: boolean;
}

const Rain = ({ isDaytime }: RainProps) => {
  /**
   * Gera array de gotas de chuva com posições aleatórias
   */
  const raindrops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5
  }));

  // Define cores baseadas no período do dia
  const dropColor = isDaytime 
    ? 'bg-gradient-to-b from-blue-600 to-blue-400/50' // Dia: azul escuro
    : 'bg-gradient-to-b from-blue-200 to-transparent'; // Noite: azul claro
  
  const dropOpacity = isDaytime ? 'opacity-70' : 'opacity-60';
  const dropShadow = isDaytime ? 'shadow-sm shadow-blue-800/30' : '';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className={`absolute w-0.5 h-8 md:h-12 ${dropColor} ${dropOpacity} ${dropShadow}`}
          style={{
            left: `${drop.left}%`,
            animation: `fall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default Rain;
