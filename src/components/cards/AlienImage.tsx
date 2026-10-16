import { useState } from 'react';

import { FALLBACK_PORTRAIT_SRC } from '@/data';

interface AlienImageProps {
  src: string;
  alt: string;
  className?: string;
  /** How the image fills its container. Containers decide the size, never the image. */
  fit?: 'cover' | 'contain';
}

/** Portrait with a local fallback, so a missing or broken file never shows a broken image. */
export function AlienImage({ src, alt, className = '', fit = 'cover' }: AlienImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === src ? FALLBACK_PORTRAIT_SRC : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      draggable={false}
      onError={() => {
        if (resolvedSrc !== FALLBACK_PORTRAIT_SRC) setFailedSrc(src);
      }}
      className={`h-full w-full select-none ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
    />
  );
}
