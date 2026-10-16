import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <Screen
      footer={
        <Button fullWidth onClick={onStart}>
          Start
        </Button>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
        <Logo />
        {/* PLACEHOLDER illustration area — replace with the final start-screen artwork. */}
        <div
          aria-hidden
          className="flex h-40 w-32 animate-float items-center justify-center rounded-3xl border-4 border-brand-800 bg-brand-100 text-6xl shadow-lg [--float-rotate:-6deg]"
        >
          👽
        </div>
        <p className="max-w-64 text-ink-muted">
          Start matching to find “The One” before the time runs out!
        </p>
      </div>
    </Screen>
  );
}
