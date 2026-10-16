import { GAME_CONFIG } from '@/game/config';
import { createShuffleBag, pickDistinct, randomInt, shuffle, type Rng } from '@/game/random';
import type { GameContent, InterestId } from '@/types/content';
import type { Candidate, CandidateKind } from '@/types/game';

type CandidateConfig = (typeof GAME_CONFIG)['candidate'];

export interface CandidateSpec {
  id: string;
  kind: CandidateKind;
  /** How many of the player's interests appear on this card (0 … player interest count − 1). */
  sharedInterestCount: number;
}

/**
 * Builds candidates from content. Create one generator per session: it keeps "shuffle bags" so
 * names, bios, cities and portraits only repeat after all of them were used.
 */
export function createCandidateGenerator(
  rng: Rng,
  content: GameContent,
  playerInterestIds: readonly InterestId[],
  config: CandidateConfig = GAME_CONFIG.candidate,
) {
  const drawName = createShuffleBag(rng, content.alienNames);
  const drawCity = createShuffleBag(rng, content.alienCities);
  const drawAboutMe = createShuffleBag(rng, content.aboutMeEntries);
  const drawPortrait = createShuffleBag(rng, content.portraitSrcs);

  const playerInterestSet = new Set(playerInterestIds);
  const otherInterestIds = [...content.interestsById.keys()].filter(
    (id) => !playerInterestSet.has(id),
  );

  // A full match on every interest is reserved for THE ONE, so candidates always miss at least one.
  const maxSharedCount = Math.max(0, playerInterestIds.length - 1);

  function pickInterests(sharedCount: number): InterestId[] {
    const shared = Math.max(0, Math.min(sharedCount, maxSharedCount));
    const sharedIds = pickDistinct(rng, playerInterestIds, shared);
    const otherIds = pickDistinct(rng, otherInterestIds, config.interestsPerCard - shared);
    return shuffle(rng, [...sharedIds, ...otherIds]);
  }

  function pickAge(): number {
    const { age } = config;
    return rng() < age.ancientChance
      ? randomInt(rng, age.ancientMin, age.ancientMax)
      : randomInt(rng, age.min, age.max);
  }

  /** Generates one candidate with exactly `spec.sharedInterestCount` shared interests. */
  return function generateCandidate(spec: CandidateSpec): Candidate {
    return {
      id: spec.id,
      name: drawName(),
      age: pickAge(),
      city: drawCity(),
      distanceKm: randomInt(rng, config.distanceKm.min, config.distanceKm.max),
      aboutMe: drawAboutMe().text,
      interestIds: pickInterests(spec.sharedInterestCount),
      portraitSrc: drawPortrait(),
      kind: spec.kind,
      isVerified: spec.kind !== 'unverified',
      reciprocationRoll: rng(),
    };
  };
}
