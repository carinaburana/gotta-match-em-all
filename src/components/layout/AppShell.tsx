import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  /** Optional fixed region above the screen content (e.g. a future app bar). */
  top?: ReactNode;
  /** Optional fixed region below the screen content (e.g. future bottom navigation). */
  bottom?: ReactNode;
}

/**
 * The phone-sized frame every screen renders into.
 * - Mobile: fills the viewport (uses dvh so browser toolbars don't cause scrolling).
 * - Desktop: a centred, width-limited "phone" so the game never stretches across the screen.
 *
 * Screens fill the `main` region, so adding `top`/`bottom` later doesn't require changing them.
 */
export function AppShell({ children, top, bottom }: AppShellProps) {
  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-canvas md:bg-brand-100">
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-canvas md:h-[min(880px,calc(100dvh-3rem))] md:rounded-[2.5rem] md:shadow-2xl md:shadow-brand-900/20 md:ring-1 md:ring-brand-900/10">
        {top && <div className="shrink-0">{top}</div>}
        <main className="relative min-h-0 flex-1">{children}</main>
        {bottom && <div className="shrink-0">{bottom}</div>}
      </div>
    </div>
  );
}
