import { motion } from 'motion/react';
import type { TargetAndTransition, Transition } from 'motion/react';

import { AlienImage } from '@/components/cards/AlienImage';
import { EASE_OUT_SOFT } from '@/components/animations/variants';

import { TheOneFace } from '@/components/cards/TheOneFace';
import type { StageTone } from '@/components/layout/StageLayout';

/**
 * What THE ONE's card is doing in the queue:
 * - `hide`:    arrives big at the front and slips away to the very back (teaser)
 * - `settled`: rests at the back, the whole line floating gently (teaser)
 * - `reach`:   dips, then moves hopefully up the line towards the front (ending)
 * - `held`:    shoved back into its slot and locked (ending)
 */
export type TheOneQueueState = 'hide' | 'settled' | 'reach' | 'held';

interface DeckQueueProps {
  tone: StageTone;
  /** Real portraits lined up at the front of the queue, nearest first. */
  portraitSrcs: readonly string[];
  /** Cards between the visible front and THE ONE ("+ N more"). */
  hiddenCount: number;
  theOne: TheOneQueueState;
  /** Optional labels under the front card and above THE ONE (the ending's queue numbers). */
  tags?: { front?: string; theOne?: string };
}

/**
 * Fake perspective: each slot further back is smaller, higher and further right, so the queue
 * recedes diagonally into the distance. Plain 2D keeps it identical in every browser.
 */
const SLOT_STEP_X = 22;
const SLOT_STEP_Y = -48;
const SLOT_SCALE_LOSS = 0.1;
/** Extra slots between the visible front and THE ONE, so it reads as "far, far back". */
const GAP_SLOTS = 1.4;
const ENTER_STAGGER_S = 0.09;
const GLOW_SOFT = '0 0 20px 0px color-mix(in oklab, var(--color-accent-pink) 35%, transparent)';
const GLOW_STRONG = '0 0 44px 6px color-mix(in oklab, var(--color-accent-pink) 75%, transparent)';
const GLOW_NONE = '0 0 0px 0px transparent';

function slotTransform(slot: number) {
  return {
    x: slot * SLOT_STEP_X,
    y: slot * SLOT_STEP_Y,
    scale: Math.max(0.4, 1 - slot * SLOT_SCALE_LOSS),
  };
}

/**
 * The deck as a line of cards receding into the distance, with THE ONE at the very back. The
 * teaser shows it slipping back there ("somewhere in your deck"); the ending shows the same line
 * again and that it was kept there on purpose. Narrative only — THE ONE is never a real card.
 */
