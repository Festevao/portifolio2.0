import { useEffect, useRef, useState } from 'react';
import Option from './Option';
import { MenuLink } from './links';

const Menu = () => {
  const menuRef = useRef<any>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const [ballColor, setBallColor] = useState('black');
  const [bgContent, setBgContent] = useState<string | undefined>(undefined);
  let timeOut: any;

  const menuLinks: MenuLink[] = [
    {
      label: 'Base de conhecimento',
      href: 'knowledge',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('white');
        setBgContent('linear-gradient(178.6deg, rgb(57, 104, 145) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
    },
    {
      label: 'Blog pessoal',
      href: '/blog',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('yellow');
        setBgContent('linear-gradient(178.6deg, rgb(67, 169, 121) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
    },
    {
      label: 'Sobre mim',
      href: '/about',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('blue');
        setBgContent('linear-gradient(178.6deg, rgb(180, 143, 71) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
    },
    {
      label: 'Exxperiencia',
      href: '',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('orange');
        setBgContent('linear-gradient(178.6deg, rgb(67, 140, 126) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
    },
    {
      label: 'Formação',
      href: '',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('purple');
        setBgContent('linear-gradient(178.6deg, rgb(180, 143, 71) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
    },
    {
      label: 'Label de enchimento',
      href: '',
      onHover: () => {
        if(timeOut) clearTimeout(timeOut);
        setBallColor('white');
        setBgContent('linear-gradient(178.6deg, rgb(205, 142, 186) 11.8%, rgb(124, 143, 161) 83.8%)');
      }
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
            if (timeOut) clearTimeout(timeOut);
            timeOut = setTimeout(() => {
              setBallColor('black');
              setBgContent('linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)');
            }, 1000)
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
        background: bgContent ?? 'linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)',
      }}
    >
      <div
        ref={menuRef}
        className='relative flex flex-col min-w-[30vw] max-w-[30%] w-full aspect-square'
      >
        <div
          className="relative flex items-center justify-center h-[100%] w-[100%] rounded-full"
          style={{
            zIndex: 9999,
            overflow: 'hidden',
            background: ballColor,
            transition: 'background 1.5s ease',
          }}
        >
          <div
            className="absolute w-full h-full inset-0 rounded-full bg-black shadow-inner-white-gradient"
          >
          </div>
        </div>
        <RenderLinks />
      </div>
    </div>
  );
};

export default Menu;
