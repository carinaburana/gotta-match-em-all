/**
 * DEV ONLY: shortcuts for jumping straight to a screen with fake data, so animations and the
 * ending can be checked without playing through. Only used behind `import.meta.env.DEV`, so it
 * never ships in production builds.
 */
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { AppState } from '@/types/app';
import type { PlayerProfile, SessionSummary } from '@/types/game';

const DEV_PLAYER: PlayerProfile = {
  name: 'Dev',
  interestIds: [...GAME_CONTENT.interestsById.keys()].slice(
    0,
    GAME_CONFIG.profile.requiredInterestCount,
  ),
  avatarId: GAME_CONTENT.playerAvatars[0]?.id ?? '',
};

/** A plausible finished session for previewing the ending. */
const DEV_SUMMARY: SessionSummary = {
  finalScore: 140,
  cardsViewed: 24,
  rightSwipes: 14,
  leftSwipes: 9,
  normalMatches: 5,
  specialMatches: 1,
  negativeMatches: 1,
  sessionDurationMs: GAME_CONFIG.sessionDurationMs,
  endReason: 'time-up',
};

export const DEV_JUMP_TARGETS = {
  start: { label: 'Start', state: (): AppState => ({ phase: 'start' }) },
  teaser: { label: 'Teaser', state: (): AppState => ({ phase: 'teaser', player: DEV_PLAYER }) },
  timeLimit: {
    label: 'Time limit',
    state: (): AppState => ({ phase: 'time-limit', player: DEV_PLAYER }),
  },
  game: { label: 'Game', state: (): AppState => ({ phase: 'playing', player: DEV_PLAYER }) },
  ending: {
    label: 'Ending',
    state: (): AppState => ({ phase: 'results', player: DEV_PLAYER, summary: DEV_SUMMARY }),
  },
} as const;

export type DevJumpTarget = keyof typeof DEV_JUMP_TARGETS;

function isDevJumpTarget(value: string | null): value is DevJumpTarget {
  return value !== null && Object.hasOwn(DEV_JUMP_TARGETS, value);
}

/** `?dev=ending` (or teaser, timeLimit, game) opens that screen directly — survives page reloads. */
export function readDevJumpFromUrl(): AppState | null {
  const target = new URLSearchParams(window.location.search).get('dev');
  return isDevJumpTarget(target) ? DEV_JUMP_TARGETS[target].state() : null;
}
