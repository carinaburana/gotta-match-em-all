import { useEffect, useRef, useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { PlayIcon } from '@/components/ui/icons';
import { GAME_CONFIG } from '@/game/config';

type VideoStatus = 'loading' | 'playing' | 'needs-tap' | 'ended' | 'unavailable';

interface TheOneTeaserScreenProps {
  onContinue: () => void;
}

/**
 * Introduces THE ONE as the player's "perfect match". This is a narrative promise only —
 * THE ONE is never a candidate in the deck.
 *
 * Plays `GAME_CONFIG.teaser.videoSrc` if the file exists, otherwise shows a placeholder.
 */
export function TheOneTeaserScreen({ onContinue }: TheOneTeaserScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<VideoStatus>('loading');
  const { videoSrc, posterSrc } = GAME_CONFIG.teaser;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setStatus((current) => (current === 'unavailable' ? current : 'playing')),
      () => setStatus((current) => (current === 'unavailable' ? current : 'needs-tap')),
    );
  }, []);

  const isUnavailable = status === 'unavailable';
  const canContinue = status === 'ended' || isUnavailable;

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
        {isUnavailable ? (
          <TeaserPlaceholder />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc ?? undefined}
            className="h-full w-full object-cover"
            playsInline
            preload="auto"
            onEnded={() => setStatus('ended')}
            onError={() => setStatus('unavailable')}
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

/** PLACEHOLDER shown until public/videos/the-one-teaser.mp4 exists. */
function TeaserPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center text-white">
      <div className="flex h-36 w-36 animate-float items-center justify-center rounded-full bg-linear-to-br from-accent-pink to-brand-400 text-6xl shadow-2xl">
        ❤
      </div>
      <p className="text-3xl font-black tracking-wide">THE ONE</p>
      <p className="max-w-56 text-sm text-white/70">
        Teaser video placeholder. Add <code>public/videos/the-one-teaser.mp4</code> to replace it.
      </p>
    </div>
  );
}
