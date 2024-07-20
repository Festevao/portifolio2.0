import { useState } from 'react';
import { MenuLink } from '@/types/MenuLink';
import ContactIcons from './ContactIcons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuLinks: MenuLink[] = [
    {
      label: 'Base de conhecimento',
      href: '/knowledge',
    },
    {
      label: 'Blog pessoal',
      href: '/blog',
    },
    {
      label: 'Sobre mim',
      href: '/about',
    },
    {
      label: 'Experiência',
      href: '/professional-experience',
    },
    {
      label: 'Formação',
      href: '/education',
    },
    {
      label: 'Contato',
      href: '/contact',
    },
  ];

  const RenderLinks = () => {
    return menuLinks.map(({ label, href }, index) => {
      if (router.pathname.startsWith(href)) return;
      const isLast = index === menuLinks.length - 2;
      const isLastLink = router.pathname.startsWith(menuLinks[menuLinks.length - 1].href);
      return (
        <>
          <Link href={href} key={label} className='lg:underline lg:mb-[-18px] font-bold'>
            {label}
          </Link>
          {
            index < menuLinks.length - 1 && !(isLast && isLastLink) && (
              <div
                className='w-full h-[1px] bg-white lg:hidden'
              />
            )
          }
        </>
      )
    });
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='header relative flex flex-row w-full bg-black min-h-[70px] min-w-[250px] h-[9vh] text-white'>
      <div className='relative hidden lg:flex flex-row lg:gap-[2%] items-center justify-center w-full'>
        <RenderLinks />
      </div>
      <div className='lg:hidden flex items-center ml-4'>
        <button onClick={toggleMenu} className='p-1 focus:outline-none'>
          <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7'></path>
          </svg>
        </button>
      </div>
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu}></div>
      <div className={`fixed top-0 left-0 h-full pt-[60px] bg-black w-64 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50`} onClick={closeMenu}>
        <div className='flex flex-col p-4 gap-3'>
          <RenderLinks />
        </div>
      </div>
      <ContactIcons />
    </header>
  );
}

export default Header;
