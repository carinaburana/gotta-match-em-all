import type { CandidateKind } from '@/types/game';

/**
 * Central gameplay configuration. Tune the game here — no other file should hard-code these values.
 * See docs/GAME_MECHANICS.md for what each setting means.
 *
 * Note: THE ONE is intentionally not configurable. It never appears in the deck.
 */
export const GAME_CONFIG = {
  /** Length of the swipe session. The timer starts when the game screen becomes active. */
  sessionDurationMs: 60_000,

  /** Pause after time runs out (shows "Time's up!") before the results screen opens. */
  endScreenDelayMs: 1_200,

  profile: {
    requiredInterestCount: 3,
    maxNameLength: 20,
  },

  points: {
    normalMatch: 10,
    specialMatch: 100,
    negativeMatch: -100,
    /**
     * Liking someone who doesn't like you back. Mirrors how real apps rank down people who
     * swipe right on everyone, so "like every verified profile" stops being a free strategy.
     */
    likedNoMatch: -10,
  },

  /** Chance (0–1) that a candidate likes the player back after a right swipe. */
  reciprocationProbability: {
    normal: 0.5,
    special: 0.5,
    unverified: 0.2,
  } satisfies Record<CandidateKind, number>,

  deck: {
    /** Cards generated per session — far more than a player can swipe in 60 s. */
    size: 100,
    /** Share of each candidate kind in the deck. Must add up to 1. */
    composition: {
      normal: 0.7,
      special: 0.1,
      unverified: 0.2,
    } satisfies Record<CandidateKind, number>,
  },

  candidate: {
    /** Interest tags shown on each card. */
    interestsPerCard: 5,
    /**
     * Relative weights for how many interests a candidate shares with the player (0–2).
     * Sharing all 3 is reserved for THE ONE (who never appears), so no candidate ever gets it.
     * Compatibility is independent of the reward kind — a "special" candidate may share nothing.
     */
    sharedInterestWeights: { 0: 2, 1: 4, 2: 3 } as Record<number, number>,
    age: {
      min: 19,
      max: 45,
      /** Occasionally an alien is a few centuries old. */
      ancientChance: 0.08,
      ancientMin: 120,
      ancientMax: 950,
    },
    distanceKm: { min: 1, max: 99 },
    /**
     * Highlight shared interests and show "N in common" on the card. Off by default so players
     * have to read the profile instead of scanning for purple chips. Handy to toggle in user tests.
     */
    highlightSharedInterests: false,
  },

  /**
   * Fixed seed for reproducible demo runs (same deck, same match results for the same swipes).
   * `null` = random each session. A `?seed=1234` URL parameter overrides this value.
   */
  randomSeed: null as number | null,

  searching: {
    /** Total length of the fake "AI analysis" progress animation. */
    durationMs: 4_500,
  },

  teaser: {
    /** Drop the real video at public/videos/the-one-teaser.mp4. Missing file → placeholder. */
    videoSrc: '/videos/the-one-teaser.mp4',
    posterSrc: null as string | null,
  },

  swipe: {
    /** Horizontal drag distance (px) needed to count as a swipe. */
    distanceThresholdPx: 110,
    /** Fast flicks count even if shorter than the distance threshold. */
    velocityThresholdPxPerS: 600,
  },

  feedback: {
    /** How long a match overlay stays visible. */
    overlayDurationMs: 1_100,
    /** Longer duration when a THE ONE teaser is shown with the feedback, so it can be read. */
    teaserOverlayDurationMs: 1_800,
    /** Every Nth swipe also shows a THE ONE teaser ("THE ONE is getting closer…"). */
    theOneTeaserEverySwipes: 6,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
