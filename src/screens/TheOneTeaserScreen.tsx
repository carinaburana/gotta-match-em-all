import { motion } from 'motion/react';
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
        // No skip: testers have to sit through the promise. The hidden button keeps the footer
        // height so the stage doesn't jump when it appears.
        <motion.div
          className={isAnimationDone ? '' : 'invisible'}
          initial={false}
          animate={isAnimationDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
        >
          <Button fullWidth onClick={onContinue}>
            Continue
          </Button>
        </motion.div>
      }
    />
  );
}
