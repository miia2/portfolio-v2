import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties; 
}

export function ProductImage({ src, alt, className = "", style }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* Efeito de carregamento (Skeleton cinza) enquanto a imagem carrega */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-gray-300" 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#cbd5e1'
          }}
        />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy" 
        onLoad={() => setIsLoaded(true)} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
    </div>
  );
}