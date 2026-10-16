import { CloseIcon, HeartIcon } from '@/components/ui/icons';
import type { SwipeDirection } from '@/types/game';

interface SwipeButtonsProps {
  onSwipe: (direction: SwipeDirection) => void;
  disabled?: boolean;
}

const BUTTON_BASE =
  'flex h-16 w-16 items-center justify-center rounded-full border-[3px] bg-surface shadow-md transition-transform active:scale-90 disabled:opacity-40';

/** Reject / like buttons. They trigger exactly the same action as a swipe gesture. */
export function SwipeButtons({ onSwipe, disabled = false }: SwipeButtonsProps) {
  return (
    <div className="pb-safe flex shrink-0 items-center justify-around px-10 pt-3">
      <button
        type="button"
        aria-label="Reject"
        disabled={disabled}
        onClick={() => onSwipe('left')}
        className={`${BUTTON_BASE} border-nope text-nope`}
      >
        <CloseIcon className="h-8 w-8" strokeWidth={3} />
      </button>
      <button
        type="button"
        aria-label="Like"
        disabled={disabled}
        onClick={() => onSwipe('right')}
        className={`${BUTTON_BASE} border-like bg-like-soft text-like`}
      >
        <HeartIcon className="h-8 w-8" fill="currentColor" />
      </button>
    </div>
  );
}
