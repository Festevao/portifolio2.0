/**
 * Componente de animação do sol
 * Exibe um sol animado com raios rotacionando
 */
const Sun = () => {
  return (
    <div className="absolute top-10 right-10 md:top-20 md:right-20 animate-float">
      <div className="relative w-20 h-20 md:w-32 md:h-32">
        {/* Raios do sol */}
        <div className="absolute inset-0 animate-spin-slow">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-6 md:h-10 bg-yellow-300 rounded-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-140%)`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
        {/* Núcleo do sol */}
        <div className="absolute inset-0 m-auto w-16 h-16 md:w-24 md:h-24 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300/50 animate-pulse-slow" />
      </div>
    </div>
  );
};

export default Sun;

