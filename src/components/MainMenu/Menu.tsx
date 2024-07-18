import { useEffect, useRef, useState } from 'react';
import Option from './Option';
import { MenuLink } from './links';

const Menu = () => {
  const menuRef = useRef<any>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

  const menuLinks: MenuLink[] = [
    {
      label: 'Base de conhecimento',
      href: 'knowledge',
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
      label: 'Exxperiencia',
      href: '',
    },
    {
      label: 'Formação',
      href: '',
    },
    {
      label: 'Label de enchimento',
      href: '',
    },
  ];

  const RenderLinks = () => {
    return menuLinks.map((link, index) => {
      return (
        <Option
          key={index}
          maxIndex={menuLinks.length}
          index={index}
          href={link.href}
          menuSize={menuSize}
        >
          {link.label}
        </Option>
      )
    });
  };

  useEffect(() => {
    const updateSize = () => {
      if (menuRef.current) {
        setMenuSize({
          width: menuRef.current.offsetWidth,
          height: menuRef.current.offsetHeight,
        });
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [menuRef]);

  return (
    <div
      className='relative flex flex-col justify-center items-center min-h-[100vh] min-w-[100vw] w-full h-full'
      style={{
        background: 'linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)',
      }}
    >
      <div
        className='absolute flex flex-col justify-center items-center min-h-[100vh] min-w-[100vw] w-full h-full'
        style={{
          opacity: 0,
          transition: 'opacity 1.5s easy',
        }}
      />
        <div
          ref={menuRef}
          className='relative flex flex-col min-w-[30vw] max-w-[30%] w-full aspect-square'
        >
          <div
            className="relative flex items-center justify-center h-[100%] w-[100%] rounded-full"
            style={{
              zIndex: 9998,
              overflow: 'hidden',
              background: 'black',
              transition: 'background 1.5s ease',
            }}
          >
            <span
              style={{
                zIndex: 9999,
                color: 'white',
                fontSize: (menuSize.width * 0.15).toString() + 'px',
                fontStyle: 'italic',
              }}
            >
              Portifólio
            </span>
            <div
              className="absolute w-full h-full inset-0 rounded-full bg-black shadow-inner-white-gradient"
            />
          </div>
          <RenderLinks />
        </div>
    </div>
  );
};

export default Menu;
