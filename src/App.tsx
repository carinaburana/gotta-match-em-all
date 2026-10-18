import { AnimatePresence, MotionConfig } from 'motion/react';
import { useState } from 'react';

import { ScreenTransition } from '@/components/animations/ScreenTransition';
import { AppShell } from '@/components/layout/AppShell';
import { GameScreen } from '@/screens/GameScreen';
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { SearchingScreen } from '@/screens/SearchingScreen';
import { StartScreen } from '@/screens/StartScreen';
import { TheOneTeaserScreen } from '@/screens/TheOneTeaserScreen';
import type { AppState } from '@/types/app';

/**
 * Owns the application flow:
 * start → profile-setup → searching → teaser → playing → results
 * Every transition is a call to setAppState in this file, so the flow is easy to follow.
 */
export function App() {
  const [appState, setAppState] = useState<AppState>({ phase: 'start' });

  function renderScreen(state: AppState) {
    switch (state.phase) {
      case 'start':
        return <StartScreen onStart={() => setAppState({ phase: 'profile-setup' })} />;

      case 'profile-setup':
        return (
          <ProfileSetupScreen
            onExit={() => setAppState({ phase: 'start' })}
            onComplete={(player) => setAppState({ phase: 'searching', player })}
          />
        );

      case 'searching':
        return (
          <SearchingScreen
            player={state.player}
            onComplete={() => setAppState({ phase: 'teaser', player: state.player })}
          />
        );

      case 'teaser':
        return (
          <TheOneTeaserScreen
            player={state.player}
            onContinue={() => setAppState({ phase: 'playing', player: state.player })}
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
          <ScreenTransition key={appState.phase}>{renderScreen(appState)}</ScreenTransition>
        </AnimatePresence>
      </AppShell>
    </MotionConfig>
  );
}
