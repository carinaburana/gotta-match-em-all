# Architecture

A small, client-only React app. The guiding idea: **game rules are plain TypeScript; React only
displays them and reports input.**

## Directory structure

```text
├── docs/                    Project documentation + mockups/
├── public/                  Static files served as-is
│   ├── aliens/              Candidate portraits (alien-001.webp …) + fallback.svg
│   ├── avatars/             The 4 player avatars
│   └── videos/              the-one-teaser.mp4 (not supplied yet)
└── src/
    ├── App.tsx              App flow: which screen is shown, transitions between phases
    ├── main.tsx             Entry point
    ├── screens/             One component per phase (Start, ProfileSetup, Searching,
    │                        TheOneTeaser, Game, Results)
    ├── components/
    │   ├── layout/          AppShell (phone frame, future nav slots), Screen
    │   ├── ui/              Button, icons, Logo
    │   ├── cards/           CandidateCard, SwipeableCard, AlienImage, InterestTag
    │   ├── game/            GameHud, SwipeButtons, MatchFeedbackOverlay
    │   ├── profile/         Profile-setup steps
    │   └── animations/      Shared Motion variants, ScreenTransition, SearchingAnimation
    ├── game/                Pure game logic — no React
    │   ├── config.ts        All tunable numbers
    │   ├── random.ts        Seedable PRNG + helpers
    │   ├── compatibility.ts Shared-interest counting
    │   ├── candidateGenerator.ts  One candidate from content + spec
    │   ├── deckGenerator.ts Full session deck
    │   ├── matchmaking.ts   Reciprocation + swipe resolution
    │   ├── scoring.ts       Match categories + points
    │   └── gameReducer.ts   Session state machine (score, stats, current card)
    ├── hooks/               React glue: useGameSession, useCountdown, useKeyboardSwipe,
    │                        useTimedProgress
    ├── data/                Editable JSON content + index.ts (loader & validation)
    ├── types/               Shared types: content.ts, game.ts, app.ts
    ├── utils/               Small formatting helpers
    └── styles/index.css     Tailwind import + design tokens
```

## State ownership

| State                                  | Owner                                   | Lifetime         |
| -------------------------------------- | --------------------------------------- | ---------------- |
| Current phase, player profile, summary | `App.tsx` (`AppState` union)            | Whole visit      |
| Profile form inputs                    | `ProfileSetupScreen` (local state)      | Setup only       |
| Deck, score, stats, current card       | `gameReducer` via `useGameSession`      | One game session |
| Remaining time                         | `useCountdown` (derived from timestamp) | One game session |
| Drag position, overlay visibility      | Individual components                   | Visual only      |

`AppState` is a discriminated union, so e.g. `results` can only exist together with a
`SessionSummary`, and `playing` always has a player profile. Transitions are plain
`setAppState(...)` calls in `App.tsx` — open that file to see the whole flow.

No global store is needed; the data flows top-down and the tree is shallow.

## Separation of UI and logic

```
input (drag / button / key)
   → swipe(candidateId, direction)          useGameSession
   → gameReducer                            pure: resolveSwipe → scoring → stats
   → new state
   → components render it                   card exit animation, HUD, feedback overlay
```

- `src/game/` never imports React. It can be read and reasoned about on its own.
- The reducer is **pure**: timestamps arrive in actions, and each card's random
  `reciprocationRoll` is generated with the deck. That makes it safe under React StrictMode
  (which runs reducers twice in development) and reproducible with a seed.
- Duplicate-input protection lives in the reducer (`candidateId` must match the current card), not
  in the animation code.
- Components receive data via props; only screens and hooks talk to the game layer.

## Data models

Defined in `src/types/`:

- `content.ts` — `InterestCategory`, `Interest`, `AboutMeEntry`, `PlayerAvatar`, `GameContent`
- `game.ts` — `PlayerProfile`, `Candidate`, `CandidateKind`, `SwipeOutcome`, `SwipeEvent`,
  `SessionStats`, `SessionSummary`
- `app.ts` — `AppState`, `AppPhase`

JSON files are loaded once by `src/data/index.ts`, validated, and exported as `GAME_CONTENT`.
Logic always refers to interests by `id`.

## Candidate generation

1. `generateDeck({ seed, content, playerInterestIds })` creates a seeded RNG.
2. `getDeckKindCounts` turns the configured composition into exact counts; the kinds are shuffled.
3. `createCandidateGenerator` builds candidates from content, using shuffle bags to avoid
   repeats, and picks exactly `sharedInterestCount` of the player's interests plus random others.
4. Every candidate gets `kind`, `isVerified` and a pre-rolled `reciprocationRoll`.

The deck is built once in `useGameSession`'s reducer initializer — never during render.
Details and numbers: `docs/GAME_MECHANICS.md`.

## Animation integration

- `MotionConfig reducedMotion="user"` wraps the app.
- Screen changes: `AnimatePresence mode="wait"` + `ScreenTransition` in `App.tsx`.
- Cards: `SwipeableCard` handles drag and reports a direction; `AnimatePresence` animates the old
  card out in the swipe direction (`custom` = last swipe direction) while the next card enters.
- Feedback: `MatchFeedbackOverlay` reacts to `state.lastSwipe` (keyed by `eventId`). It is
  rendered inside the card area and sits on the bottom of the portrait (`PORTRAIT_AREA_CLASS` in
  `components/cards/cardLayout.ts`) so it never hides the name or verification badge.
- Shared variants/timings: `src/components/animations/variants.ts`.

To build richer reward animations, replace the visuals inside `MatchFeedbackOverlay` (or add new
components under `components/animations/`) and keep reading from `lastSwipe`. No game code needs to
change.

## Future extensibility

| Change                                                          | Where                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| Final results / ending                                          | Rewrite `ResultsScreen`; all numbers are in `SessionSummary` |
| Bottom navigation                                               | Pass a nav component to `AppShell`'s `bottom` slot           |
| Real teaser video                                               | Add the file; see `public/videos/README.md`                  |
| Final portraits                                                 | `public/aliens/` + `alien-portraits.json`                    |
| New candidate fields                                            | `Candidate` type → `candidateGenerator.ts` → `CandidateCard` |
| New content restrictions (e.g. bios only for unverified aliens) | Extend the JSON entry + filter in `candidateGenerator.ts`    |
| Sound                                                           | New hook (e.g. `useSoundEffects`) reacting to `lastSwipe`    |
| Tuning difficulty                                               | `src/game/config.ts` only                                    |
