import { useState } from 'react';

import { TheOneTeaserAnimation } from '@/components/animations/TheOneTeaserAnimation';
import { Button } from '@/components/ui/Button';
import type { PlayerProfile } from '@/types/game';

interface TheOneTeaserScreenProps {
  player: PlayerProfile;
  onContinue: () => void;
}

/**
 * Introduces THE ONE as the player's "perfect match" with the animated teaser. This is a
 * narrative promise only — THE ONE is never a candidate in the deck.
 */
export function TheOneTeaserScreen({ player, onContinue }: TheOneTeaserScreenProps) {
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  return (
    <TheOneTeaserAnimation
      playerName={player.name}
      interestIds={player.interestIds}
      onComplete={() => setIsAnimationDone(true)}
      footer={
        <Button
          fullWidth
          onClick={onContinue}
          variant={isAnimationDone ? 'primary' : 'ghost'}
          className={isAnimationDone ? '' : 'text-ink-muted'}
        >
          {isAnimationDone ? 'Continue' : 'Skip'}
        </Button>
      }
    />
  );
}
