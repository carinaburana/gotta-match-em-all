import { motion } from 'motion/react';

import { AlienImage } from '@/components/cards/AlienImage';
import { TheOneFace } from '@/components/cards/TheOneFace';
import type { QueueNumbers } from '@/game/ending';

interface EndingQueueProps {
  /** Real portraits lined up at the front of the queue, nearest first. */
  portraitSrcs: readonly string[];
  numbers: QueueNumbers;
  /** False while THE ONE tries to move up; true once it has been pushed back and locked. */
  held: boolean;
  tags: { next: string; theOne: string; held: string };
}

/**
 * Fake perspective: each slot further back is smaller, higher and further right, so the queue
 * recedes diagonally into the dark. Plain 2D keeps it identical in every browser.
 */
const SLOT_STEP_X = 22;
const SLOT_STEP_Y = -48;
const SLOT_SCALE_LOSS = 0.1;
/** Extra slots between the visible front and THE ONE, so it reads as "far, far back". */
const GAP_SLOTS = 1.4;
const ENTER_STAGGER_S = 0.09;
const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

function slotTransform(slot: number) {
  return {
    x: slot * SLOT_STEP_X,
    y: slot * SLOT_STEP_Y,
    scale: Math.max(0.4, 1 - slot * SLOT_SCALE_LOSS),
  };
}

/**
 * The "queue" beat: the rest of the deck as a line receding into the dark. THE ONE waits at the
 * very back, tries to move up towards the front — and is pushed back and locked there.
 */
export function EndingQueue({ portraitSrcs, numbers, held, tags }: EndingQueueProps) {
  const theOneSlot = portraitSrcs.length + GAP_SLOTS;
  const theOneRest = slotTransform(theOneSlot);
  const gap = slotTransform(portraitSrcs.length + GAP_SLOTS / 2);
  const enterDelay = 0.15 + portraitSrcs.length * ENTER_STAGGER_S;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[11%] flex justify-center"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      aria-hidden
    >
      {/* Anchor: the front slot, shifted left so the diagonal is centred as a whole. */}
      <div className="relative h-32 w-24" style={{ left: -((theOneSlot * SLOT_STEP_X) / 2) }}>
        {/* THE ONE — rendered first so the front cards paint over it. */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, x: theOneRest.x + 40, y: theOneRest.y, scale: theOneRest.scale }}
          animate={
            held
              ? // Shoved back into its slot with a hard stop.
                { opacity: 1, x: theOneRest.x, y: theOneRest.y, scale: theOneRest.scale }
              : // Anticipation dip, then a hopeful move down the line towards the front.
                {
                  opacity: 1,
                  x: [theOneRest.x + 40, theOneRest.x, theOneRest.x + 8, theOneRest.x - 56],
                  y: [theOneRest.y, theOneRest.y, theOneRest.y - 10, theOneRest.y + 120],
                  scale: [
                    theOneRest.scale,
                    theOneRest.scale,
                    theOneRest.scale * 0.96,
                    theOneRest.scale + 0.32,
                  ],
                }
          }
          transition={
            held
              ? { duration: 0.24, ease: 'easeIn' }
              : {
                  duration: 2.3,
                  delay: enterDelay,
                  times: [0, 0.22, 0.42, 1],
                  ease: ['easeOut', 'easeInOut', 'easeInOut'],
                  // Opacity is a plain fade; the keyframe timing above is only for the hop.
                  opacity: { duration: 0.5, delay: enterDelay },
                }
          }
        >
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-xl ring-4 ring-accent-pink"
            animate={
              held
                ? {
                    scale: [1.04, 0.94, 1],
                    opacity: 0.7,
                    boxShadow: '0 0 0px 0px rgba(255,95,162,0)',
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    boxShadow: [
                      '0 0 20px 0px rgba(255,95,162,0.35)',
                      '0 0 44px 6px rgba(255,95,162,0.75)',
                    ],
                  }
            }
            transition={
              held
                ? { duration: 0.45, delay: 0.2 }
                : { boxShadow: { duration: 1.4, delay: enterDelay + 0.9 } }
            }
          >
            <TheOneFace />
          </motion.div>

          {/* Tag above the card: "best match" becomes "held" with a lock. */}
          <motion.div
            key={held ? 'held' : 'best'}
            className={`absolute -top-9 left-1/2 flex origin-bottom items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-lg ${
              held ? 'bg-white text-ink' : 'bg-accent-pink text-white'
            }`}
            style={{ x: '-50%' }}
            // Counter-scales the tag so it stays legible on the far-away (scaled-down) card.
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: Math.min(1.5, 1 / theOneRest.scale) }}
            transition={
              held
                ? { type: 'spring', stiffness: 500, damping: 18, delay: 0.3 }
                : { duration: 0.3, delay: enterDelay + 0.3 }
            }
          >
            {held && <LockGlyph />}
            {held ? tags.held : tags.theOne}
          </motion.div>
        </motion.div>

        {/* "+ N more" right of the gap between the visible front and the back. */}
        <motion.span
          className="absolute top-1/2 left-full rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-white/70"
          initial={{ opacity: 0, x: gap.x + 12, y: gap.y - 10 }}
          animate={{ opacity: 1, x: gap.x + 12, y: gap.y - 10 }}
          transition={{ duration: 0.5, delay: enterDelay }}
        >
          + {numbers.hidden} more
        </motion.span>

        {/* Front of the queue, back to front so nearer cards paint on top. */}
        {[...portraitSrcs].reverse().map((src, reversedIndex) => {
          const slot = portraitSrcs.length - 1 - reversedIndex;
          const rest = slotTransform(slot);
          return (
            <motion.div
              key={src}
              className="absolute inset-0 overflow-hidden rounded-xl bg-brand-100 shadow-xl shadow-black/50 ring-2 ring-white/80"
              initial={{ opacity: 0, x: rest.x + 60, y: rest.y, scale: rest.scale }}
              animate={{ opacity: 1, x: rest.x, y: rest.y, scale: rest.scale }}
              transition={{
                duration: 0.55,
                delay: 0.1 + reversedIndex * ENTER_STAGGER_S,
                ease: EASE_OUT_SOFT,
              }}
            >
              <AlienImage src={src} alt="" />
              {/* Cards further back fade into the dark. */}
              <span
                className="absolute inset-0 bg-brand-900"
                style={{ opacity: Math.min(0.6, slot * 0.16) }}
              />
            </motion.div>
          );
        })}

        <motion.span
          className="absolute -bottom-9 left-1/2 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-ink shadow-lg"
          style={{ x: '-50%' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {tags.next}
        </motion.span>
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
