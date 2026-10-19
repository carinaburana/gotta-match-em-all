import { AnimatePresence, MotionConfig } from 'motion/react';
import { useState } from 'react';

import { ScreenTransition } from '@/components/animations/ScreenTransition';
import { AppShell } from '@/components/layout/AppShell';
import { readDevJumpFromUrl } from '@/dev/devJump';
import { DevJumpMenu } from '@/dev/DevJumpMenu';
import { GameScreen } from '@/screens/GameScreen';
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { StartScreen } from '@/screens/StartScreen';
import { TheOneTeaserScreen } from '@/screens/TheOneTeaserScreen';
import { TimeLimitScreen } from '@/screens/TimeLimitScreen';
import type { AppState } from '@/types/app';

/**
 * Owns the application flow:
 * start → profile-setup → teaser → time-limit → playing → results
 * Every transition is a call to setAppState in this file, so the flow is easy to follow.
 */
export function App() {
  const [appState, setAppState] = useState<AppState>(
    () => (import.meta.env.DEV ? readDevJumpFromUrl() : null) ?? { phase: 'start' },
  );
  // Dev jumps can land on the phase that's already showing; bumping the key remounts it.
  const [devJumpCount, setDevJumpCount] = useState(0);

  function renderScreen(state: AppState) {
    switch (state.phase) {
      case 'start':
        return <StartScreen onStart={() => setAppState({ phase: 'profile-setup' })} />;

      case 'profile-setup':
        return (
          <ProfileSetupScreen
            onExit={() => setAppState({ phase: 'start' })}
            onComplete={(player) => setAppState({ phase: 'teaser', player })}
          />
        );

      case 'teaser':
        return (
          <TheOneTeaserScreen
            player={state.player}
            onContinue={() => setAppState({ phase: 'time-limit', player: state.player })}
          />
        );

      case 'time-limit':
        return (
          <TimeLimitScreen
            player={state.player}
            onStart={() => setAppState({ phase: 'playing', player: state.player })}
          />
        );

      case 'playing':
        return (
          <GameScreen
            player={state.player}
            onFinished={(summary) =>
              setAppState({ phase: 'results', player: state.player, summary })
            }
          />
        );

      case 'results':
        return (
          <ResultsScreen
            player={state.player}
            summary={state.summary}
            onRestart={() => setAppState({ phase: 'start' })}
          />
        );
    }
  }

  return (
    // Respects the OS "reduce motion" setting for all Motion animations.
    <MotionConfig reducedMotion="user">
      <AppShell>
        <AnimatePresence mode="wait">
          <ScreenTransition key={`${appState.phase}-${devJumpCount}`}>
            {renderScreen(appState)}
          </ScreenTransition>
        </AnimatePresence>
      </AppShell>
      {import.meta.env.DEV && (
        <DevJumpMenu
          onJump={(state) => {
            setAppState(state);
            setDevJumpCount((count) => count + 1);
          }}
        />
      )}
    </MotionConfig>
  );
}
