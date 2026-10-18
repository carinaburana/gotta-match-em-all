import { AnimatePresence, motion } from 'motion/react';

import { TheOneFace } from '@/components/cards/TheOneFace';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import { useBeatSequence } from '@/hooks/useBeatSequence';
import type { InterestId } from '@/types/content';
import { fillTemplate } from '@/utils/format';

interface TheOneTeaserAnimationProps {
  playerName: string;
  /** The player's own interests — THE ONE "shares all of them", which is what makes it perfect. */
  interestIds: readonly InterestId[];
  /** Called once when the last beat is reached. */
  onComplete: () => void;
}

/**
 * Animated stand-in for the teaser video. Builds up THE ONE as the player's perfect match, then
 * shuffles them away into the deck. Purely narrative: THE ONE is never a candidate in the game.
 */
export function TheOneTeaserAnimation({
  playerName,
  interestIds,
  onComplete,
}: TheOneTeaserAnimationProps) {
  const beat = useBeatSequence(GAME_CONFIG.teaser.animation.beatDurationsMs, 'go', onComplete);

  const caption = fillTemplate(GAME_CONTENT.theOneTeaser[beat], { name: playerName });
  const interestLabels = interestIds.map((id) => GAME_CONTENT.interestsById.get(id)?.label ?? id);
  const showCard = beat === 'reveal' || beat === 'interests';
  const showDeck = beat === 'hide' || beat === 'go';

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden p-6 text-white">
      <Sparkles />

      <div className="relative flex h-60 w-full items-center justify-center">
        <AnimatePresence mode="wait">
          {beat === 'matchFound' && <MatchFoundHeart key="heart" />}
          {showCard && <MysteryCard key="card" />}
          {showDeck && <ShuffledDeck key="deck" settle={beat === 'go'} />}
        </AnimatePresence>
      </div>

      <div className="flex min-h-28 flex-col items-center gap-3 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={beat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="max-w-64 text-xl font-black tracking-wide"
          >
            {caption}
          </motion.p>
        </AnimatePresence>

        {beat === 'interests' && (
          <ul className="flex flex-wrap justify-center gap-2">
            {interestLabels.map((label, index) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4 + index * 0.45,
                  type: 'spring',
                  stiffness: 380,
                  damping: 16,
                }}
                className="rounded-full bg-accent-pink px-3 py-1 text-sm font-bold text-white shadow-lg"
              >
                ❤ {label}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Beat 1: a beating heart with radar-like rings — "the AI found someone". */
function MatchFoundHeart() {
  return (
    <motion.div
      className="relative flex h-40 w-40 items-center justify-center"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-accent-pink" />
      <span
        className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-accent-pink"
        style={{ animationDelay: '1.2s' }}
      />
      <span className="flex h-28 w-28 animate-heartbeat items-center justify-center rounded-full bg-linear-to-br from-accent-pink to-brand-400 text-6xl shadow-2xl">
        ❤
      </span>
    </motion.div>
  );
}

/** Beats 2–3: THE ONE's card — glowing, blurred beyond recognition, never actually shown. */
function MysteryCard() {
  return (
    <motion.div
      className="relative h-56 w-40 overflow-hidden rounded-card shadow-2xl ring-4 ring-accent-pink"
      initial={{ opacity: 0, scale: 0.6, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <TheOneFace />
    </motion.div>
  );
}

const DECK_SIZE = 5;

/**
 * Beats 4–5: THE ONE's card lifts off, slips to the back of the deck, and the deck shuffles —
 * the promise that they're "somewhere in there".
 */
function ShuffledDeck({ settle }: { settle: boolean }) {
  return (
    <motion.div
      className={`relative h-56 w-40 ${settle ? 'animate-float' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: DECK_SIZE }, (_, index) => {
        const offset = (index - (DECK_SIZE - 1) / 2) * 6;
        const shuffleDirection = index % 2 === 0 ? 1 : -1;
        return (
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center rounded-card border-2 border-white/30 bg-linear-to-br from-brand-500 to-brand-800 text-4xl shadow-xl"
            style={{ zIndex: index + 1 }}
            initial={{ x: offset, rotate: offset / 2 }}
            animate={{
              x: [offset, offset + shuffleDirection * 70, offset],
              rotate: [offset / 2, shuffleDirection * 10, offset / 2],
            }}
            transition={{ delay: 1.2 + index * 0.08, duration: 0.6, ease: 'easeInOut' }}
          >
            ❤
          </motion.div>
        );
      })}

      {/* THE ONE starts on top, lifts away and drops in behind the deck. */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-card ring-4 ring-accent-pink"
        initial={{ x: 0, y: 0, rotate: 0, zIndex: DECK_SIZE + 1 }}
        animate={{
          x: [0, 110, 110, 0],
          y: [0, -30, -30, -4],
          rotate: [0, 14, 14, -4],
          zIndex: [DECK_SIZE + 1, DECK_SIZE + 1, 0, 0],
        }}
        transition={{ duration: 1.1, times: [0, 0.45, 0.55, 1], ease: 'easeInOut' }}
      >
        <TheOneFace />
      </motion.div>
    </motion.div>
  );
}

const SPARKLES = [
  { top: '8%', left: '12%', delay: '0s' },
  { top: '18%', left: '82%', delay: '0.6s' },
  { top: '62%', left: '8%', delay: '1.1s' },
  { top: '76%', left: '86%', delay: '0.3s' },
  { top: '40%', left: '92%', delay: '1.4s' },
];

function Sparkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SPARKLES.map(({ top, left, delay }) => (
        <span
          key={`${top}-${left}`}
          className="absolute animate-twinkle text-accent-yellow"
          style={{ top, left, animationDelay: delay }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
