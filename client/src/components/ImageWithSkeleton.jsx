import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ImageWithSkeleton = ({
  src,
  alt = '',
  className = '',
  style = {},
  containerStyle = {},
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="image-skeleton-container"
      style={{
        width: width || '100%',
        height: height || '100%',
        ...containerStyle,
      }}
    >
      {/* Shimmer skeleton wave shown until image finishes loading */}
      {!isLoaded && !hasError && <div className="image-skeleton-shimmer" />}

      {hasError ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f4f4f5',
            color: '#a1a1aa',
            padding: '1rem',
          }}
        >
          <ImageOff size={28} style={{ marginBottom: 6 }} />
          <span style={{ fontSize: '0.75rem' }}>Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`image-lazy-loaded ${className}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            display: 'block',
            ...style,
          }}
        />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
