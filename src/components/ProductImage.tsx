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
      style={style} // Adicionado aqui para aplicar o estilo recebido!
    >
      {/* Efeito de carregamento (Skeleton cinza piscando) enquanto a imagem não baixa */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy" 
        onLoad={() => setIsLoaded(true)} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}