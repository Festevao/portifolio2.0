import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { isMobile } from 'react-device-detect';

interface Props {
  children?: ReactNode;
  maxIndex: number;
  index: number;
  href: string;
  menuSize: { width: number; height: number; };
  onHover?: (...args: any) => void;
  onDisHover?: (...args: any) => void;
}

const Option: React.FC<Props> = ({
  children,
  maxIndex,
  index,
  href,
  menuSize,
  onHover,
  onDisHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gap = menuSize.height * 0.03;
  const colIndex = Math.floor(index / 2);
  const maxColIndex = Math.ceil(maxIndex / 2);
  const hideOffset = menuSize.width * 0.33;

  const hOffset = menuSize.height - (maxColIndex + 1) * gap;
  const height = hOffset / maxColIndex;

  const top = gap + (colIndex * gap) + (height * colIndex);

  const size = index % 2 === 0
    ? -((menuSize.width / 2) + (menuSize.width * 0.55))
    : ((menuSize.width / 2) + (menuSize.width * 0.55));

  const distanceToMiddle = (range: number, index: number) => {
    const mid1 = Math.floor((range - 1) / 2);
    const mid2 = Math.ceil((range - 1) / 2);
  
    const returnValue = Math.min(Math.abs(index - mid1), Math.abs(index - mid2));
  
    return returnValue > 0 ? returnValue + 0.2 : 1.1 + (colIndex / 10);
  }

  const width = isHovered || isMobile || menuSize.width < 150
    ? `${Math.abs(size)}px`
    : `${Math.abs(size) - Math.abs(hideOffset * distanceToMiddle(maxColIndex, colIndex))}px`;

  const calculateBorderRadius = (
    diameter: number,
    stripHeight: number,
    stripTop: number
  ) => {
    const radius = diameter / 2;

    const topDistanceFromCenter = Math.abs(radius - stripTop);
    const bottomDistanceFromCenter = Math.abs(radius - (stripTop + stripHeight));

    const borderTopRadius = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(topDistanceFromCenter, 2));
    const borderBottomRadius = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(bottomDistanceFromCenter, 2));

    return {
      borderTop: `${borderTopRadius}px`,
      borderBottom: `${borderBottomRadius}px`
    };
  }

  const radius = calculateBorderRadius(menuSize.width, height, top);

  const calcProps = () => {
    return index % 2 === 0
      ? {
        borderTopLeftRadius: radius.borderTop,
        borderBottomLeftRadius: radius.borderBottom,
        borderLeft: '8px solid gray',
      }
      : {
        borderTopRightRadius: radius.borderTop,
        borderBottomRightRadius: radius.borderBottom,
        borderRight: '8px solid gray',
      };
  }

  return (
    <div 
      className={`\ 
        \ absolute bg-gray-300 text-black
      `}
      style={{
        left: '50%',
        width: width,
        height: height,
        transform: `translateX(${size >= 0 ? '0' : '-100%'})`,
        ...calcProps(),
        top: top.toString() + 'px',
        transition: 'width 1s ease',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover && onHover();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onDisHover && onDisHover();
      }}
    >
      <Link
        href={href}
        className='w-full h-full flex flex-col justify-center'
        style={{
          textAlign: index % 2 === 0 ? 'left' : 'right',
          paddingLeft: index % 2 === 0 ? '12%' : 'unset',
          paddingRight: index % 2 === 0 ? 'unset' : '12%',
          fontSize: (menuSize.width * 0.04).toString() + 'px',
          textDecoration: 'underline',
        }}
      >
        {children}
      </Link>
    </div>
  );
}

export default Option;