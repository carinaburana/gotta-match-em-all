/**
 * PLACEHOLDER logo built from text. Replace with the final logo image when it exists
 * (e.g. put it in public/ and render an <img>), keeping the same component name.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative select-none text-center ${className}`}>
      <span aria-hidden className="absolute -top-3 -left-1 text-3xl text-accent-pink">
        ♥
      </span>
      <span aria-hidden className="absolute -top-2 right-0 text-2xl text-accent-yellow">
        ✦
      </span>
      <h1 className="font-display leading-[0.95] tracking-tight">
        <span className="block text-5xl text-accent-yellow [-webkit-text-stroke:2px_var(--color-brand-800)]">
          Gotta
        </span>
        <span className="block text-[2.6rem] text-brand-800">Match ’Em All</span>
      </h1>
    </div>
  );
}
