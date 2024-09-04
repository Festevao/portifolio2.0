import React from 'react';

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  titleColor: string;
  reverse?: boolean;
}

const PageBanner: React.FC<Props> = ({
  title,
  description,
  imageUrl,
  bgColor,
  textColor,
  titleColor,
  reverse,
}) => {
  return (
    <div
      className={`w-full flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} border-b-8 border-t-8`}
      style={{
        borderColor: bgColor,
      }}
    >
      <div
        className='w-full lg:w-[45%] h-full lg:min-h-[65vh] flex justify-center items-center sm:p-8'
        style={{
          backgroundColor: bgColor,
        }}
      >
        <div className='flex flex-col justify-center items-start max-w-[80%] gap-5 lg:pl-[20%]'>
          <h1
            className={`text-xl lg:text-2xl font-bold underline text-center w-full ${reverse ? 'lg:text-end' : 'lg:text-start'}`}
            style={{
              color: titleColor,
            }}
          >
            {title}
          </h1>
          <span
            className={`text-xs text-center ${reverse ? 'lg:text-end' : 'lg:text-start'} md:text-sm font-semibold`}
            style={{
              color: textColor,
            }}
          >
            {description}
          </span>
        </div>
      </div>
      <div
        className='w-full lg:w-[55%] h-full lg:min-h-[65vh] bg-contain bg-center'
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <div
          className='w-full h-full min-h-[25vh] lg:min-h-[65vh] gradient-ground lg:hidden'
          style={{
            background: `linear-gradient(to bottom, ${bgColor} 10%, ${bgColor}00 100%)`,
          }}
        />
        <div
          className='w-full h-full min-h-[25vh] lg:min-h-[65vh] gradient-ground hidden lg:flex'
          style={{
            background: `linear-gradient(to ${reverse ? 'left' : 'right' }, ${bgColor} 10%, ${bgColor}00 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default PageBanner;
