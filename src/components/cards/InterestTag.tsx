interface InterestTagProps {
  label: string;
  /** Shared with the player → highlighted. */
  isShared?: boolean;
}

export function InterestTag({ label, isShared = false }: InterestTagProps) {
  return (
    <li
      className={[
        'rounded-full border px-3 py-1 text-sm font-medium',
        isShared
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-line bg-surface text-ink-muted',
      ].join(' ')}
    >
      {label}
      {isShared && <span className="sr-only"> (shared interest)</span>}
    </li>
  );
}
