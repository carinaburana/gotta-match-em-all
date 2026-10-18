import { useEffect, useRef, useState } from 'react';

import { TheOneTeaserAnimation } from '@/components/animations/TheOneTeaserAnimation';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { PlayIcon } from '@/components/ui/icons';
import { GAME_CONFIG } from '@/game/config';
import type { PlayerProfile } from '@/types/game';

type TeaserStatus = 'loading' | 'playing' | 'needs-tap' | 'ended' | 'animating';

interface TheOneTeaserScreenProps {
  player: PlayerProfile;
  onContinue: () => void;
}

/**
 * Introduces THE ONE as the player's "perfect match". This is a narrative promise only —
 * THE ONE is never a candidate in the deck.
 *
 * Shows the animated teaser by default. If `GAME_CONFIG.teaser.videoSrc` is set, plays that video
 * instead — and falls back to the animation if the file is missing or broken.
 */
export function TheOneTeaserScreen({ player, onContinue }: TheOneTeaserScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoSrc, posterSrc } = GAME_CONFIG.teaser;
  const [status, setStatus] = useState<TeaserStatus>(videoSrc ? 'loading' : 'animating');
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setStatus((current) => (current === 'animating' ? current : 'playing')),
      () => setStatus((current) => (current === 'animating' ? current : 'needs-tap')),
    );
  }, []);

  const isAnimating = status === 'animating';
  const canContinue = status === 'ended' || (isAnimating && isAnimationDone);

  return (
    <Screen
      footer={
        <Button fullWidth onClick={onContinue} variant={canContinue ? 'primary' : 'secondary'}>
          {canContinue ? 'Start swiping' : 'Skip'}
        </Button>
      }
    >
      <h2 className="text-center text-2xl font-bold text-brand-700">Meet THE ONE</h2>
      <p className="mt-1 text-center text-sm text-ink-muted">
        Our AI found your perfect match. Now go find them!
      </p>

      <div className="relative mt-6 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-card bg-brand-900">
        {isAnimating || !videoSrc ? (
          <TheOneTeaserAnimation
            playerName={player.name}
            interestIds={player.interestIds}
            onComplete={() => setIsAnimationDone(true)}
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc ?? undefined}
            className="h-full w-full object-cover"
            playsInline
            preload="auto"
            onEnded={() => setStatus('ended')}
            onError={() => setStatus('animating')}
          />
        )}

        {status === 'needs-tap' && (
          <button
            type="button"
            aria-label="Play teaser video"
            onClick={() => {
              void videoRef.current?.play().then(() => setStatus('playing'));
            }}
            className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-xl"
          >
            <PlayIcon className="ml-1 h-10 w-10" />
          </button>
        )}
      </div>
    </Screen>
  );
}
