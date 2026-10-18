import { animate, AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { TheOneFace } from '@/components/cards/TheOneFace';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import { getSessionEarningsEur, getTotalSwipes } from '@/game/ending';
import { useBeatSequence } from '@/hooks/useBeatSequence';
import type { SessionSummary } from '@/types/game';
import { fillTemplate, formatEuros } from '@/utils/format';

interface EndingRevealAnimationProps {
  playerName: string;
  summary: SessionSummary;
  /** Called once when the last beat (the founder's pitch) is reached. */
  onComplete: () => void;
}

/**
 * The reveal after the game: a "leaked investor update" from the company behind the app.
 * It turns the player's own session into the company's numbers — the search was the product.
 */
export function EndingRevealAnimation({
  playerName,
  summary,
  onComplete,
}: EndingRevealAnimationProps) {
  const { beatDurationsMs } = GAME_CONFIG.ending;
  const beat = useBeatSequence(beatDurationsMs, 'pitch', onComplete);

  const captions = GAME_CONTENT.ending;
  const swipes = getTotalSwipes(summary);
  const earnings = getSessionEarningsEur(summary);
  const fill = (template: string) =>
    fillTemplate(template, {
      name: playerName,
      swipes: String(swipes),
      earnings: formatEuros(earnings),
      position: String(GAME_CONFIG.deck.size),
    });

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-brand-900 p-6 text-white">
      <BoardroomBackdrop />

      <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/60 uppercase">
        <span className="h-2 w-2 animate-pulse rounded-full bg-nope" />
        Internal · Investor update
      </div>

      <div className="relative flex h-64 w-full items-center justify-center">
        <AnimatePresence mode="wait">
          {beat === 'leak' && <LeakedStamp key="leak" />}
          {beat === 'swipes' && (
            <BigNumber key="swipes" value={swipes} format={(n) => String(Math.round(n))} />
          )}
          {beat === 'earnings' && <Earnings key="earnings" value={earnings} />}
          {beat === 'theOne' && <HeldBackCard key="the-one" heldBackLabel={captions.heldBack} />}
          {beat === 'pitch' && <Founder key="founder" />}
        </AnimatePresence>
      </div>

      <div className="relative min-h-24 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={beat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`mx-auto max-w-72 font-black tracking-wide ${beat === 'pitch' ? 'text-2xl' : 'text-lg'}`}
          >
            {beat === 'pitch' ? `“${fill(captions.pitch)}”` : fill(captions[beat])}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Faint grid + upward chart line: the look of a pitch deck slide. */
function BoardroomBackdrop() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-15"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="white" strokeWidth="0.2" />
      ))}
      <motion.polyline
        points="0,90 20,82 35,85 50,65 65,58 80,35 100,12"
        fill="none"
        stroke="var(--color-like)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />
    </svg>
  );
}

function LeakedStamp() {
  return (
    <motion.div className="flex flex-col items-center gap-5" exit={{ opacity: 0, scale: 0.9 }}>
      <Founder />
      <motion.span
        className="rounded-lg border-4 border-nope px-4 py-1 text-3xl font-black tracking-[0.2em] text-nope"
        initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 500, damping: 18 }}
      >
        LEAKED
      </motion.span>
    </motion.div>
  );
}

/**
 * PLACEHOLDER founder/villain. Shows `ending.founderPortraitSrc` when the Pixar-style art exists,
 * otherwise a simple suited silhouette.
 */
function Founder() {
  const { founderPortraitSrc } = GAME_CONFIG.ending;
  return (
    <motion.div
      className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-500 to-brand-800 text-7xl shadow-2xl ring-4 ring-white/20"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {founderPortraitSrc ? (
        <img
          src={founderPortraitSrc}
          alt="The company's founder"
          className="h-full w-full object-cover"
        />
      ) : (
        <span role="img" aria-label="The company's founder">
          🕴️
        </span>
      )}
    </motion.div>
  );
}

/** Counts from 0 up to `value` once, on mount. */
function useCountUp(value: number, durationS = 1.4): number {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: durationS,
      ease: 'easeOut',
      onUpdate: setCurrent,
    });
    return () => controls.stop();
  }, [value, durationS]);
  return current;
}

function BigNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const current = useCountUp(value);
  return (
    <motion.p
      className="text-8xl font-black tabular-nums"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {format(current)}
    </motion.p>
  );
}

const COINS = [
  { left: '18%', delay: 0.2 },
  { left: '34%', delay: 0.7 },
  { left: '52%', delay: 0.1 },
  { left: '68%', delay: 0.9 },
  { left: '82%', delay: 0.4 },
];

function Earnings({ value }: { value: number }) {
  const current = useCountUp(value, 1.8);
  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center"
      exit={{ opacity: 0, y: -20 }}
    >
      {COINS.map(({ left, delay }) => (
        <motion.span
          key={left}
          aria-hidden
          className="absolute bottom-0 text-3xl"
          style={{ left }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -220, opacity: [0, 1, 0] }}
          transition={{ delay, duration: 1.8, ease: 'easeOut' }}
        >
          💶
        </motion.span>
      ))}
      <motion.p
        className="text-7xl font-black text-reward tabular-nums"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {formatEuros(current)}
      </motion.p>
    </motion.div>
  );
}

/** THE ONE's card, pulled from the back of the queue, with the company's reason for hiding it. */
function HeldBackCard({ heldBackLabel }: { heldBackLabel: string }) {
  return (
    <motion.div
      className="relative h-56 w-40"
      initial={{ opacity: 0, x: 120, rotate: 12 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-card shadow-2xl ring-4 ring-accent-pink">
        <TheOneFace />
      </div>
      <motion.span
        className="absolute -top-3 -right-6 rounded-full bg-like px-3 py-1 text-xs font-black shadow-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        #1 match
      </motion.span>
      <motion.span
        className="absolute top-1/2 -left-8 -translate-y-1/2 rounded-lg border-4 border-nope bg-brand-900/80 px-2 py-1 text-center text-sm leading-tight font-black tracking-wider text-nope uppercase"
        initial={{ opacity: 0, scale: 2.2, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -14 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 500, damping: 18 }}
      >
        {heldBackLabel}
      </motion.span>
    </motion.div>
  );
}
