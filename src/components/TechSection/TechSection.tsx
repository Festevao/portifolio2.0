import React, { useState } from 'react';
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

  const RenderData = () => {
    return data
      .filter(({ tags }) => tags.includes(selectedOption.tag))
      .map(({ imgUrl, name }) => {
        return (
          <div
            className='flex flex-col items-center justify-center border rounded-lg p-3 gap-2 shadow-lg'
            key={`${name}-tech-opt`}
          >
            <div className='flex items-center justify-center w-[200px]'>
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
      })
  }

  return (
    <section className='w-full'>
      <div className='w-full flex flex-col justify-center gap-10 items-center'>
        <SelectWithImages options={options} onChange={(opt) => {setSelectedOption(opt!)}}/>
          <div className='w-full flex flex-wrap justify-center items-center gap-4'>
            <RenderData />
          </div>
      </div>
    </section>
  );
}

export default TechSection;