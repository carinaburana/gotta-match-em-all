# Game mechanics

All numbers below are defaults from **`src/game/config.ts`**. Change them there — nowhere else.

## Game states

The app flow (`src/types/app.ts`) is:

```
start → profile-setup → searching → teaser → playing → results
```

Inside `playing`, the swipe session (`src/game/gameReducer.ts`) has its own status:

| Status     | Meaning                                                  |
| ---------- | -------------------------------------------------------- |
| `ready`    | Deck built, timer not started. Swipes are ignored.       |
| `playing`  | Timer running, swipes accepted.                          |
| `finished` | Time up or deck exhausted. Swipes ignored, stats frozen. |

Reducer actions: `start`, `swipe`, `finish`. The reducer is the only place where score and
statistics change.

## Timer

- Duration: **60 s** (`sessionDurationMs`).
- Starts when the game screen mounts — not during setup, searching or the teaser.
- Remaining time is computed from the start timestamp on every tick, so it doesn't drift.
- At 0: the session finishes, swipes stop being accepted, a "Time's up!" overlay shows for
  `endScreenDelayMs` (1.2 s), then the results screen opens with the frozen statistics.
- If the deck runs out first, the session ends the same way with reason `deck-exhausted`.

## Candidate types

| Kind         | Verified | Reciprocation chance | Points on match |
| ------------ | -------- | -------------------- | --------------- |
| `normal`     | ✅       | 50 %                 | **+10**         |
| `special`    | ✅       | 50 %                 | **+100**        |
| `unverified` | ❌       | 20 %                 | **−100**        |

- The kind is hidden from the player. Verified candidates show a purple check badge; unverified
  ones don't — that's the only visible hint.
- **There is no THE ONE kind.** THE ONE never appears (see `docs/GAME_DESIGN.md`).
- `isVerified` is always `kind !== 'unverified'`.

## Verification and penalties

- Viewing an unverified candidate: no effect.
- Liking **any** candidate who doesn't like you back: **−10** (`points.likedNoMatch`).
- Liking an unverified candidate who **does** like you back: match → **−100**.
- Rejecting anyone: no effect.

Why the −10: without it, the best strategy is "like everyone with a verification badge" — every
like is a free lottery ticket. Real dating apps rank down people who swipe right on everyone, so
the penalty is framed as the algorithm judging you ("Your desirability score dropped −10").
Liking a verified profile is now roughly break-even (normal: 50 % +10 / 50 % −10); only the
occasional +100 special makes it worth it.

The score starts at 0 and may become negative.

## Swipe behaviour

| Input            | Result        |
| ---------------- | ------------- |
| Drag right / ♥   | Like          |
| Drag left / ✕    | Reject        |
| → / ← arrow keys | Like / Reject |

- A drag counts if it moves more than **110 px** or is flicked faster than **600 px/s**;
  otherwise the card snaps back.
- All inputs call the same `swipe(candidateId, direction)` action.
- The reducer ignores a swipe unless the session is `playing` **and** `candidateId` is the
  current card. This prevents double scoring from a drag + button press, animation callbacks or
  rapid taps. A card that is animating out can't be dragged.

Resolution (`resolveSwipe` in `src/game/matchmaking.ts`):

1. Left → `rejected`.
2. Right → the candidate reciprocates if `reciprocationRoll < probability(kind)`.
3. No reciprocation → `liked-no-match` (**−10**).
4. Reciprocation → `match` with category `normal` / `special` / `negative` and its points.

## Compatibility

- The player picks exactly **3** interests. Each card shows **5** interests.
- Compatibility = number of the player's interests shown on the card (0–2). By default shared
  interests are **not** highlighted and there is no "N in common" label, so players have to read
  the card (`candidate.highlightSharedInterests` turns both back on, e.g. to compare in user tests).
- The deck generator decides each card's shared count from weights `{ 0: 2, 1: 4, 2: 3 }` —
  mostly 1–2 shared.
- **No candidate ever shares all 3 interests.** A perfect match is reserved for THE ONE, who
  never appears. `candidateGenerator.ts` caps the shared count at (player interests − 1) even if
  the weights are changed.
- **Compatibility does not affect points or reciprocation.** A `special` card may share nothing.

Functions: `countSharedInterests` (`compatibility.ts`), `generateCandidate` with a
`sharedInterestCount` (`candidateGenerator.ts`), `doesCandidateReciprocate` (`matchmaking.ts`),
`getPointsForMatch` / `getScoreChange` (`scoring.ts`).

## Deck generation

`generateDeck` (`src/game/deckGenerator.ts`) runs **once** when gameplay starts:

1. Exact counts from the composition: **70 normal, 10 special, 20 unverified** (100 cards).
2. Kinds are shuffled.
3. Each card gets a shared-interest count, then a name, age, city, distance, bio, interests and
   portrait. Names, bios, cities and portraits come from "shuffle bags", so they only repeat after
   all options were used.
4. Each card gets a pre-rolled `reciprocationRoll` (keeps the reducer pure and seeded runs
   reproducible).
5. IDs are `cand-001` … `cand-100`; uniqueness is checked.

Ages are 19–45, with an 8 % chance of an "ancient" alien (120–950). Distances are 1–99 km.

100 cards is far more than anyone can swipe in 60 s, so running out is unlikely.

### Randomness and seeds

- Seeded PRNG (`src/game/random.ts`). Priority: `?seed=` URL parameter → `GAME_CONFIG.randomSeed`
  → random.
- Same seed + same three interests → identical deck and identical match results for the same
  swipes.

## Algorithm messages

Content in `src/data/algorithm-messages.json`, shown in the feedback overlay:

- **No-match messages** (`noMatch`) replace the old neutral "No match… keep swiping!" and make the
  algorithm's judgement visible. They cycle in order.
- **THE ONE teasers** (`theOneTeasers`) appear every **6th** swipe
  (`feedback.theOneTeaserEverySwipes`) above the normal feedback, for **1.8 s**
  (`feedback.teaserOverlayDurationMs`). They dangle THE ONE to keep the player swiping. Purely
  text — THE ONE still never appears.

## Session statistics

Available to the results screen as `SessionSummary` (`src/types/game.ts`):

| Field               | Meaning                                                         |
| ------------------- | --------------------------------------------------------------- |
| `finalScore`        | Score at the end                                                |
| `cardsViewed`       | Cards that were on screen (swiped + the one visible at the end) |
| `rightSwipes`       | Likes                                                           |
| `leftSwipes`        | Rejections                                                      |
| `normalMatches`     | +10 matches                                                     |
| `specialMatches`    | +100 matches                                                    |
| `negativeMatches`   | −100 matches with unverified candidates                         |
| `unansweredLikes`   | Likes that weren't returned (−10 each)                          |
| `sessionDurationMs` | From gameplay start to end                                      |
| `endReason`         | `time-up` or `deck-exhausted`                                   |

`rightSwipes = normalMatches + specialMatches + negativeMatches + unansweredLikes`.

## Content validation

`src/data/index.ts` checks the JSON at startup and throws a clear error for duplicate IDs, empty
lists, or too few interests to fill a card (needs at least 3 + 5 = 8 interests in total).
