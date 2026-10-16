import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { feedbackVariants } from '@/components/animations/variants';
import { PORTRAIT_AREA_CLASS } from '@/components/cards/cardLayout';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { SwipeEvent } from '@/types/game';
import { fillTemplate, formatPoints } from '@/utils/format';

interface FeedbackStyle {
  title: string;
  className: string;
}

const { noMatch: NO_MATCH_MESSAGES, theOneTeasers: THE_ONE_TEASERS } =
  GAME_CONTENT.algorithmMessages;

/** Cycles through a message list by swipe number — deterministic, no randomness needed. */
function pickMessage(messages: readonly string[], index: number): string {
  return messages[index % messages.length] ?? '';
}

/**
 * PLACEHOLDER feedback visuals. Replace the content per outcome with the final reward
 * animations (+10, +100, −100) later — the trigger logic below can stay as it is.
 */
function getFeedbackStyle({ outcome, eventId }: SwipeEvent): FeedbackStyle | null {
  if (outcome.type === 'liked-no-match') {
    const template = pickMessage(NO_MATCH_MESSAGES, eventId);
    return {
      title: fillTemplate(template, { points: formatPoints(outcome.points) }),
      className: 'bg-white/95 text-nope text-base',
    };
  }
  if (outcome.type !== 'match') return null;
  switch (outcome.category) {
    case 'normal':
      return { title: "It's a match! +10", className: 'bg-like text-white text-2xl' };
    case 'special':
      return { title: 'SUPER MATCH! +100', className: 'bg-reward text-brand-900 text-3xl' };
    case 'negative':
      return { title: 'Unverified! −100', className: 'bg-nope text-white text-2xl' };
  }
}

/** Every few swipes the app dangles THE ONE to keep the player going. THE ONE never comes. */
function getTheOneTeaser(eventId: number): string | null {
  const every = GAME_CONFIG.feedback.theOneTeaserEverySwipes;
  if (eventId % every !== 0) return null;
  return pickMessage(THE_ONE_TEASERS, eventId / every - 1);
}

/**
 * Shows a short overlay after each swipe. Purely visual — it never changes the score.
 * Render it inside the card area: it sits at the bottom of the portrait so it never covers the
 * name or the verification badge (which players need to judge the next card).
 */
export function MatchFeedbackOverlay({ lastSwipe }: { lastSwipe: SwipeEvent | null }) {
  const [visibleEventId, setVisibleEventId] = useState<number | null>(null);

  useEffect(() => {
    if (!lastSwipe) return;
    setVisibleEventId(lastSwipe.eventId);
    const durationMs =
      getTheOneTeaser(lastSwipe.eventId) === null
        ? GAME_CONFIG.feedback.overlayDurationMs
        : GAME_CONFIG.feedback.teaserOverlayDurationMs;
    const timeoutId = window.setTimeout(
      () => setVisibleEventId((current) => (current === lastSwipe.eventId ? null : current)),
      durationMs,
    );
    return () => window.clearTimeout(timeoutId);
  }, [lastSwipe]);

  const isVisible = lastSwipe !== null && visibleEventId === lastSwipe.eventId;
  const style = isVisible ? getFeedbackStyle(lastSwipe) : null;
  const teaser = isVisible ? getTheOneTeaser(lastSwipe.eventId) : null;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-end justify-center px-4 pb-4 ${PORTRAIT_AREA_CLASS}`}
      aria-live="polite"
    >
      <AnimatePresence>
        {lastSwipe && (style || teaser) && (
          <motion.div
            key={lastSwipe.eventId}
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-2"
          >
            {teaser && (
              <p className="rounded-2xl bg-brand-700 px-4 py-2 text-center text-sm font-bold text-white shadow-xl">
                {teaser}
              </p>
            )}
            {style && (
              <p
                className={`rounded-3xl px-6 py-4 text-center font-black shadow-xl ${style.className}`}
              >
                {style.title}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Shown when the session ends, right before the results screen opens. */
export function TimeUpOverlay({ show, label }: { show: boolean; label: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-brand-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="status"
        >
          <motion.p
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            className="rounded-3xl bg-surface px-8 py-5 text-3xl font-black text-brand-700 shadow-xl"
          >
            {label}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
