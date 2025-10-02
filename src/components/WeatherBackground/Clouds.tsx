/**
 * Componente de animação de nuvens
 * Exibe nuvens animadas que se movem horizontalmente
 */
interface CloudsProps {
  isDaytime: boolean;
}

const Clouds = ({ isDaytime }: CloudsProps) => {
  const cloudColor = isDaytime ? 'bg-white' : 'bg-indigo-950';
  const cloudOpacity = isDaytime ? 'opacity-80' : 'opacity-60';
  const cloudShadow = isDaytime ? '' : 'shadow-lg shadow-black/30';
  const cloudBorder = isDaytime ? '' : 'ring-1 ring-purple-800/50';

  return (
    <>
      {/* Nuvem 1 - Começa visível à esquerda */}
      <div className="absolute top-20 left-10 animate-cloud-slow">
        <div className={`relative w-32 h-12 md:w-48 md:h-16 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-4 left-6 w-16 h-16 md:w-20 md:h-20 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-16 w-20 h-12 md:w-28 md:h-16 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>

      {/* Nuvem 2 - Começa no centro */}
      <div className="absolute top-40 left-1/3 animate-cloud-medium">
        <div className={`relative w-28 h-10 md:w-40 md:h-14 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-3 left-4 w-14 h-14 md:w-16 md:h-16 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-12 w-16 h-10 md:w-24 md:h-14 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>

      {/* Nuvem 3 - Começa à direita */}
      <div className="absolute top-32 right-20 animate-cloud-fast">
        <div className={`relative w-36 h-14 md:w-52 md:h-18 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-4 left-8 w-18 h-18 md:w-24 md:h-24 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-18 w-22 h-14 md:w-32 md:h-18 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>

      {/* Nuvem 4 - Apenas em telas maiores, no centro-esquerda */}
      <div className="hidden md:block absolute top-60 left-1/4 animate-cloud-slow">
        <div className={`relative w-44 h-16 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-4 left-10 w-20 h-20 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-20 w-28 h-16 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>

      {/* Nuvem 5 - Estática no topo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <div className={`relative w-40 h-14 md:w-56 md:h-20 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-4 left-8 w-18 h-18 md:w-24 md:h-24 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-20 w-24 h-14 md:w-32 md:h-20 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>

      {/* Nuvem 6 - Estática embaixo */}
      <div className="hidden lg:block absolute bottom-32 right-1/3">
        <div className={`relative w-36 h-12 ${cloudColor} ${cloudOpacity} ${cloudShadow} ${cloudBorder} rounded-full`}>
          <div className={`absolute -top-3 left-6 w-16 h-16 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
          <div className={`absolute -top-2 left-16 w-20 h-12 ${cloudColor} ${cloudShadow} ${cloudBorder} rounded-full`} />
        </div>
      </div>
    </>
  );
};

export default Clouds;
