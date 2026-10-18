import { GAME_CONFIG } from '@/game/config';

/**
 * The founder who gives the "investor pitch" in the ending reveal.
 *
 * Shows `GAME_CONFIG.ending.founderPortraitSrc` when the team has artwork. Until then it draws a
 * spotlit silhouette: an alien in a turtleneck and jacket, lit round glasses, a sly grin and an
 * open hand presenting "the product" — deliberately "identity withheld" rather than a placeholder.
 * Fills its container and sits on its bottom edge; the container should be about 10:13.
 */
export function FounderFigure({ className = '' }: { className?: string }) {
  const src = GAME_CONFIG.ending.founderPortraitSrc;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className={`h-full w-full object-contain object-bottom select-none drop-shadow-[0_24px_32px_rgba(0,0,0,0.6)] ${className}`}
      />
    );
  }

  return <FounderSilhouette className={className} />;
}

const PINK = 'var(--color-accent-pink)';
const TEAL = 'var(--color-accent-teal)';
/** Silhouette tones — artwork colours, like the radar illustration. */
const SHADOW = '#120c20';
const SHADOW_SOFT = '#231a3d';

/** PLACEHOLDER until founder artwork exists — but designed to look intentional. */
function FounderSilhouette({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      preserveAspectRatio="xMidYMax meet"
      className={`h-full w-full ${className}`}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Rim light: pink spill from the spotlight on the figure's right edge. */}
        <linearGradient id="founder-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PINK} stopOpacity="0" />
          <stop offset="0.6" stopColor={PINK} stopOpacity="0.1" />
          <stop offset="1" stopColor={PINK} stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="founder-lens" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.7" />
          <stop offset="0.6" stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="founder-bulb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.55" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Antennae with glowing tips — the one alien feature the silhouette keeps. */}
      <g fill="none" stroke={SHADOW} strokeWidth="5" strokeLinecap="round">
        <path d="M86 40 C 78 28, 68 18, 56 10" />
        <path d="M114 40 C 122 28, 132 18, 144 10" />
      </g>
      <circle cx="54" cy="9" r="13" fill="url(#founder-bulb)" />
      <circle cx="146" cy="9" r="13" fill="url(#founder-bulb)" />
      <circle cx="54" cy="9" r="4.5" fill={TEAL} />
      <circle cx="146" cy="9" r="4.5" fill={TEAL} />

      {/* Jacket, turtleneck, pocket square. */}
      <path
        d="M12 262 C 12 214, 44 186, 84 178 L 100 188 L 116 178 C 156 186, 188 214, 188 262 Z"
        fill={SHADOW}
      />
      <path
        d="M116 178 C 156 186, 188 214, 188 262"
        fill="none"
        stroke="url(#founder-rim)"
        strokeWidth="2.5"
      />
      <path d="M84 178 C 90 164, 110 164, 116 178 L 108 198 L 92 198 Z" fill={SHADOW_SOFT} />
      <path
        d="M84 178 L 100 204 L 116 178"
        fill="none"
        stroke={SHADOW_SOFT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M146 226 L 160 219 L 157 233 Z" fill={PINK} opacity="0.9" />

      {/* Presenting hand: forearm from the right shoulder, palm open, three fingers. */}
      <path
        d="M160 212 C 176 200, 186 180, 180 160"
        fill="none"
        stroke={SHADOW}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <ellipse cx="178" cy="150" rx="14" ry="11" fill={SHADOW} />
      <g fill="none" stroke={SHADOW} strokeWidth="7" strokeLinecap="round">
        <path d="M169 144 L 160 131" />
        <path d="M178 141 L 178 125" />
        <path d="M187 144 L 195 132" />
      </g>
      <path
        d="M184 158 C 190 176, 184 192, 172 204"
        fill="none"
        stroke={PINK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Neck and head: big cranium, narrow chin. */}
      <rect x="90" y="150" width="20" height="34" fill={SHADOW} />
      <path
        d="M100 32 C 134 32, 152 58, 152 90 C 152 118, 134 150, 100 156 C 66 150, 48 118, 48 90 C 48 58, 66 32, 100 32 Z"
        fill={SHADOW}
      />
      <path
        d="M100 32 C 134 32, 152 58, 152 90 C 152 118, 134 150, 100 156"
        fill="none"
        stroke="url(#founder-rim)"
        strokeWidth="2.5"
      />

      {/* Glasses — the only lit part of the face, with a glint from the spotlight. */}
      <circle cx="79" cy="96" r="14" fill="url(#founder-lens)" />
      <circle cx="121" cy="96" r="14" fill="url(#founder-lens)" />
      <g fill="none" stroke="#e9e4f5" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="79" cy="96" r="14" />
        <circle cx="121" cy="96" r="14" />
        <path d="M93 95 Q 100 90, 107 95" />
        <path d="M65 93 L 57 91" />
        <path d="M135 93 L 143 91" />
      </g>
      <g fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
        <path d="M70 88 a 11 11 0 0 1 8 -5" />
        <path d="M112 88 a 11 11 0 0 1 8 -5" />
      </g>

      {/* A sly grin, lit from below. */}
      <path
        d="M80 126 Q 100 145, 121 124"
        fill="none"
        stroke={PINK}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M85 129 Q 100 139, 116 127"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
