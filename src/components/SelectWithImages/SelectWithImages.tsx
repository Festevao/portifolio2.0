import React, { useState, useRef, useEffect } from 'react';

interface Props {
  options: {
    tag: string;
    imgUrl: string;
  }[];
  onChange?: (arg?: { tag: string; imgUrl: string }) => void;
}

const SelectWithImages: React.FC<Props> = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: { tag: string; imgUrl: string }) => {
    setSelectedOption(option);
    onChange && onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const RenderOptions = () => {
    return options.map(option => (
      <li
        key={option.tag}
        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleSelect(option)}
      >
        <div className="w-6 h-6 mr-4 flex justify-center items-center">
          <img src={option.imgUrl} alt={option.tag} className="w-full" />
        </div>
        <span className="text-xs sm:text-lg">{option.tag}</span>
      </li>
    ));
  }

  return (
    <div ref={selectRef} className="relative w-full max-w-[350px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <div className="w-6 h-6 mr-4 flex justify-center items-center">
          <img src={selectedOption.imgUrl} alt={selectedOption.tag} className="w-full" />
        </div>
        <span className="text-xs sm:text-lg font-semibold">{selectedOption.tag}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-400 mt-1 rounded shadow-lg max-h-[300px] overflow-y-auto">
          <RenderOptions />
        </ul>
      )}
    </div>
  );
};

export default SelectWithImages;
