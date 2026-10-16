# Gotta Match 'Em All 👽💜

A playful, mobile-first web game that satirises dating apps, "AI-powered" matchmaking and
engagement-driven algorithms.

Players create an alien dating profile, pick three interests, watch a (completely fake) AI
matchmaking sequence and get introduced to **THE ONE** — their supposedly perfect match. Then they
swipe through alien profiles for 60 seconds, collecting points for matches and losing points for
matching with unverified profiles.

**The twist: THE ONE never appears.** The app keeps you swiping for someone it will never show you.
See [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) for the idea behind it.

This is a single-session demonstrator (about 1–2 minutes), not a real dating platform. There is no
backend, no accounts, no real AI and no data collection.

## Tech stack

| Purpose     | Tool                              |
| ----------- | --------------------------------- |
| UI          | React 19 + TypeScript (strict)    |
| Build / dev | Vite                              |
| Styling     | Tailwind CSS v4                   |
| Animation   | Motion for React (`motion/react`) |
| Code style  | ESLint + Prettier                 |
| Content     | Local JSON files in `src/data/`   |
| Hosting     | Vercel (static site)              |

## Requirements

- **Node.js 20.19+ or 22.12+** (22 recommended — see `.nvmrc`)
- npm (comes with Node)

## Getting started

```bash
git clone <repo-url>
cd gotta-match-em-all
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). To try it on your phone, run
`npm run dev -- --host` and open the "Network" URL on a phone in the same Wi-Fi.

## Commands

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload                             |
| `npm run build`     | Type-check and create a production build in `dist/`              |
| `npm run preview`   | Serve the production build locally                               |
| `npm run typecheck` | TypeScript check only                                            |
| `npm run lint`      | ESLint (`npm run lint:fix` fixes what it can)                    |
| `npm run format`    | Format everything with Prettier (`format:check` only checks)     |
| `npm run check`     | **Run before every PR:** typecheck + lint + format check + build |

There are no automated tests by design; quality comes from static checks, a successful build and
manually playing through the game.

### Reproducible runs

Add `?seed=1234` to the URL (e.g. `http://localhost:5173/?seed=1234`) to get the same deck every
time — handy for demos and bug reports. A default seed can also be set in `src/game/config.ts`.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset: **Vite** (detected automatically).
4. Build command: `npm run build` · Output directory: `dist`.
5. Deploy. Every push to `main` redeploys; pull requests get preview URLs.

No environment variables are needed.

## Where things live

| You want to…                              | Go to                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| Change timer, points, probabilities, deck | `src/game/config.ts`                                                        |
| Edit names, cities, bios, interests       | `src/data/*.json` ([how](docs/CONTRIBUTING.md#editing-content-json))        |
| Change a screen                           | `src/screens/`                                                              |
| Change the swipe card                     | `src/components/cards/`                                                     |
| Change colours / fonts                    | `src/styles/index.css` (`@theme` block)                                     |
| Understand the code structure             | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                                |
| Understand the rules                      | [docs/GAME_MECHANICS.md](docs/GAME_MECHANICS.md)                            |
| Visual direction                          | [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) · mockups in `docs/mockups/` |
| Team workflow (branches, PRs)             | [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)                                |

## Adding assets

- **Alien portraits:** add `public/aliens/alien-001.webp` … and list each file in
  `src/data/alien-portraits.json`. Details: [public/aliens/README.md](public/aliens/README.md).
- **Player avatars:** `public/avatars/` + `src/data/player-avatars.json`.
- **THE ONE teaser video:** save it as `public/videos/the-one-teaser.mp4`. Until then a placeholder
  is shown. Details: [public/videos/README.md](public/videos/README.md).

## Implementation status

| Area                     | Status                                                          |
| ------------------------ | --------------------------------------------------------------- |
| App flow (6 screens)     | ✅ Working                                                      |
| Profile setup            | ✅ Name, exactly 3 interests by category, 1 of 4 avatars        |
| Deck generation          | ✅ 100 cards, seeded, 70% normal / 10% special / 20% unverified |
| Swipe loop, score, timer | ✅ Drag, buttons and ←/→ keys; 60 s countdown                   |
| Match feedback           | 🟡 Simple placeholder overlays                                  |
| AI searching sequence    | 🟡 Placeholder radar animation, configurable text               |
| THE ONE teaser           | 🟡 Video slot + placeholder (video not supplied yet)            |
| Results screen           | 🟡 Placeholder stats list — final ending not decided            |
| Illustrations / logo     | ✅ 46 portraits + 4 avatars · 🟡 text logo still placeholder    |
| Sound                    | ⬜ Not started (files will go in `public/sounds/`)              |
| Bottom navigation        | ⬜ Not planned yet — shell is prepared for it                   |

## For AI coding agents

Read [AGENTS.md](AGENTS.md) (Claude Code also reads [CLAUDE.md](CLAUDE.md)) before making changes.
