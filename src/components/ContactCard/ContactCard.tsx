import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

interface Props {
  imgUrl: string;
  contactString: string;
  title: string;
  href?: string;
}

const ContactCard: React.FC<Props> = ({
  imgUrl,
  contactString,
  title,
  href,
}) => {
  return (
    <Link
      className='contact-card flex min-w-[260px]'
      href={href ? href : "#"}
      target='_blank'
    >
      <div className='w-full rounded-lg shadow-lg flex flex-row justify-center items-center box-content gap-4 p-4'>
        <img
          className='w-10'
          src={imgUrl}
          alt="contact"
          />
        <div className='flex flex-col w-full h-full'>
          <h1 className='font-bold'>{title}</h1>
          <span
            className='text-sm'
            style={{ textDecoration: href ? 'underline' : 'unset' }}
            >{contactString}</span>
        </div>
      </div>
    </Link>
  );
};

export default ContactCard;
