# CLAUDE.md

Instructions for Claude Code. The shared agent guidance — project purpose, game rules,
architecture principles, conventions, data locations and validation — lives in `AGENTS.md`
and is imported here so there is only one source of truth:

@AGENTS.md

## Claude Code specifics

- Before implementing a feature, read the relevant file in `docs/` (see the table in AGENTS.md)
  and the code you're about to change.
- For anything that touches rules or scoring, re-read `docs/GAME_MECHANICS.md` first and keep
  `src/game/config.ts` as the only place for numbers.
- Work in small steps on a `feature/…`, `fix/…` or `docs/…` branch. Don't commit to `main`.
- Finish every task with `npm run check`. Report any errors you couldn't fix instead of
  suppressing them (no `eslint-disable`, `@ts-ignore` or `any` as shortcuts).
- If you change behaviour, update the matching doc in the same change.
- Ask before making architectural changes or changing a gameplay decision.
