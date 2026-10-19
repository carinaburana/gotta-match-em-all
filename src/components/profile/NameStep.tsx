import { GAME_CONFIG } from '@/game/config';

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function NameStep({ value, onChange, onSubmit }: NameStepProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="player-name" className="block text-3xl font-bold">
        What’s your name?
      </label>
      <input
        id="player-name"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={GAME_CONFIG.profile.maxNameLength}
        placeholder="Enter your first name"
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="next"
        autoFocus
        className="mt-8 w-full border-b-2 border-line bg-transparent py-2 text-lg outline-none placeholder:text-ink-muted/60 focus:border-brand-500"
        aria-describedby="player-name-hint"
      />
      <p id="player-name-hint" className="mt-2 text-sm text-ink-muted">
        Your name will be visible in your profile.
      </p>
    </form>
  );
}
