# Gotta Match 'Em All

A thought-provoking mobile web game that plays on dating apps business model, their predictive compatibility scores, and engagement-driven recommendation algorithms.
Players create a makeshift dating profile, choose three interests, and enter a fictional company's matchmaking process. 

Dating platforms face an interesting conflict of incentives: while their users may hope to find a long-term partner and leave the app for good,
the platforms themselves benefit from keeping users single.

Without concrete proof, but from numerous experiences shared online, we hypothesize companies withhold our ideal matches from customers on purpose.
Inspired loosely by the Gale–Shapley stable matching algorithm, we take this conflict to an extreme. In our satirical interpretation, the only way to find your best match is to simply match with everyone.

More about the idea behind the game can be found in [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md).


This is a single-session demonstrator (about 1–2 minutes), not a real dating platform. To avoid reinforcing human stereotypes or distracting from our core concept,
players and their potential matches are cute, fluffy aliens from a nearby planet.

### But why does this matter?
According to [Pew Research Center (2023)](https://www.pewresearch.org/internet/2023/02/02/from-looking-for-love-to-swiping-the-field-online-dating-in-the-u-s/), 20% of partnered Americans aged 18–29 met their current partner through a dating site or app.

As romantic connections increasingly begin on digital platforms rather than through traditional social networks, like work or friend groups, the algorithms determining who we encounter may also influence who we ultimately form relationships with - or not.

Meanwhile, the share of American adults aged 25–54 living without a spouse or partner increased from 29% in 1990 to 38% in 2019 ([Pew Research Center, 2021](https://www.pewresearch.org/social-trends/2021/10/05/rising-share-of-u-s-adults-are-living-without-a-spouse-or-partner/)), although more recent data show a slight decline. Research has also linked prolonged singlehood among young adults to greater loneliness and lower life satisfaction ([Krämer et al., 2026](https://doi.org/10.1037/pspp0000595)), while demographic studies have identified economic disparities between partnered and unpartnered adults.

Of course, there is no established evidence that dating apps are responsible for these broader demographic trends.
But as increasingly important parts of our romantic lives are mediated by private companies, it is worth questioning whose interests their matchmaking algorithms really serve.



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

### Dev shortcuts (only in `npm run dev`)

A small **DEV** button in the bottom-left corner jumps straight to the teaser, the game or the
ending with a fake player and session. `?dev=teaser`, `?dev=game` or `?dev=ending` in the URL does
the same and survives page reloads. None of this is included in production builds.

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

## Implementation status

| Area                     | Status                                                          |
| ------------------------ | --------------------------------------------------------------- |
| App flow (6 screens)     | ✅ Working                                                      |
| Profile setup            | ✅ Name, exactly 3 interests by category, 1 of 4 avatars        |
| Deck generation          | ✅ 100 cards, seeded, 70% normal / 10% special / 20% unverified |
| Swipe loop, score, timer | ✅ Drag, buttons and ←/→ keys; 60 s countdown                   |
| Match feedback           | 🟡 Simple placeholder overlays                                  |
| AI searching sequence    | ✅ Animated "nearby matches" radar, configurable text           |
| THE ONE teaser           | ✅ Animated in-app (`TheOneTeaserAnimation`), text in JSON      |
| Results screen           | ✅ Ending reveal (founder's investor pitch) + stats             |
| Illustrations / logo     | ✅ 46 portraits + 4 avatars + logo (`public/logo.webp`)         |
| Sound                    | ⬜ Not started (files will go in `public/sounds/`)              |
| Bottom navigation        | ⬜ Not planned yet — shell is prepared for it                   |

## For AI coding agents
Read [AGENTS.md](AGENTS.md) (Claude Code also reads [CLAUDE.md](CLAUDE.md)) before making changes.
