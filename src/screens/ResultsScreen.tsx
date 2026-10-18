import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { EndingRevealAnimation } from '@/components/animations/EndingRevealAnimation';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { PlayerProfile, SessionSummary } from '@/types/game';
import { formatDurationSeconds } from '@/utils/format';

interface ResultsScreenProps {
  player: PlayerProfile;
  summary: SessionSummary;
  onRestart: () => void;
}

/**
 * After the game: first the ending reveal (the company's side of the session — see
 * `EndingRevealAnimation`), then the plain stats. `GAME_CONFIG.ending.showReveal = false` skips
 * straight to the stats for an in-person debrief.
 */
export function ResultsScreen({ player, summary, onRestart }: ResultsScreenProps) {
  const [stage, setStage] = useState<'reveal' | 'stats'>(
    GAME_CONFIG.ending.showReveal ? 'reveal' : 'stats',
  );
  const [isRevealDone, setIsRevealDone] = useState(false);
  const { buttons } = GAME_CONTENT.ending;

  if (stage === 'reveal') {
    return (
      <div className="flex h-full flex-col bg-ink">
        <div className="min-h-0 flex-1">
          <EndingRevealAnimation
            player={player}
            summary={summary}
            onComplete={() => setIsRevealDone(true)}
          />
        </div>
        <div className="pb-safe shrink-0 px-6 pt-1">
          <AnimatePresence mode="wait" initial={false}>
            {isRevealDone ? (
              <motion.div
                key="continue"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Button
                  fullWidth
                  variant="ghost"
                  className="bg-white shadow-lg shadow-black/30 hover:bg-brand-50"
                  onClick={() => setStage('stats')}
                >
                  {buttons.continue}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="skip" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                <button
                  type="button"
                  onClick={() => setStage('stats')}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-semibold text-white/45 transition-colors hover:text-white/80"
                >
                  {buttons.skip}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const rows: [label: string, value: string | number][] = [
    ['Cards viewed', summary.cardsViewed],
    ['Right swipes', summary.rightSwipes],
    ['Left swipes', summary.leftSwipes],
    ['Matches (+10)', summary.normalMatches],
    ['Special matches (+100)', summary.specialMatches],
    ['Unverified matches (−100)', summary.negativeMatches],
    ['Session duration', formatDurationSeconds(summary.sessionDurationMs)],
  ];

  return (
    <Screen
      footer={
        <Button fullWidth onClick={onRestart}>
          Play again
        </Button>
      }
    >
      <p className="mt-4 text-xs font-semibold tracking-widest text-ink-muted uppercase">
        Your session
      </p>
      <h2 className="mt-1 text-3xl font-bold">Nice swiping, {player.name}!</h2>

      <div className="mt-6 rounded-card bg-brand-600 px-5 py-5 text-white shadow-lg shadow-brand-900/20">
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">Final score</p>
        <p className="mt-1 font-display text-5xl font-black tabular-nums">{summary.finalScore}</p>
      </div>

      <dl className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <dt className="text-ink-muted">{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}
