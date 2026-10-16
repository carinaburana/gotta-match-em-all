import { useEffect, useRef } from 'react';

import type { SwipeDirection } from '@/types/game';

/** ← / → arrow keys trigger the same swipe action as gestures and buttons. */
export function useKeyboardSwipe(onSwipe: (direction: SwipeDirection) => void, enabled: boolean) {
  const onSwipeRef = useRef(onSwipe);
  useEffect(() => {
    onSwipeRef.current = onSwipe;
  }, [onSwipe]);

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'ArrowLeft') onSwipeRef.current('left');
      if (event.key === 'ArrowRight') onSwipeRef.current('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
