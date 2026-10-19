import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import { EASE_OUT_SOFT } from '@/components/animations/variants';

export type StageTone = 'light' | 'dark';

export interface StageCaption {
  /** Changing the key animates the old line out and the new one in. */
  key: string;
  text: string;
  /** Accent colour for the punchline. */
  emphasis?: boolean;
  /** Seconds to hold before the line fades in. */
  delayS?: number;
}

interface StageLayoutProps {
  /** `light` for the hopeful teaser before the game, `dark` for the ending reveal. */
  tone: StageTone;
  /** Small tag in the top-right corner, next to the logo. */
  letterhead: string;
  caption: StageCaption;
  /** Pinned action at the bottom. */
  footer: ReactNode;
  /** Full-bleed layers drawn behind the stage (glow, cone, sparkles). */
  backdrop?: ReactNode;
  /** The stage itself: absolutely positioned children, measured from its edges. */
  children: ReactNode;
}

/**
 * The "cinematic" screen skeleton shared by the THE ONE teaser and the ending reveal, so both
 * have exactly the same letterhead, stage, caption band and footer measurements — the ending is
 * the teaser's dark mirror, and the identical frame is what sells that.
 *
 * Layout, top to bottom: letterhead (logo + tag) · stage (fills) · caption band · footer.
 */
export function StageLayout({
  tone,
  letterhead,
  caption,
  footer,
  backdrop,
  children,
}: StageLayoutProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden ${
        isDark ? 'bg-ink text-white' : 'bg-canvas text-ink'
      }`}
    >
      {backdrop && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {backdrop}
        </div>
      )}

      <motion.header
        className="pt-safe relative flex shrink-0 items-center justify-between gap-4 px-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img
          src="/logo.webp"
          alt="Gotta Match 'Em All"
          width={840}
          height={476}
          draggable={false}
          className="h-auto w-24 select-none opacity-90"
        />
        <p
          className={`text-right text-[10px] font-semibold tracking-[0.22em] uppercase ${
            isDark ? 'text-white/55' : 'text-ink-muted'
          }`}
        ></p>
      </motion.header>

      <div className="relative min-h-0 flex-1">{children}</div>

      {/* One line per beat. The visuals carry the story; this is the narrator's voice. */}
      <div
        className="relative flex min-h-24 shrink-0 items-center justify-center px-7 pt-2 pb-3 text-center"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={caption.key}
            className={`font-display font-black text-balance ${
              caption.emphasis
                ? `text-[1.7rem] leading-tight ${isDark ? 'text-accent-pink' : 'text-brand-600'}`
                : 'text-[1.45rem] leading-snug'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE_OUT_SOFT, delay: caption.delayS ?? 0 }}
          >
            {caption.text}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="pb-safe relative shrink-0 px-6 pt-1">{footer}</div>
    </div>
  );
}
