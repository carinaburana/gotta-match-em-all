import { AlienImage } from '@/components/cards/AlienImage';
import { GAME_CONFIG } from '@/game/config';

/**
 * THE ONE's card face: blurred beyond recognition with a "?" — teased, never actually shown.
 * Fills its container; the container decides size and shape.
 */
export function TheOneFace() {
  return (
    <>
      <AlienImage
        src={GAME_CONFIG.teaser.animation.theOnePortraitSrc}
        alt="A blurred silhouette of THE ONE"
        className="scale-125 blur-xl saturate-150"
      />
      <span className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/90 drop-shadow-lg">
        ?
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-brand-900/70 py-1.5 text-center text-sm font-black tracking-widest text-white">
        THE ONE
      </span>
    </>
  );
}
