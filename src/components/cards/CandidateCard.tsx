import { AlienImage } from '@/components/cards/AlienImage';
import { InterestTag } from '@/components/cards/InterestTag';
import { HomeIcon, PinIcon, VerifiedIcon } from '@/components/ui/icons';
import { GAME_CONTENT } from '@/data';
import { countSharedInterests, isSharedInterest } from '@/game/compatibility';
import type { InterestId } from '@/types/content';
import type { Candidate } from '@/types/game';

interface CandidateCardProps {
  candidate: Candidate;
  playerInterestIds: readonly InterestId[];
}

/** Purely visual dating profile card. Knows nothing about swiping or scoring. */
export function CandidateCard({ candidate, playerInterestIds }: CandidateCardProps) {
  const sharedCount = countSharedInterests(playerInterestIds, candidate.interestIds);

  return (
    <article
      aria-label={`${candidate.name}'s profile`}
      className="flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-lg shadow-brand-900/10 ring-1 ring-brand-900/5"
    >
      {/* Portrait area. Top padding leaves room for the game HUD overlay. */}
      <div className="relative h-[44%] min-h-40 shrink-0 bg-brand-100">
        <AlienImage src={candidate.portraitSrc} alt={`Portrait of ${candidate.name}`} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pt-4 pb-5">
        <header>
          <h2 className="flex items-center gap-2 text-3xl font-bold">
            <span className="truncate">{candidate.name}</span>
            {candidate.age !== undefined && (
              <span className="text-xl font-medium text-ink-muted">{candidate.age}</span>
            )}
            {candidate.isVerified && (
              <VerifiedIcon
                className="h-6 w-6 shrink-0 text-brand-600"
                role="img"
                aria-hidden={false}
                aria-label="Verified profile"
              />
            )}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            <HomeIcon className="h-4 w-4" /> Lives in {candidate.city}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
            <PinIcon className="h-4 w-4" /> {candidate.distanceKm} kilometers away
          </p>
        </header>

        <section className="border-t border-line pt-3">
          <h3 className="font-semibold">About me</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{candidate.aboutMe}</p>
        </section>

        <section className="border-t border-line pt-3">
          <h3 className="font-semibold">
            Interests
            {sharedCount > 0 && (
              <span className="ml-2 text-sm font-normal text-brand-600">
                {sharedCount} in common
              </span>
            )}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {candidate.interestIds.map((id) => (
              <InterestTag
                key={id}
                label={GAME_CONTENT.interestsById.get(id)?.label ?? id}
                isShared={isSharedInterest(id, playerInterestIds)}
              />
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
