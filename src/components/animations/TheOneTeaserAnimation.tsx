import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import { DeckQueue } from '@/components/animations/DeckQueue';
import { StageBackdrop } from '@/components/animations/StageBackdrop';
import { TheOneFace } from '@/components/cards/TheOneFace';
import { StageLayout } from '@/components/layout/StageLayout';
import { HeartIcon } from '@/components/ui/icons';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import { useBeatSequence } from '@/hooks/useBeatSequence';
import type { InterestId } from '@/types/content';
import { fillTemplate } from '@/utils/format';

interface TheOneTeaserAnimationProps {
  playerName: string;
  /** The player's own interests — THE ONE "shares all of them", which is what makes it perfect. */
  interestIds: readonly InterestId[];
  /** Pinned action under the animation (Skip / Start swiping). */
  footer: ReactNode;
  /** Called once when the last beat is reached. */
  onComplete: () => void;
}

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * The teaser before the game: the bright, hopeful twin of the ending reveal, in the same frame
 * (StageLayout). A match is found, THE ONE's card rises into the light, their shared interests
 * pop up — and the card slips to the very back of the deck, "somewhere in there". Purely
 * narrative: THE ONE is never a candidate in the game.
 */
export function TheOneTeaserAnimation({
  playerName,
  interestIds,
  footer,
  onComplete,
}: TheOneTeaserAnimationProps) {
  const config = GAME_CONFIG.teaser.animation;
  const content = GAME_CONTENT.theOneTeaser;
  const beat = useBeatSequence(config.beatDurationsMs, 'go', onComplete);

  const values = { name: playerName };
  const interestLabels = interestIds.map((id) => GAME_CONTENT.interestsById.get(id)?.label ?? id);
  const queuePortraits = GAME_CONTENT.portraitSrcs.slice(0, config.queueVisibleCards);
  const hiddenCount = Math.max(0, GAME_CONFIG.deck.size - queuePortraits.length - 1);

  const showCard = beat === 'reveal' || beat === 'interests';
  const showQueue = beat === 'hide' || beat === 'go';

  return (
    <StageLayout
      tone="light"
      letterhead={fillTemplate(content.letterhead, values)}
      caption={{
        key: beat,
        text: fillTemplate(content[beat], values),
        emphasis: beat === 'go',
        delayS: beat === 'matchFound' ? 0.4 : 0,
      }}
      footer={footer}
      backdrop={<StageBackdrop tone="light" />}
    >
      <AnimatePresence>
        {beat === 'matchFound' && <MatchFoundHeart key="heart" />}

        {showCard && (
          <motion.div
            key="card"
            className="absolute inset-x-0 bottom-[11%] flex justify-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="h-56 w-40 overflow-hidden rounded-card ring-4 ring-accent-pink"
              initial={{ opacity: 0, scale: 0.6, rotateY: 90, y: -40 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                y: beat === 'reveal' ? -70 : -116,
                boxShadow: '0 24px 48px -12px rgba(255,95,162,0.55)',
              }}
              exit={{ scale: 0.75, y: -150, transition: { duration: 0.3 } }}
              transition={
                beat === 'reveal'
                  ? { type: 'spring', stiffness: 200, damping: 20 }
                  : { duration: 0.6, ease: EASE_OUT_SOFT }
              }
            >
              <TheOneFace />
            </motion.div>
          </motion.div>
        )}

        {beat === 'interests' && (
          <motion.ul
            key="interests"
            className="absolute inset-x-6 bottom-[11%] flex flex-wrap justify-center gap-2"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            {interestLabels.map((label, index) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.5 + index * 0.45,
                  type: 'spring',
                  stiffness: 380,
                  damping: 16,
                }}
                className="flex items-center gap-1.5 rounded-full bg-accent-pink px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-accent-pink/40"
              >
                <HeartIcon className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        )}

        {showQueue && (
          <DeckQueue
            key="queue"
            tone="light"
            portraitSrcs={queuePortraits}
            hiddenCount={hiddenCount}
            theOne={beat === 'hide' ? 'hide' : 'settled'}
          />
        )}
      </AnimatePresence>
    </StageLayout>
  );
}

/** Beat 1: a beating heart in radar-like rings — "the AI found someone". */
function MatchFoundHeart() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.35 } }}
    >
      <motion.div
        className="relative flex h-40 w-40 items-center justify-center"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 }}
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-accent-pink" />
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-accent-pink"
          style={{ animationDelay: '1.2s' }}
        />
        <span className="flex h-28 w-28 animate-heartbeat items-center justify-center rounded-full bg-linear-to-br from-accent-pink to-brand-400 text-white shadow-2xl shadow-accent-pink/50">
          <HeartIcon className="h-14 w-14" fill="currentColor" strokeWidth={0} />
        </span>
      </motion.div>
    </motion.div>
  );
}
