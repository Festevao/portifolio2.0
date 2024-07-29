import React, { useState, useRef, useEffect } from 'react';
import SelectWithImages from '../SelectWithImages/SelectWithImages';

interface Props {
  options: {
    tag: string;
    imgUrl: string;
  }[];
  data: {
    tags: string[];
    name: string;
    description: string;
    imgUrl: string;
  }[];
}

const TechSection: React.FC<Props> = ({ options, data }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(10);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltip(null);
      }
    };

    const handleScroll = () => {
      if (tooltip) {
        setTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tooltip]);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 10);
  };

  const RenderData = () => {
    const filteredData = data.filter(({ tags }) => tags.includes(selectedOption.tag));

    const itemsToDisplay = selectedOption.tag === 'Todos' 
      ? filteredData.slice(0, visibleItems)
      : filteredData;

    return (
      <>
        {itemsToDisplay.map(({ imgUrl, name, description }) => {
          const handleClick = (event: React.MouseEvent) => {
            const { clientX, clientY } = event;
            const tooltipWidth = 150;
            const tooltipHeight = 60;

            let x = clientX + 10;
            let y = clientY + 10;

            if (x + tooltipWidth > window.innerWidth) {
              x = clientX - tooltipWidth - 10;
            }

            if (y + tooltipHeight > window.innerHeight) {
              y = clientY - tooltipHeight - 10;
            }

            setTooltip({ text: description, x, y });
          };

          return (
            <div
              key={name}
              className={`\ 
                \ flex flex-col items-center justify-center border-2 rounded-lg p-3 gap-2 shadow-lg cursor-pointer w-[110px]
                \ sm:w-[250px] hover:border-gray-400 text-xs sm:text-base
              `}
              onClick={handleClick}
            >
              <div className='flex items-center justify-center w-full'>
                <img
                  className='h-14 min-w-[50px]'
                  src={imgUrl}
                  alt={name}
                />
              </div>
              <hr className='w-full'/>
              {name}
            </div>
          );
        })}
        {selectedOption.tag === 'Todos' && visibleItems < filteredData.length && (
          <div
            className={`\ 
              \ flex flex-col items-center justify-center border-2 rounded-lg p-3 gap-2 shadow-lg cursor-pointer w-[110px]
              \ sm:w-[250px] hover:border-gray-400 text-xs sm:text-base
            `}
            onClick={handleLoadMore}
          >
            <div className='flex items-center justify-center w-full'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className='h-[59px]'
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            </div>
            <hr className='w-full'/>
            Ver Mais
          </div>
        )}
      </>
    );
  };

  return (
    <section className='w-full'>
      <div className='w-full flex flex-col justify-center gap-10 items-center'>
        <SelectWithImages options={options} onChange={(opt) => {
          setSelectedOption(opt!);
          if (opt?.tag !== 'Todos') setVisibleItems(10);
        }} />
        <div className='w-full flex flex-wrap justify-center items-center gap-4'>
          <RenderData />
        </div>
        {tooltip && (
          <div
            ref={tooltipRef}
            className='fixed bg-gray-800 shadow-2xl text-white text-xs sm:text-sm rounded p-2 transition-opacity duration-300 max-w-[250px] mr-10'
            style={{ top: tooltip.y, left: tooltip.x }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </section>
  );
};

export default TechSection;
