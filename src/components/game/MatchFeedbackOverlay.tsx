import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { feedbackVariants, matchFeedbackVariants } from '@/components/animations/variants';
import { PORTRAIT_AREA_CLASS } from '@/components/cards/cardLayout';
import { GAME_CONFIG } from '@/game/config';
import type { SwipeEvent, SwipeOutcome } from '@/types/game';

interface FeedbackStyle {
  title: string;
  className: string;
}

const NOTIFICATION_CLASS =
  'rounded-2xl px-4 py-2 text-center text-sm font-bold whitespace-nowrap shadow-xl';

/**
 * PLACEHOLDER feedback visuals. Replace the content per outcome with the final reward
 * animations (+10, +100, −100) later — the trigger logic below can stay as it is.
 */
function getFeedbackStyle(outcome: SwipeOutcome): FeedbackStyle | null {
  if (outcome.type === 'liked-no-match') {
    return null;
    // previous no-match hint, hidden for now
    // return { title: 'No match… keep swiping!', className: 'bg-white/90 text-ink-muted' };
  }
  if (outcome.type !== 'match') return null;
  switch (outcome.category) {
    case 'normal':
      return { title: "It's a match! +10", className: 'bg-like text-white' };
    case 'special':
      return { title: 'SUPER MATCH! +100', className: 'bg-reward text-brand-900' };
    case 'negative':
      return { title: 'Unverified! −100', className: 'bg-nope text-white' };
  }
}

/**
 * Shows a short overlay after each swipe. Purely visual — it never changes the score.
 * Render it inside the card area: it sits at the bottom of the portrait so it never covers the
 * name or the verification badge (which players need to judge the next card).
 */
export function MatchFeedbackOverlay({ lastSwipe }: { lastSwipe: SwipeEvent | null }) {
  const [visibleEventId, setVisibleEventId] = useState<number | null>(null);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (!lastSwipe) return;
    setVisibleEventId(lastSwipe.eventId);
    const timeoutId = window.setTimeout(
      () => setVisibleEventId((current) => (current === lastSwipe.eventId ? null : current)),
      GAME_CONFIG.feedback.overlayDurationMs,
    );
    return () => window.clearTimeout(timeoutId);
  }, [lastSwipe]);

  useEffect(() => {
    let reminderHideTimeoutId: number | undefined;
    const reminderTimeoutId = window.setTimeout(() => {
      setShowReminder(true);
      reminderHideTimeoutId = window.setTimeout(
        () => setShowReminder(false),
        GAME_CONFIG.feedback.reminderDurationMs,
      );
    }, GAME_CONFIG.feedback.reminderDelayMs);

    return () => {
      window.clearTimeout(reminderTimeoutId);
      if (reminderHideTimeoutId !== undefined) window.clearTimeout(reminderHideTimeoutId);
    };
  }, []);

  const style =
    lastSwipe && visibleEventId === lastSwipe.eventId ? getFeedbackStyle(lastSwipe.outcome) : null;

  // A one-cell grid stacks the entering overlay on top of one that is still fading out.
  // (In a flex row they would sit side by side, squeezing and off-centring the new one.)
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 grid items-end justify-items-center px-4 pb-4 ${PORTRAIT_AREA_CLASS}`}
      aria-live="polite"
    >
      <AnimatePresence>
        {showReminder && (
          <motion.p
            key="engagement-reminder"
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`absolute bottom-4 ${NOTIFICATION_CLASS} bg-white text-brand-700`}
          >
            Hurry, you need to find your No. 1
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {style && lastSwipe && (
          <motion.div
            key={lastSwipe.eventId}
            variants={matchFeedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`col-start-1 row-start-1 ${NOTIFICATION_CLASS} ${style.className}`}
          >
            {style.title}
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
          className="absolute inset-0 z-40 flex items-center justify-center bg-brand-900/60 "
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
