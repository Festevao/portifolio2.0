import { useEffect, useRef, useState } from 'react';
import Option from './Option';
import { MenuLink } from '../../types/MenuLink';

const Menu = () => {
  const menuRef = useRef<any>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);
  const [timeoutOp, setTimeoutOp] = useState<NodeJS.Timeout>();
  const [bgOpacity, setBgOpacity] = useState(0);
  const [stars, setStars] = useState<{ id: number; left: number; animationDelay: number; trailHeight: number; }[]>([]);

  const menuLinks: MenuLink[] = [
    {
      label: 'Base de conhecimento',
      href: '/knowledge',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_1.png');
      },
    },
    {
      label: 'Blog pessoal',
      href: '/blog',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_2.png');
      },
    },
    {
      label: 'Sobre mim',
      href: '/about',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_3.png');
      },
    },
    {
      label: 'Experiência',
      href: '/professional-experience',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_4.png');
      },
    },
    {
      label: 'Formação',
      href: '/education',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_5.png');
      },
    },
    {
      label: 'Contato',
      href: '/contact',
      onHover: () => {
        clearTimeout(timeoutOp);
        setBgOpacity(0.9);
        setBgImage('/img/menu_bg/menu_6.png');
      },
    },
  ];

  const RenderLinksMobile = () => {
    return menuLinks.map(({ href, label }, index) => {
      return (
        <a href={href} className='w-[80%]' key={`mobile-link-${index}`}>
          <div className='w-full flex items-center justify-center bg-gray-300 text-black p-5 rounded-md shadow-md shadow-white border border-black'>
            <span className='underline'>{label}</span>
          </div>
        </a>
      );
    });
  }

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

  useEffect(() => {
    const starCount = Math.floor(Math.random() * (20 - 12 + 1)) + 12;
    const newStars = Array.from({ length: starCount }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      animationDelay: Math.random() * 15,
      trailHeight: Math.random() * (200 - 25) + 25,
    }));
    setStars(newStars);
  }, []);

  return (
    <div
      className='relative flex flex-col justify-center items-center min-h-[100vh] min-w-[100vw] w-full h-full overflow-hidden'
      style={{
        backgroundColor: '#000000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='409' height='49.1' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='6.7' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <img
        alt="Slider"
        src={bgImage}
        className="absolute flex flex-col justify-center max-h-[200px] sm:max-h-[500px] md:max-h-[700px] lg:max-h-[1000px] items-center w-full h-full animate-float"
        width={'100%'}
        height={'100%'}
        style={{
          opacity: bgOpacity,
          transition: bgImage ? 'opacity 1s ease-in' : 'unset',
        }}
      />
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            animationDelay: `${star.animationDelay}s`,
          }}
        >
          <div className="star-trail" style={{ height: `${star.trailHeight}px` }} />
        </div>
      ))}
      <div
        className='relative flex md:hidden flex-col w-full h-full min-h-[80vh] justify-start items-center gap-4 animate-float'
      >
        <RenderLinksMobile />
      </div>
      <div
        ref={menuRef}
        className='relative hidden md:flex flex-col min-w-[30vw] max-w-[30%] w-full aspect-square'
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
              fontSize: (menuSize.width * 0.12).toString() + 'px',
              fontStyle: 'italic',
              lineHeight: 0.8,
            }}
            className='text-center'
          >
            Portifólio<br />
            <span
              style={{
                fontSize: (menuSize.width * 0.05).toString() + 'px',
                fontStyle: 'italic',
              }}
            >
              Felipi Estevão
            </span>
          </span>
          <div
            className="absolute w-full h-full inset-0 rounded-full bg-black shadow-inner-white-gradient"
          />
        </div>
        <RenderLinks />
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>
      <style jsx>{`
        .star {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 3px;
          box-shadow: 0 0 3px 3px white;
          background: white;
          border-radius: 50%;
          animation: rise 15s linear infinite;
        }

        .star-trail {
          position: absolute;
          top: 100%;
          left: 50%;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
          box-shadow: 0 0 1px rgba(255, 255, 255, 0.338);
          transform: translateX(-50%);
        }

        @keyframes rise {
          to {
            transform: translateY(-100vh);
            opacity: 0;
            box-shadow: 0 0 1px 1px white;
          }
        }
      `}</style>
      <div className='flex flex-row gap-2 fixed bottom-2 text-xs'>
        <button className='bg-white rounded-md p-2 underline border border-black shadow-md shadow-white'>  Curriculo online  </button>
        <button className='bg-white rounded-md p-2 underline border border-black shadow-md shadow-white'>Curriculo presencial</button>
      </div>
    </div>
  );
};

export default Menu;