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
      <EndingRevealAnimation
        player={player}
        summary={summary}
        onComplete={() => setIsRevealDone(true)}
        footer={
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
        }
      />
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

  // Styled as the last page of the founder's pitch: same backstage look as the reveal.
  return (
    <div className="h-full bg-ink text-white">
      <Screen
        footer={
          <Button
            fullWidth
            variant="ghost"
            className="bg-white shadow-lg shadow-black/30 hover:bg-brand-50"
            onClick={onRestart}
          >
            Play again
          </Button>
        }
      >
        <header className="flex items-center justify-between gap-4">
          <img
            src="/logo.webp"
            alt="Gotta Match 'Em All"
            width={840}
            height={476}
            draggable={false}
            className="h-auto w-24 select-none opacity-90"
          />
          <p className="text-right text-[10px] font-semibold tracking-[0.22em] text-white/55 uppercase">
            {GAME_CONTENT.ending.letterhead}
          </p>
        </header>

        <p className="mt-8 text-xs font-semibold tracking-widest text-white/55 uppercase">
          Your session
        </p>
        <h2 className="mt-1 font-display text-3xl font-black">Nice swiping, {player.name}!</h2>

        <div className="mt-6 rounded-card bg-accent-pink px-5 py-5 text-white shadow-lg shadow-black/40">
          <p className="text-xs font-semibold tracking-widest text-white/80 uppercase">
            Final score
          </p>
          <p className="mt-1 font-display text-5xl font-black tabular-nums">{summary.finalScore}</p>
        </div>

        <dl className="mt-4 mb-4 divide-y divide-white/10 overflow-hidden rounded-card bg-white/6 ring-1 ring-white/10">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <dt className="text-white/70">{label}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </Screen>
    </div>
  );
}
