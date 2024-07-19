import { useEffect, useRef, useState } from 'react';
import Option from './Option';
import { MenuLink } from './links';

const Menu = () => {
  const menuRef = useRef<any>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);
  const [timeoutOp, setTimeoutOp] = useState<NodeJS.Timeout>();
  const [bgOpacity, setBgOpacity] = useState(0);

  const menuLinks: MenuLink[] = [
    {
      label: 'Base de conhecimento',
      href: '/knowledge',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+1');
      },
    },
    {
      label: 'Blog pessoal',
      href: '/blog',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+2');
      },
    },
    {
      label: 'Sobre mim',
      href: '/about',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+3');
      },
    },
    {
      label: 'Experiência',
      href: '/professional-experience',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+4');
      },
    },
    {
      label: 'Formação',
      href: 'education',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+5');
      },
    },
    {
      label: 'Contato',
      href: 'contact',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.8)
        setBgImage('https://placehold.co/415x200?text=Hello+6');
      },
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
          onHover={link.onHover}
          onDisHover={() => {
            clearTimeout(timeoutOp);
            setBgOpacity(0);
            setTimeoutOp(setTimeout(() => {
              setBgImage(undefined);
            }, 1000));
          }}
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
        backgroundColor: '#000000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='409' height='49.1' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='6.7' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <img
        alt="Slider"
        src={bgImage}
        className="absolute flex flex-col justify-center items-center w-full h-full"
        width={'100%'}
        height={'100%'}
        style={{
          opacity: bgOpacity,
          transition: bgImage ? 'opacity 1s ease-in' : 'unset',
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
