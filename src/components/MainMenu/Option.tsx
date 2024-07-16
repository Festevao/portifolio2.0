import Link from 'next/link';
import { ReactNode, useState } from 'react';

type Props = {
  children?: ReactNode,
  maxIndex: number,
  index: number,
  href: string,
  menuSize: { width: number, height: number },
}

const Option: React.FC<Props> = ({
  children,
  maxIndex,
  index,
  href,
  menuSize,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gap = menuSize.height * 0.05;
  const colIndex = Math.floor(index / 2);
  const maxColIndex = Math.ceil(maxIndex / 2);
  const middleIndex = maxColIndex / 2;
  const indexMiddleDiff = Math.abs(middleIndex - index);

  const hOffset = menuSize.height - (maxColIndex + 1) * gap;
  const height = hOffset / maxColIndex;

  const top = gap + (colIndex * gap) + (height * colIndex);

  const size = index % 2 === 0
    ? -((menuSize.width / 2) + (menuSize.width * 0.3))
    : ((menuSize.width / 2) + (menuSize.width * 0.3));

  return (
    <div 
      className={`\ 
        \ absolute bg-slate-400 text-black overflow-hidden
      `}
      style={{
        left: '50%',
        width: isHovered ? `${Math.abs(size)}px` : `${Math.abs(size) - (5 * indexMiddleDiff)}px`,
        height: height,
        transform: `translateX(${size >= 0 ? '0' : '-100%'})`,
        borderTopRightRadius: index % 2 === 0 ? 'unset' : '5rem',
        borderBottomRightRadius: index % 2 === 0 ? 'unset' : '5rem',
        borderTopLeftRadius: index % 2 === 0 ? '5rem' : 'unset',
        borderBottomLeftRadius: index % 2 === 0 ? '5rem' : 'unset',
        top: top.toString() + 'px',
        zIndex: 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        className='w-full h-full flex flex-col justify-center'
        style={{
          textAlign: index % 2 === 0 ? 'left' : 'right',
          paddingLeft: index % 2 === 0 ? '5%' : 'unset',
          paddingRight: index % 2 === 0 ? 'unset' : '5%',
          zIndex: -9999,
        }}
      >
        {children}
      </Link>
    </div>
  );
}

export default Option;