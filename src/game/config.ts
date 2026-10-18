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
    /**
     * `null` = play the animated teaser (TheOneTeaserAnimation). Set a path such as
     * '/videos/the-one-teaser.mp4' to play a video instead (missing file → animation).
     */
    videoSrc: null as string | null,
    posterSrc: null as string | null,
    animation: {
      /** How long each beat of the animated teaser lasts, in order. */
      beatDurationsMs: {
        matchFound: 2_000,
        reveal: 2_400,
        interests: 2_800,
        hide: 2_800,
      },
      /**
       * PLACEHOLDER: portrait shown blurred as THE ONE's silhouette. Swap for dedicated art.
       * It's blurred beyond recognition on purpose — THE ONE is never a real candidate.
       */
      theOnePortraitSrc: '/aliens/alien-007.webp',
    },
  },

  ending: {
    /**
     * Show the "leaked investor update" reveal before the stats. Turn off if the reveal happens
     * in an in-person debrief instead.
     */
    showReveal: true as boolean,
    /** Fake revenue the company "earns" from a session — shown in the reveal, never in-game. */
    revenueEur: {
      perSwipe: 0.04,
      perMatch: 0.15,
    },
    beatDurationsMs: {
      leak: 2_400,
      swipes: 2_600,
      earnings: 2_800,
      theOne: 4_200,
    },
    /** PLACEHOLDER: the founder/villain character. `null` shows a simple silhouette. */
    founderPortraitSrc: null as string | null,
  },

  swipe: {
    /** Horizontal drag distance (px) needed to count as a swipe. */
    distanceThresholdPx: 110,
    /** Fast flicks count even if shorter than the distance threshold. */
    velocityThresholdPxPerS: 600,
  },

  feedback: {
    /** How long a match overlay stays visible. */
    overlayDurationMs: 1_90,
    /** Delay before the one-time gameplay reminder appears. */
    reminderDelayMs: 20_000,
    /** How long the one-time gameplay reminder stays visible. */
    reminderDurationMs: 2_500,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
