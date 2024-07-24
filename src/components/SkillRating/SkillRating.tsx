import React from 'react';

interface SkillRatingProps {
  logoUrl: string;
  name: string;
  rate: number;
  showNumber?: boolean;
}

const SkillRating: React.FC<SkillRatingProps> = ({ logoUrl, rate, name, showNumber }) => {
  const totalRate = 5;
  const greenBars = Math.min(rate, totalRate); // Ensure rate doesn't exceed totalRate
  const grayBars = totalRate - greenBars;

  const greenArr = [...Array(greenBars)];

  const RenderGreenBars = () => {
    return greenArr.map((_, index) => (
      <div key={`skill-rate-${index + 1}`} className='flex flex-col w-full items-center justify-center text-[0.5rem] sm:text-[0.75rem] text-green-500'>
        <div className="w-full h-2 bg-green-500 rounded-full"></div>
        {showNumber && index + 1}
      </div>
    ));
  }
  
  const RenderGrayBars = () => {
    return [...Array(grayBars)].map((_, index) => (
      <div key={`skill-rate-${greenArr.length + index + 1}`} className='flex flex-col w-full items-center justify-center text-[0.5rem] sm:text-[0.75rem] text-gray-300'>
        <div className="w-full h-2 bg-gray-300 rounded-full"></div>
        {showNumber && greenArr.length + index + 1}
      </div>
    ));
  }

  return (
    <div className="flex items-center space-x-4 p-1 md:p-4 rounded-lg shadow-md bg-white m-2">
      <img src={logoUrl} alt="Language Logo" className="w-[20%] max-w-16 rounded-md aspect-square" />
      <div className='flex flex-col w-full h-full items-start justify-center gap-2 font-bold text-[0.5rem] sm:text-base'>
        {name}
        <div className="flex flex-row items-center w-full gap-[2%]">
          <RenderGreenBars />
          <RenderGrayBars />
        </div>
      </div>
    </div>
  );
};

export default SkillRating;
