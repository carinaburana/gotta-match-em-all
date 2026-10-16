/**
 * Small, seedable pseudorandom helpers. All game randomness goes through an `Rng` so a fixed seed
 * reproduces the same deck. Never call these from inside render functions.
 */

export type Rng = () => number;

/** Mulberry32 — tiny, fast, good enough for a game. Returns numbers in [0, 1). */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandomSeed(): number {
  return Math.floor(Math.random() * 2 ** 32);
}

/** Integer in [min, max], both inclusive. */
export function randomInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pickOne<T>(rng: Rng, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickOne: cannot pick from an empty list');
  return items[Math.floor(rng() * items.length)] as T;
}

/** Returns a shuffled copy (Fisher–Yates). */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

/** `count` distinct items in random order. Throws if there aren't enough items. */
export function pickDistinct<T>(rng: Rng, items: readonly T[], count: number): T[] {
  if (count > items.length) {
    throw new Error(`pickDistinct: need ${count} items but only ${items.length} available`);
  }
  return shuffle(rng, items).slice(0, count);
}

/** Picks a key according to relative weights, e.g. `{ 0: 2, 1: 4 }` → "1" twice as often. */
export function pickWeighted<K extends string | number>(
  rng: Rng,
  weights: Readonly<Record<K, number>>,
): K {
  const entries = Object.entries(weights) as [K, number][];
  const total = entries.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0);
  if (total <= 0) throw new Error('pickWeighted: weights must contain a positive value');
  let threshold = rng() * total;
  for (const [key, weight] of entries) {
    threshold -= Math.max(0, weight);
    if (threshold < 0) return key;
  }
  return (entries[entries.length - 1] as [K, number])[0];
}

/**
 * Draws items in shuffled order and only repeats after every item was used once ("shuffle bag").
 * Keeps names, bios and portraits from repeating back-to-back in a long deck.
 */
export function createShuffleBag<T>(rng: Rng, items: readonly T[]): () => T {
  if (items.length === 0) throw new Error('createShuffleBag: cannot draw from an empty list');
  let bag: T[] = [];
  return () => {
    if (bag.length === 0) bag = shuffle(rng, items);
    return bag.pop() as T;
  };
}

/** Reads `?seed=1234` from the URL, if present and valid. */
export function readSeedFromUrl(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('seed');
  if (raw === null) return null;
  const seed = Number.parseInt(raw, 10);
  return Number.isFinite(seed) ? seed : null;
}
