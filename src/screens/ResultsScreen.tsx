import { useState } from 'react';

import { EndingRevealAnimation } from '@/components/animations/EndingRevealAnimation';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { GAME_CONFIG } from '@/game/config';
import type { PlayerProfile, SessionSummary } from '@/types/game';
import { formatDurationSeconds } from '@/utils/format';

interface ResultsScreenProps {
  player: PlayerProfile;
  summary: SessionSummary;
  onRestart: () => void;
}

/**
 * The ending: first the "leaked investor update" reveal (if `ending.showReveal`), then the
 * session stats. Everything needed is in `summary`, so this screen can be redesigned freely
 * without touching the game engine.
 */
export function ResultsScreen({ player, summary, onRestart }: ResultsScreenProps) {
  const [showReveal, setShowReveal] = useState(GAME_CONFIG.ending.showReveal);
  const [isRevealDone, setIsRevealDone] = useState(false);

  if (showReveal) {
    return (
      <div className="flex h-full flex-col bg-brand-900">
        <div className="min-h-0 flex-1">
          <EndingRevealAnimation
            playerName={player.name}
            summary={summary}
            onComplete={() => setIsRevealDone(true)}
          />
        </div>
        <div className="pb-safe shrink-0 px-6 pt-3">
          <Button
            fullWidth
            variant={isRevealDone ? 'primary' : 'secondary'}
            onClick={() => setShowReveal(false)}
          >
            {isRevealDone ? 'See your stats' : 'Skip'}
          </Button>
        </div>
      </div>
    );
  }

  const rows: [label: string, value: string | number][] = [
    ['Final score', summary.finalScore],
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
      <p className="mt-4 text-xs font-semibold tracking-widest text-ink-muted uppercase">Results</p>
      <h2 className="mt-1 text-3xl font-bold">Nice swiping, {player.name}!</h2>

      <dl className="mt-6 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-sm">
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
