import type { PlayerProfile, SessionSummary } from '@/types/game';

/**
 * The application flow. Each phase maps to exactly one screen in `src/screens/`.
 * Using a discriminated union means a phase can only exist together with the data it needs
 * (e.g. the results screen can't render without a summary).
 */
export type AppState =
  | { phase: 'start' }
  | { phase: 'profile-setup' }
  | { phase: 'searching'; player: PlayerProfile }
  | { phase: 'teaser'; player: PlayerProfile }
  | { phase: 'playing'; player: PlayerProfile }
  | { phase: 'results'; player: PlayerProfile; summary: SessionSummary };

export type AppPhase = AppState['phase'];
