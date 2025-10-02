/**
 * Componente de animação da lua
 * Exibe uma lua crescente animada com brilho suave
 */
const Moon = () => {
  return (
    <div className="absolute top-10 right-10 md:top-20 md:right-20 animate-float">
      <div className="relative w-20 h-20 md:w-32 md:h-32">
        {/* Brilho da lua */}
        <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse-slow" />
        {/* Lua */}
        <div className="absolute inset-0 m-auto w-16 h-16 md:w-24 md:h-24 bg-purple-100 rounded-full shadow-lg shadow-purple-300/50">
          {/* Crateras */}
          <div className="absolute top-3 left-4 w-3 h-3 bg-purple-200 rounded-full opacity-40" />
          <div className="absolute top-8 left-8 w-2 h-2 bg-purple-200 rounded-full opacity-40" />
          <div className="absolute top-10 left-3 w-2 h-2 bg-purple-200 rounded-full opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default Moon;

