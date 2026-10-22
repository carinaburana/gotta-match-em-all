import { AnimatePresence, motion } from 'motion/react';

interface FounderSceneProps {
  /** Founder artwork for the current beat (see `GAME_CONFIG.ending.founderScenes`). */
  src: string;
  /** Darken the scene while other things (swipe stream, deck queue) take the stage. */
  dim?: boolean;
}

/**
 * The founder who gives the "investor pitch" in the ending reveal, as a full-bleed scene behind
 * the stage. A new `src` cross-fades in with a slow push-in; the same `src` simply holds. Scrims
 * at the top and bottom keep the logo, caption and button readable on any artwork.
 */
export function FounderScene({ src, dim = false }: FounderSceneProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: 'easeInOut' },
            scale: { duration: 6, ease: 'easeOut' },
          }}
        />
      </AnimatePresence>

      {/* Dim while the founder steps back and the overlays tell the story. */}
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={false}
        animate={{ opacity: dim ? 0.6 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Scrims: logo at the top, caption and footer at the bottom. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-ink/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-ink from-35% via-ink/70 to-transparent" />
    </div>
  );
}
