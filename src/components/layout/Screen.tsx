import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  /** Pinned to the bottom (primary action). Stays visible on short screens. */
  footer?: ReactNode;
  className?: string;
}

/**
 * Standard full-height screen layout: scrollable content area + pinned footer action.
 * Handles safe-area padding. The gameplay screen uses its own layout instead.
 */
export function Screen({ children, footer, className = '' }: ScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <div className={`pt-safe flex min-h-0 flex-1 flex-col overflow-y-auto px-6 ${className}`}>
        {children}
      </div>
      {footer && <div className="pb-safe shrink-0 px-6 pt-3">{footer}</div>}
    </div>
  );
}
