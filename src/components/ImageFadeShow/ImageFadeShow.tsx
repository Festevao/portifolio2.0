import { useEffect, useState } from 'react';

interface ImageFadeShowProps {
  images: {
    src: string;
    title?: string;
    alt?: string;
  }[];
}

const ImageFadeShow: React.FC<ImageFadeShowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let auxIndex = prevIndex;
        if (auxIndex >= images.length - 1) auxIndex = -1;
        return auxIndex + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className={`\
        \ relative w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-3xl sm:max-w-[75%] md:max-w-[25vw] aspect-square
        \ shadow-2xl border border-gray-300
      `}
    >
      {images.map(({ src, title, alt }, index) => (
        <img
          key={index}
          src={src}
          alt={alt ?? `Slide ${index}`}
          title={title}
          className={`absolute object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default ImageFadeShow;