export function DeckQueue({ tone, portraitSrcs, hiddenCount, theOne, tags }: DeckQueueProps) {
  const isDark = tone === 'dark';
  const theOneSlot = portraitSrcs.length + GAP_SLOTS;
  const theOneRest = slotTransform(theOneSlot);
  const gap = slotTransform(portraitSrcs.length + GAP_SLOTS / 2);
  const anchorShift = -((theOneSlot * SLOT_STEP_X) / 2);
  const enterDelay = 0.15 + portraitSrcs.length * ENTER_STAGGER_S;
  /** Where the teaser's big THE ONE card was: centred on the stage, above the front slot. */
  const hideStart = { x: -anchorShift, y: -120, scale: 1.5 };

  const theOneMotions = {
    hide: {
      animate: {
        opacity: 1,
        x: [hideStart.x, hideStart.x, theOneRest.x],
        y: [hideStart.y, hideStart.y - 50, theOneRest.y],
        scale: [hideStart.scale, hideStart.scale * 0.95, theOneRest.scale],
      },
      transition: {
        duration: 1.7,
        delay: 0.25,
        times: [0, 0.28, 1],
        ease: ['easeInOut', 'easeInOut'],
        opacity: { duration: 0.3 },
      },
    },
    settled: {
      animate: { opacity: 1, x: theOneRest.x, y: theOneRest.y, scale: theOneRest.scale },
      transition: { duration: 0.6, ease: EASE_OUT_SOFT },
    },
    reach: {
      // Anticipation dip, then a hopeful move down the line towards the front.
      animate: {
        opacity: 1,
        x: [theOneRest.x + 40, theOneRest.x, theOneRest.x + 8, theOneRest.x - 56],
        y: [theOneRest.y, theOneRest.y, theOneRest.y - 10, theOneRest.y + 120],
        scale: [
          theOneRest.scale,
          theOneRest.scale,
          theOneRest.scale * 0.96,
          theOneRest.scale + 0.32,
        ],
      },
      transition: {
        duration: 2.3,
        delay: enterDelay,
        times: [0, 0.22, 0.42, 1],
        ease: ['easeOut', 'easeInOut', 'easeInOut'],
        // Opacity is a plain fade; the keyframe timing above is only for the hop.
        opacity: { duration: 0.5, delay: enterDelay },
      },
    },
    held: {
      // Shoved back into its slot with a hard stop.
      animate: { opacity: 1, x: theOneRest.x, y: theOneRest.y, scale: theOneRest.scale },
      transition: { duration: 0.24, ease: 'easeIn' },
    },
  } satisfies Record<TheOneQueueState, { animate: TargetAndTransition; transition: Transition }>;
  const theOneMotion = theOneMotions[theOne];

  const theOneInitial =
    theOne === 'hide'
      ? { opacity: 0, ...hideStart }
      : { opacity: 0, x: theOneRest.x + 40, y: theOneRest.y, scale: theOneRest.scale };

  const cardGlow = {
    hide: { scale: 1, opacity: 1, boxShadow: [GLOW_STRONG, GLOW_SOFT] },
    settled: { scale: 1, opacity: 0.9, boxShadow: GLOW_SOFT },
    reach: { scale: 1, opacity: 1, boxShadow: [GLOW_SOFT, GLOW_STRONG] },
    held: { scale: [1.04, 0.94, 1], opacity: 0.7, boxShadow: GLOW_NONE },
  }[theOne];
  const cardGlowTransition = {
    hide: { boxShadow: { duration: 1.7, delay: 0.25 } },
    settled: { duration: 0.6 },
    reach: { boxShadow: { duration: 1.4, delay: enterDelay + 0.9 } },
    held: { duration: 0.45, delay: 0.2 },
  }[theOne];

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[11%] flex justify-center"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      aria-hidden
    >
      {/* Anchor: the front slot, shifted left so the diagonal is centred as a whole. */}
      <div
        className={`relative h-32 w-24 ${theOne === 'settled' ? 'animate-float' : ''}`}
        style={{ left: anchorShift }}
      >
        {/* THE ONE — rendered first so the front cards paint over it. */}
        <motion.div
          className="absolute inset-0"
          // In front of the line while it slips in big; behind it once it rests at the back.
          style={{ zIndex: theOne === 'hide' ? 10 : 0 }}
          initial={theOneInitial}
          animate={theOneMotion.animate}
          transition={theOneMotion.transition}
        >
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-xl ring-4 ring-accent-pink"
            animate={cardGlow}
            transition={cardGlowTransition}
          >
            <TheOneFace />
          </motion.div>

          {tags?.theOne && (
            <motion.div
              key={`${theOne}-${tags.theOne}`}
              className={`absolute -top-9 left-1/2 flex origin-bottom items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-lg ${
                theOne === 'held' ? 'bg-white text-ink' : 'bg-accent-pink text-white'
              }`}
              style={{ x: '-50%' }}
              // Counter-scales the tag so it stays legible on the far-away (scaled-down) card.
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: Math.min(1.5, 1 / theOneRest.scale) }}
              transition={
                theOne === 'held'
                  ? { type: 'spring', stiffness: 500, damping: 18, delay: 0.3 }
                  : { duration: 0.3, delay: enterDelay + 0.3 }
              }
            >
              {theOne === 'held' && <LockGlyph />}
              {tags.theOne}
            </motion.div>
          )}
        </motion.div>

        {/* "+ N more" right of the gap between the visible front and the back. */}
        <motion.span
          className={`absolute top-1/2 left-full rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
            isDark ? 'bg-white/10 text-white/70' : 'bg-brand-900/10 text-ink/75'
          }`}
          initial={{ opacity: 0, x: gap.x + 12, y: gap.y - 10 }}
          animate={{ opacity: 1, x: gap.x + 12, y: gap.y - 10 }}
          transition={{ duration: 0.5, delay: theOne === 'hide' ? 1.6 : enterDelay }}
        >
          + {hiddenCount} more
        </motion.span>

        {/* Front of the queue, back to front so nearer cards paint on top. */}
        {[...portraitSrcs].reverse().map((src, reversedIndex) => {
          const slot = portraitSrcs.length - 1 - reversedIndex;
          const rest = slotTransform(slot);
          return (
            <motion.div
              key={src}
              className={`absolute inset-0 overflow-hidden rounded-xl bg-brand-100 shadow-xl ring-2 ring-white/80 ${
                isDark ? 'shadow-black/50' : 'shadow-brand-900/25'
              }`}
              initial={{ opacity: 0, x: rest.x + 60, y: rest.y, scale: rest.scale }}
              animate={{ opacity: 1, x: rest.x, y: rest.y, scale: rest.scale }}
              transition={{
                duration: 0.55,
                delay: 0.1 + reversedIndex * ENTER_STAGGER_S,
                ease: EASE_OUT_SOFT,
              }}
            >
              <AlienImage src={src} alt="" />
              {/* Cards further back fade into the distance. */}
              <span
                className={`absolute inset-0 ${isDark ? 'bg-brand-900' : 'bg-canvas'}`}
                style={{ opacity: Math.min(isDark ? 0.6 : 0.5, slot * 0.16) }}
              />
            </motion.div>
          );
        })}

        {tags?.front && (
          <motion.span
            className={`absolute -bottom-9 left-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-lg ${
              isDark ? 'bg-white text-ink' : 'bg-brand-600 text-white'
            }`}
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {tags.front}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
