import type { InterestId } from '@/types/content';

/**
 * Compatibility = how many interests a candidate shares with the player.
 * It only affects what is shown on the card. Points are decided separately (see scoring.ts).
 */

export function countSharedInterests(
  playerInterestIds: readonly InterestId[],
  candidateInterestIds: readonly InterestId[],
): number {
  const playerSet = new Set(playerInterestIds);
  return candidateInterestIds.filter((id) => playerSet.has(id)).length;
}

export function isSharedInterest(
  interestId: InterestId,
  playerInterestIds: readonly InterestId[],
): boolean {
  return playerInterestIds.includes(interestId);
}
