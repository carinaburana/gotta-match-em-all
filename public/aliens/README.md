# Alien portraits

Candidate portraits shown on the swipe cards live here.

## Naming convention

Portraits: `alien-001.webp`, `alien-002.webp`, … (currently `alien-001` … `alien-046`)

- Three-digit, zero-padded numbers.
- WebP, about 768 px wide, quality ~80 (≈ 80 KB each). Cards use `object-fit: cover`, so exact
  dimensions don't matter, but keep the character roughly centred.
- Full scene backgrounds are fine (the current art has them).

## Making a portrait show up in the game

Adding a file here is not enough — also list it in **`src/data/alien-portraits.json`**.
The candidate generator only uses portraits from that list, so the game never references a file
that doesn't exist.

## Source

The current portraits come from the team's Drive folder (`Image01.webp` … `Image50.webp`, 1024 px),
resized to 768 px wide. Four of those 50 are used as player avatars instead (see
`public/avatars/README.md`), so they never appear as swipe candidates.

## Fallback

`fallback.svg` is shown automatically if any portrait fails to load. Keep this file.
