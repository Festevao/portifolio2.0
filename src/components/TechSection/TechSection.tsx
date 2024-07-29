import React from 'react';
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
  return (
    <section className='w-full'>
      <div className='w-full flex flex-col flex-wrap justify-center items-center'>
        <SelectWithImages options={options}/>
      </div>
    </section>
  );
}

export default TechSection;