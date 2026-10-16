/**
 * Game logo (team artwork, includes the alien-on-a-phone illustration).
 * Source: `public/logo.webp` — replace that file to update the logo everywhere.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <h1 className={`select-none ${className}`}>
      <img
        src="/logo.webp"
        alt="Gotta Match 'Em All"
        width={840}
        height={476}
        draggable={false}
        className="mx-auto h-auto w-full"
      />
    </h1>
  );
}
