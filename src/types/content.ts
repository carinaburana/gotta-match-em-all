/**
 * Types for the editable content in `src/data/*.json`.
 * If you change a JSON schema, update the matching type here and the loader in `src/data/index.ts`.
 */

/** Stable identifier, e.g. "ice-cream". Game logic always compares IDs, never labels. */
export type InterestId = string;
export type InterestCategoryId = string;

export interface Interest {
  id: InterestId;
  label: string;
}

export interface InterestCategory {
  id: InterestCategoryId;
  label: string;
  interests: Interest[];
}

/** An interest together with the category it belongs to (flattened view). */
export interface InterestWithCategory extends Interest {
  categoryId: InterestCategoryId;
}

export interface AboutMeEntry {
  id: string;
  text: string;
}

export interface PlayerAvatar {
  id: string;
  label: string;
  /** Public URL, e.g. "/avatars/avatar-01.webp". */
  src: string;
}

export interface SearchingContent {
  title: string;
  subtitle: string;
  /** Shown one after another. "{name}" is replaced with the player's name. */
  steps: string[];
}

/** Text for the animated THE ONE teaser: one caption per beat. "{name}" = player name. */
export interface TheOneTeaserContent {
  matchFound: string;
  reveal: string;
  interests: string;
  hide: string;
  go: string;
}

/** Text for the time-limit screen. "{name}" = player name, "{duration}" = session length in words. */
export interface TimeLimitContent {
  message: string;
  countdownLabel: string;
  button: string;
}

/** One line of text per beat of the ending reveal. See src/data/ending.json for placeholders. */
export interface EndingCaptions {
  intro: string;
  harvest: string;
  queue: string;
  held: string;
  closer: string;
}

/** Text for the ending reveal (the founder's "leaked investor pitch"). */
export interface EndingContent {
  captions: EndingCaptions;
  productCard: { role: string };
  ledger: { swipes: string; matches: string; seconds: string };
  queueTags: { next: string; theOne: string; held: string };
  buttons: { continue: string };
}

/** Everything the game needs from `src/data`, validated and ready to use. */
export interface GameContent {
  interestCategories: InterestCategory[];
  /** All interests, flattened, keyed by ID. */
  interestsById: ReadonlyMap<InterestId, InterestWithCategory>;
  alienNames: string[];
  alienCities: string[];
  aboutMeEntries: AboutMeEntry[];
  /** Public URLs of candidate portraits, e.g. "/aliens/alien-001.webp". */
  portraitSrcs: string[];
  playerAvatars: PlayerAvatar[];
  searching: SearchingContent;
  theOneTeaser: TheOneTeaserContent;
  timeLimit: TimeLimitContent;
  ending: EndingContent;
}
