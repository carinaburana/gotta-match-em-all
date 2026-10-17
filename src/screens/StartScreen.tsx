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
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <Logo className="w-full max-w-80" />
        <p className="max-w-64 text-ink-muted">
          Start matching to find “The One” before the time runs out!
        </p>
      </div>
    </Screen>
  );
}
