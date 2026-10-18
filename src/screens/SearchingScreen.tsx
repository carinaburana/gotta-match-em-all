import { SearchingAnimation } from '@/components/animations/SearchingAnimation';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { PlayerProfile } from '@/types/game';
import { fillTemplate } from '@/utils/format';

interface SearchingScreenProps {
  player: PlayerProfile;
  onComplete: () => void;
}

/**
 * The fake "AI matchmaking" moment. The tap at the end is intentional: it gives the player a
 * breath before the teaser, and a user gesture in case sound is added later.
 */
export function SearchingScreen({ player, onComplete }: SearchingScreenProps) {
  const { title, subtitle, steps } = GAME_CONTENT.searching;

  return (
    <Screen className="pb-6">
      <SearchingAnimation
        title={title}
        subtitle={subtitle}
        steps={steps.map((step) => fillTemplate(step, { name: player.name }))}
        durationMs={GAME_CONFIG.searching.durationMs}
        renderAction={(isComplete) => (
          <Button fullWidth disabled={!isComplete} onClick={onComplete}>
            {isComplete ? 'Show me!' : 'Analyzing…'}
          </Button>
        )}
      />
    </Screen>
  );
}
