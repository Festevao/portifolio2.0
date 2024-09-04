import React from 'react';
import LinkSVG from '../Icons/LinkSVG';

interface Props {
  imgUrl: string;
  title: string;
  subTitle: string;
  description: string;
  subTitleHref?: string;
}

const EducationCard: React.FC<Props> = ({
  imgUrl,
  title,
  description,
  subTitle,
  subTitleHref,
}) => {
  const openNewTabLink = (link: string | undefined) => {
    if (link) window.open(subTitleHref, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className='w-full flex flex-col md:flex-row justify-start items-center md:items-center gap-6 border border-black p-4 rounded-md'>
      <div className='max-w-[150px] table'>
        <img
          className='w-full'
          src={imgUrl}
          alt='education_image'
        />
      </div>
      <div className='flex flex-col justify-start items-start p-4 max-w-[80%]'>
        <h1 className='text-xl lg:text-xl font-bold underline text-start'>{title}</h1>
        <div
          className='flex flex-row items-start justify-start gap-2'
          onClick={() => openNewTabLink(subTitleHref)}
          style={{
            cursor: subTitleHref ? 'pointer' : 'unset',
          }}
        >
          <h1 className='text-lg lg:text-md font-semibold mb-6 text-start flex flex-col sm:flex-row sm:gap-2 items-start'>
            {subTitle}{subTitleHref && <LinkSVG />}
          </h1>
        </div>
        <span className='text-start w-full text-xs lg:text-sm space-y-5'>{description}</span>
      </div>
    </div>
  );
}

export default EducationCard;