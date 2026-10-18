# Contributing

Short, practical rules so several people (and AI agents) can work on the project without
stepping on each other.

## Setup

```bash
git clone <repo-url>
cd gotta-match-em-all
npm install
npm run dev        # http://localhost:5173
```

Use Node 22 (`nvm use` reads `.nvmrc`). In VS Code, install the recommended extensions
(ESLint, Prettier, Tailwind CSS) — format-on-save is preconfigured.

## Branches

`main` is always deployable (Vercel deploys it automatically). Never commit directly to `main`.

| Prefix     | For                | Example                   |
| ---------- | ------------------ | ------------------------- |
| `feature/` | New functionality  | `feature/match-animation` |
| `fix/`     | Bug fixes          | `fix/timer-double-start`  |
| `docs/`    | Documentation only | `docs/update-mechanics`   |

Use short, lowercase, hyphenated descriptions. No long-lived `develop` branch.

```bash
git switch main
git pull
git switch -c feature/match-animation
```

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) style — a type and a short
imperative summary:

```
feat: add +100 special match animation
fix: prevent double swipe when tapping during exit
docs: explain deck composition
style: format profile setup screen
refactor: extract interest chip component
chore: update dependencies
content: add 20 alien bios
```

Small, focused commits are easier to review and revert.

## Pull requests

1. Keep PRs small — one feature or fix per PR.
2. Before opening it, run:

   ```bash
   npm run check
   ```

   This runs TypeScript, ESLint, the Prettier check and a production build. All must pass.

3. Play through the whole flow in the browser at a phone size (DevTools device toolbar, ~390 px).
4. Push and open a PR against `main`. Describe _what_ changed and _why_; add a screenshot or
   short screen recording for visual changes.
5. At least one teammate reviews. Merge with **Squash and merge**, then delete the branch.
6. Vercel posts a preview URL on the PR — use it for review on a real phone.

If you change gameplay rules, update `docs/GAME_MECHANICS.md` in the same PR.

## Formatting and linting

```bash
npm run format       # format all files with Prettier
npm run lint         # find problems
npm run lint:fix     # fix what can be fixed automatically
npm run typecheck    # TypeScript only
```

Don't silence errors with `// eslint-disable`, `@ts-ignore` or `any` — fix the cause or ask.

## Editing content (JSON)

All game text lives in `src/data/`. You don't need to touch code to change content.

| File                   | Contains                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| `interests.json`       | Categories → interests (`id`, `label`)                                    |
| `alien-names.json`     | Candidate names                                                           |
| `alien-cities.json`    | Fictional home towns                                                      |
| `about-me.json`        | Bios (`id`, `text`)                                                       |
| `alien-portraits.json` | Portrait files the game may use                                           |
| `player-avatars.json`  | The 4 avatars shown during setup                                          |
| `searching-steps.json` | Text of the fake AI search that opens the teaser (`{name}` = player name) |

Rules:

- JSON is strict: double quotes, commas between items, **no trailing comma** after the last item.
- **IDs** (`"id": "ice-cream"`) must be unique, lowercase-kebab-case, and should never change once
  used. **Labels** can change freely.
- Keep at least **8 interests** in total (3 for the player + 5 on each card).
- Keep bios short enough to fit a phone card (≈ 40 words).
- Save, and the dev server reloads. If something is wrong, the app shows an error naming the file
  and the problem (e.g. `duplicate id "ice-cream"`).
- `_comment` fields are notes for humans and are ignored by the game.

## Adding images and media

**Alien portraits**

1. Export as WebP (≈ 768 px wide, quality ~80, character roughly centred).
2. Continue the numbering (`alien-047.webp`, …) and put them in `public/aliens/`.
3. Add each file name to `src/data/alien-portraits.json` → `"files"`.
4. Keep `fallback.svg` — it's shown if an image fails to load.

**Player avatars:** replace files in `public/avatars/` and update `src/data/player-avatars.json`.

Keep large source files (PSD, AI, Figma exports, raw video) out of the repo — only commit the
optimised files the game actually uses.
