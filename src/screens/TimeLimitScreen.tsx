import { motion } from 'motion/react';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/layout/Screen';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { PlayerProfile } from '@/types/game';
import { fillTemplate, formatCountdown, formatDurationWords } from '@/utils/format';

interface TimeLimitScreenProps {
  player: PlayerProfile;
  onStart: () => void;
}

/**
 * Announces the time limit between the teaser and the game. The app frames the pressure as a
 * favour ("your time is valuable"). The timer doesn't run here: it only starts once the player
 * taps the button and the game screen mounts, so nobody loses seconds while reading.
 */
export function TimeLimitScreen({ player, onStart }: TimeLimitScreenProps) {
  const { message, countdownLabel, button } = GAME_CONTENT.timeLimit;
  const durationMs = GAME_CONFIG.sessionDurationMs;

  return (
    <Screen
      className="items-center justify-center text-center"
      footer={
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.6 }}
        >
          <Button fullWidth onClick={onStart}>
            {button}
          </Button>
        </motion.div>
      }
    >
      <motion.p
        className="max-w-72 font-display text-[1.45rem] leading-snug font-black text-balance text-ink"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {fillTemplate(message, {
          name: player.name,
          duration: formatDurationWords(durationMs),
        })}
      </motion.p>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.9 }}
      >
        <p className="text-sm font-semibold tracking-[0.3em] text-ink-muted uppercase">
          {countdownLabel}
        </p>
        <p className="font-mono text-7xl font-bold text-brand-600 tabular-nums">
          {formatCountdown(durationMs)}
        </p>
      </motion.div>
    </Screen>
  );
}
