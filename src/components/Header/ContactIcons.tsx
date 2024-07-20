import Link from 'next/link';

const ContactIcons = () => {
  return (
    <div className={`\
      \ absolute right-6 flex flex-row gap-2 h-full items-center
    `}>
      <Link 
        href={'https://linkedin.com/in/felipi-trindade-365a34143'}
        className='h-[50%] mb-[-8px]'
        target='_blank'
      >
        <img src="/img/linkedin.png" alt="Linkedin" className='h-full'/>
      </Link>
      <Link 
        href={'https://github.com/Festevao'}
        className='h-[50%] mb-[-8px]'
        target='_blank'
      >
        <img src="/img/github.png" alt="GitHub" className='h-full'/>
      </Link>
      <Link 
        href={'https://wa.me/5532984680116'}
        className='h-[50%] mb-[-8px]'
        target='_blank'
      >
        <img src="/img/whatsapp.png" alt="WhatsApp" className='h-full'/>
      </Link>
    </div>
  );
}

export default ContactIcons;