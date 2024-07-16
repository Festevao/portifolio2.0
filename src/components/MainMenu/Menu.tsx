import { useEffect, useRef, useState } from 'react';
import { menuLinks } from './links';
import Option from './Option';

const Menu = () => {
  const menuRef = useRef<any>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

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
  }, []);

  const RenderLinks = () => {
    return menuLinks.map((link, index) => (
      <Option
        key={index}
        maxIndex={menuLinks.length}
        index={index}
        href={link.href}
        menuSize={menuSize}
      >
        {link.label}
      </Option>
    ));
  };

  return (
    <div
      className='relative flex flex-col min-w-[30vw] max-w-[30%] w-full aspect-square'
    >
      <div
        ref={menuRef}
        className="relative flex items-center justify-center w-full aspect-square rounded-full bg-black"
        style={{
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        <div
          className="absolute w-full h-full inset-0 rounded-full bg-black shadow-inner-white-gradient"
          style={{
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
        </div>
      </div>
      <RenderLinks />
    </div>
  );
};

export default Menu;
