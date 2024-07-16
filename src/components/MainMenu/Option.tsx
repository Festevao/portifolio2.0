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

  const gap = menuSize.height * 0.03;
  const colIndex = Math.floor(index / 2);
  const maxColIndex = Math.ceil(maxIndex / 2);
  const middleIndex = Math.ceil(maxColIndex / 2);
  const indexMiddleDiff = Math.abs(middleIndex - (colIndex + 1));
  const hideOffset = menuSize.width * 0.15;

  const hOffset = menuSize.height - (maxColIndex + 1) * gap;
  const height = hOffset / maxColIndex;

  const top = gap + (colIndex * gap) + (height * colIndex);

  const size = index % 2 === 0
    ? -((menuSize.width / 2) + (menuSize.width * 0.4))
    : ((menuSize.width / 2) + (menuSize.width * 0.4));

  console.log({
    children,
    maxIndex,
    index,
    href,
    menuSize,
    gap,
    colIndex,
    maxColIndex,
    middleIndex,
    indexMiddleDiff,
    hOffset,
    height,
  })

  return (
    <div 
      className={`\ 
        \ absolute bg-slate-400 text-black
      `}
      style={{
        left: '50%',
        width: isHovered ? `${Math.abs(size)}px` : `${Math.abs(size) - Math.abs(hideOffset * (indexMiddleDiff + 1))}px`,
        height: height,
        transform: `translateX(${size >= 0 ? '0' : '-100%'})`,
        borderTopRightRadius: index % 2 === 0 ? 'unset' : '5rem',
        borderBottomRightRadius: index % 2 === 0 ? 'unset' : '5rem',
        borderTopLeftRadius: index % 2 === 0 ? '5rem' : 'unset',
        borderBottomLeftRadius: index % 2 === 0 ? '5rem' : 'unset',
        top: top.toString() + 'px',
        transition: 'width 1s ease',
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
        }}
      >
        {children}
      </Link>
    </div>
  );
}

export default Option;