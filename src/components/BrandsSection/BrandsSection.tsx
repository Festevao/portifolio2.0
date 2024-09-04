import React, { useState } from 'react';

interface Props {
  brands: {
    name: string;
    title?: string;
    description?: string;
  }[];
}

const BrandsSection: React.FC<Props> = ({ brands }) => {
  const [click, setClick] = useState<number | undefined>();

  const handleClick = (index: number) => {
    setClick(index);
  }

  const RenderBreakDescription: React.FC<{ description?: string }> = ({ description }) => {
    return description?.split(' | ').map((desc, idx) => (
      <React.Fragment key={`brands-tooltip-${idx}`}>
        {desc}
        <br />
      </React.Fragment>
    ));
  }

  const RenderBrands = () => {
    return brands.map(({ name, title, description }, index) => (
      <div
        key={`brand-card-${index}`}
        className='group relative w-[100px] py-2 px-4 flex items-center justify-center bg-gray-300 rounded-md brand-card shadow-lg border-gray-400 border'
        title={title ?? name}
        onClick={() => handleClick(index)}
        onMouseOut={() => setClick(undefined)}
      >
        <input type='button' className='text-center whitespace-nowrap' value={name}/>
        <div
          className='absolute bottom-full mb-2 hidden lg:block w-max p-2 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-300'
          style={{
            opacity: click != undefined
              ? click === index
                ? '1'
                : '0'
              : undefined,
          }}
        >
          {description}
        </div>
        <div
          className='absolute bottom-full w-[150%] lg:hidden mb-2 p-2 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-300'
          style={{
            opacity: click != undefined
              ? click === index
                ? '1'
                : '0'
              : undefined,
          }}
        >
          <RenderBreakDescription description={description}/>
        </div>
      </div>
    ));
  };

  return (
    <div className='w-full flex-wrap flex flex-row items-center justify-center gap-4'>
      <RenderBrands />
    </div>
  );
}

export default BrandsSection;
