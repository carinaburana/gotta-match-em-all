import { motion } from 'motion/react';

import type { StageTone } from '@/components/layout/StageLayout';

interface StageBackdropProps {
  tone: StageTone;
  /** Dark tone only: lower the spotlight while nobody is on stage. */
  dim?: boolean;
}

/**
 * The full-bleed lighting shared by the landing page, the THE ONE teaser and the ending reveal:
 * a beam of light from above, a glow in the middle, a pool on the floor — and specks in the air.
 * `light` is daylight with sparkles (hopeful); `dark` is a stage spotlight with dust (the reveal).
 */
export function StageBackdrop({ tone, dim = false }: StageBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {tone === 'light' ? (
        <>
          <Lighting
            beam="color-mix(in oklab, var(--color-accent-pink) 16%, transparent)"
            glow="color-mix(in oklab, var(--color-brand-200) 70%, transparent)"
            floor="color-mix(in oklab, var(--color-accent-yellow) 28%, transparent)"
            floorHeightClass="h-40"
          />
          <Sparkles />
        </>
      ) : (
        <>
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: dim ? 0.45 : 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Lighting
              beam="color-mix(in oklab, white 10%, transparent)"
              glow="color-mix(in oklab, var(--color-brand-400) 55%, transparent)"
              floor="color-mix(in oklab, var(--color-accent-pink) 32%, transparent)"
              floorHeightClass="h-24"
            />
          </motion.div>
          <Dust />
        </>
      )}
    </div>
  );
}

interface LightingProps {
  beam: string;
  glow: string;
  floor: string;
  floorHeightClass: string;
}

function Lighting({ beam, glow, floor, floorHeightClass }: LightingProps) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${beam}, transparent 78%)`,
          clipPath: 'polygon(41% 0, 59% 0, 110% 100%, -10% 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(55% 48% at 50% 62%, ${glow}, transparent 100%)` }}
      />
      <div
        className={`absolute inset-x-0 bottom-0 ${floorHeightClass}`}
        style={{ background: `radial-gradient(50% 100% at 50% 100%, ${floor}, transparent 100%)` }}
      />
    </>
  );
}

/** The same eight spots in both tones: sparkles in daylight, dust in the spotlight. */
const SPECKS = [
  { top: '14%', left: '30%', delay: '0s' },
  { top: '22%', left: '66%', delay: '0.7s' },
  { top: '36%', left: '18%', delay: '1.3s' },
  { top: '44%', left: '78%', delay: '0.4s' },
  { top: '58%', left: '12%', delay: '1.6s' },
  { top: '64%', left: '86%', delay: '1s' },
  { top: '76%', left: '28%', delay: '0.2s' },
  { top: '80%', left: '72%', delay: '2s' },
];
const SPARKLE_SIZES = [14, 10, 10, 14, 9, 11, 9, 12];
const DUST_SIZES = [3, 2, 2, 3, 2, 2, 2, 3];

function Sparkles() {
  return (
    <>
      {SPECKS.map(({ top, left, delay }, index) => (
        <svg
          key={`${top}-${left}`}
          viewBox="0 0 20 20"
          className="absolute animate-twinkle text-accent-yellow"
          style={{
            top,
            left,
            width: SPARKLE_SIZES[index],
            height: SPARKLE_SIZES[index],
            animationDelay: delay,
          }}
        >
          <path
            d="M10 0 C 10.8 6.5, 13.5 9.2, 20 10 C 13.5 10.8, 10.8 13.5, 10 20 C 9.2 13.5, 6.5 10.8, 0 10 C 6.5 9.2, 9.2 6.5, 10 0 Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </>
  );
}

function Dust() {
  return (
    <>
      {SPECKS.map(({ top, left, delay }, index) => (
        <span
          key={`${top}-${left}`}
          className="absolute animate-float rounded-full bg-white/30"
          style={{
            top,
            left,
            width: DUST_SIZES[index],
            height: DUST_SIZES[index],
            animationDelay: delay,
          }}
        >
          <span
            className="block h-full w-full animate-twinkle rounded-full bg-white"
            style={{ animationDelay: delay }}
          />
        </span>
      ))}
    </>
  );
}
