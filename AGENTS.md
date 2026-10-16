# Agent guide — Gotta Match 'Em All

This file is the **single source of truth** for AI coding agents (Claude Code, Codex, Copilot,
Cursor, …). `CLAUDE.md` imports it. If guidance changes, change it here.

## What this project is

A satirical, mobile-first alien dating-app game built by a small student team. The fictional app
promises to find the player's perfect match, "THE ONE", but **THE ONE never appears** — the game is
about engagement-driven design. Single session, ~1–2 minutes, fully client-side.

Read before implementing a feature:

| Topic                                   | Doc                      |
| --------------------------------------- | ------------------------ |
| Intent, satire, screen flow             | `docs/GAME_DESIGN.md`    |
| Rules, probabilities, points, stats     | `docs/GAME_MECHANICS.md` |
| Folder structure, state ownership       | `docs/ARCHITECTURE.md`   |
| Colours, typography, layout, animation  | `docs/DESIGN_SYSTEM.md`  |
| Branches, commits, PRs, content editing | `docs/CONTRIBUTING.md`   |

Visual references: `docs/mockups/*.png`.

## Non-negotiable game rules

1. **THE ONE never appears.** Never create a THE ONE candidate, kind, flag or ID — not even
   internally. The teaser screen is a narrative promise only.
2. Candidate kinds are exactly `normal` (+10), `special` (+100) and `unverified` (−100).
3. Penalties only happen when an unverified candidate **reciprocates** a like. Viewing, liking
   without a match, and rejecting never change the score.
4. The timer starts when gameplay becomes active — not during setup, searching or the teaser.
5. Swipe gestures, buttons and keyboard all go through the same `swipe(candidateId, direction)`
   action. The reducer ignores swipes for anything other than the current card.
6. All tunable numbers live in `src/game/config.ts`. Don't hard-code them elsewhere.
7. There is no real AI, backend, database, auth, or analytics. Don't add them.

Don't silently change gameplay decisions. If a request conflicts with these rules, ask.

## Architecture principles

- **Logic is pure TypeScript in `src/game/`** — no React imports there. Scoring, matchmaking,
  compatibility and deck generation are plain functions.
- **`gameReducer.ts` is the only place score and stats change.** It must stay pure: timestamps come
  in through actions; random rolls are pre-computed when the deck is built.
- **Randomness** goes through `src/game/random.ts` (seedable). Never call `Math.random()` in
  components or during render.
- **Animations never decide rules.** Motion components only report gestures and animate state that
  already changed.
- **Screens (`src/screens/`) wire things together;** reusable visuals live in `src/components/`.
- **App flow** is a discriminated union (`src/types/app.ts`) driven from `src/App.tsx`.
- Content is JSON in `src/data/`, loaded and validated by `src/data/index.ts`. Compare interests by
  **ID**, never by label.
- Prefer simple solutions. No global state libraries, UI kits, game engines or test frameworks
  unless the team explicitly asks.

## Coding conventions

- TypeScript strict (incl. `noUncheckedIndexedAccess`). Avoid `any`; use `import type` for types.
- Functional components, named exports, one component per file (small private helpers are fine).
- Imports across folders use the `@/` alias (`@/game/config`); ESLint forbids `../` imports.
- Tailwind utility classes for styling; design tokens live in `src/styles/index.css` (`@theme`).
  Use token classes (`bg-brand-600`, `text-ink-muted`) instead of raw hex values.
- Descriptive names (`getReciprocationProbability`, not `getProb`). Comments explain _why_.
- Mark temporary visuals with a `PLACEHOLDER` comment so they're easy to find.
- Mobile first (360–430 px wide), touch targets ≥ 44 px, no page scrolling during gameplay,
  accessible labels, respect `prefers-reduced-motion`.

## Validating changes

```bash
npm run check   # typecheck + lint + prettier check + production build
```

Then play through the full flow in `npm run dev` at a phone-sized viewport. There are no automated
tests on purpose — don't add a test framework. Use `?seed=1234` for reproducible decks.

## Data and assets

- `src/data/interests.json` — categories → interests (`id`, `label`)
- `src/data/alien-names.json`, `alien-cities.json`, `about-me.json` — profile content
- `src/data/alien-portraits.json` — which files in `public/aliens/` may be used
- `src/data/player-avatars.json` — the 4 player avatars (`public/avatars/`)
- `src/data/searching-steps.json` — text for the fake AI sequence
- `public/videos/the-one-teaser.mp4` — teaser video (placeholder shown if missing)

Keep sample data small; don't invent large datasets. The team supplies final content.
