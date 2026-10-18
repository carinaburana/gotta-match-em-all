import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { StageBackdrop } from '@/components/animations/StageBackdrop';
import { AlienImage } from '@/components/cards/AlienImage';
import { Logo } from '@/components/ui/Logo';
import { GAME_CONTENT } from '@/data';

/** Fan of profile cards behind the logo: rotation per card, spread from the centre outwards. */
const FAN_ROTATIONS = [-32, -16, 0, 16, 32];

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Title sequence for the landing page: a hand of real profile cards fans out, the logo stamps
 * down on top of it with a bounce, and everything settles into a slow float. Same lighting as
 * the teaser, so the first screen and the teaser feel like one production.
 */
interface LandingTitleAnimationProps {
  /** Tagline under the logo. */
  children: ReactNode;
  /** Pinned action at the bottom; shares the backdrop so the lighting runs under it. */
  footer: ReactNode;
}

export function LandingTitleAnimation({ children, footer }: LandingTitleAnimationProps) {
  const portraits = GAME_CONTENT.portraitSrcs.slice(0, FAN_ROTATIONS.length);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-canvas">
      <StageBackdrop tone="light" />

      <div className="pt-safe relative flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="relative w-full max-w-80">
          {/* Cards pivot at a point tucked behind the top of the logo. */}
          <div className="absolute inset-x-0 top-9 flex justify-center">
            {FAN_ROTATIONS.map((rotation, index) => {
              const fromCentre = Math.abs(index - (FAN_ROTATIONS.length - 1) / 2);
              const delay = 0.15 + fromCentre * 0.08;
              return (
                <motion.div
                  key={rotation}
                  className="absolute bottom-0 h-32 w-24 origin-bottom overflow-hidden rounded-xl bg-brand-100 shadow-xl shadow-brand-900/20 ring-2 ring-white"
                  style={{ zIndex: FAN_ROTATIONS.length - Math.round(fromCentre) }}
                  initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: rotation, y: [0, -7, 0] }}
                  transition={{
                    opacity: { duration: 0.3, delay },
                    scale: { type: 'spring', stiffness: 200, damping: 16, delay },
                    rotate: { type: 'spring', stiffness: 160, damping: 15, delay: delay + 0.1 },
                    y: {
                      delay: delay + 1,
                      duration: 3.4 + fromCentre * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <AlienImage src={portraits[index] ?? ''} alt="" />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 1.35, rotate: -5, y: 24 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.25, delay: 0.5 },
              scale: { type: 'spring', stiffness: 260, damping: 14, delay: 0.5 },
              rotate: { type: 'spring', stiffness: 220, damping: 14, delay: 0.5 },
              y: { delay: 1.6, duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Logo />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, ease: EASE_OUT_SOFT }}
        >
          {children}
        </motion.div>
      </div>

      <div className="pb-safe relative shrink-0 px-6 pt-3">{footer}</div>
    </div>
  );
}
