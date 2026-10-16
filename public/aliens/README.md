# Alien portraits

Candidate portraits shown on the swipe cards live here.

## Naming convention

Final portraits: `alien-001.webp`, `alien-002.webp`, … `alien-050.webp`

- Three-digit, zero-padded numbers.
- WebP, square or portrait (e.g. 800×800 or 800×1000). Cards use `object-fit: cover`, so exact
  dimensions don't matter, but keep the character roughly centred.
- Transparent or light backgrounds both work.

## Making a portrait show up in the game

Adding a file here is not enough — also list it in **`src/data/alien-portraits.json`**.
The candidate generator only uses portraits from that list, so the game never references a file
that doesn't exist.

## Placeholders (temporary)

- `placeholder-01.svg` … `placeholder-06.svg` — temporary portraits listed in
  `alien-portraits.json` until the real art arrives. Remove them from the JSON (and here) once
  real portraits are added.
- `fallback.svg` — shown automatically if any portrait fails to load. Keep this file.
