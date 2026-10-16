# Player avatars

The four profile pictures a player can choose from during profile setup.

| File             | Source (team Drive) | Label                 |
| ---------------- | ------------------- | --------------------- |
| `avatar-01.webp` | `Image01.webp`      | Teal fuzzy alien      |
| `avatar-02.webp` | `Image03.webp`      | Yellow fluffy alien   |
| `avatar-03.webp` | `Image10.webp`      | Lavender alien        |
| `avatar-04.webp` | `Image21.webp`      | Pink three-eyed alien |

They are centre-cropped to 512 × 512 WebP. These four characters are deliberately **not** in
`public/aliens/`, so a player never swipes past their own face.

To change them, replace the files here and update `src/data/player-avatars.json` (file name and
label — the label is read out by screen readers). Keep exactly four entries unless the team
decides otherwise — the setup screen lays them out in a 2×2 grid.
