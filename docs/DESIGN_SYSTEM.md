# Design system

> **Status: provisional.** Everything here follows the current mockups (`docs/mockups/`) and will
> be refined once final illustrations and branding exist. Items marked _(provisional)_ are
> placeholders, not decisions.

## Visual direction

A cheerful, slightly over-the-top alien dating app: light backgrounds, colourful illustrated
characters, purple as the main accent, rounded everything, playful stickers (hearts, sparkles,
squiggles) and exaggerated reward moments. It should look like a believable, polished app — the
satire works best when the product looks convincing.

## Colour roles

Defined as tokens in `src/styles/index.css` (`@theme`). Use the token classes, not hex values.

| Role               | Token / class                                 | Use                                      |
| ------------------ | --------------------------------------------- | ---------------------------------------- |
| Primary            | `brand-600` (`#5b3a8e`)                       | Primary buttons, selected chips, badge   |
| Primary tints      | `brand-50` … `brand-300`                      | Portrait backgrounds, progress tracks    |
| Primary dark       | `brand-700` … `brand-900`                     | Headings on light bg, outlines, overlays |
| Canvas             | `canvas` (`#f4f3f6`)                          | App background                           |
| Surface            | `surface` (white)                             | Cards, sheets                            |
| Text               | `ink`, `ink-muted`                            | Body text, secondary text                |
| Lines              | `line`                                        | Dividers, unselected chip borders        |
| Like / positive    | `like`, `like-soft`                           | Like button, +10 feedback                |
| Reject / negative  | `nope`, `nope-soft`                           | Reject button, −100 feedback, low timer  |
| Big reward         | `reward`, `reward-soft`                       | +100 special match                       |
| Decorative accents | `accent-pink`, `accent-yellow`, `accent-teal` | Stickers, logo, illustrations            |

Keep text contrast at WCAG AA (4.5:1 for body text). `ink-muted` on white passes; don't use
`brand-300` or lighter for text.

## Typography

| Role    | Style                                     | Example                         |
| ------- | ----------------------------------------- | ------------------------------- |
| Display | `font-display`, very bold _(provisional)_ | Logo                            |
| Title   | `text-3xl font-bold`                      | "What's your name?", alien name |
| Section | `font-semibold`                           | "About me", "Interests"         |
| Body    | `text-sm`/`text-base`, `ink-muted`        | Bio, hints                      |
| Numbers | `tabular-nums` (timer uses `font-mono`)   | Timer, score                    |

Fonts are system fonts for now _(provisional)_ — no remote font dependency. If a brand font is
chosen, self-host it (e.g. `public/fonts/`) and set `--font-sans` / `--font-display`.

## Layout principles

- **Mobile first**, designed for 360–430 px wide portrait screens.
- **Desktop:** `AppShell` shows a centred phone-sized frame (max 430 px wide, max 880 px tall)
  instead of stretching.
- Use `h-dvh` / full-height flex layouts. Gameplay must **never scroll the page**; long card
  content scrolls inside the card.
- Respect safe areas with `pt-safe` / `pb-safe` utilities (notches, home indicator).
- `Screen` component: scrollable content + pinned primary action at the bottom, like the mockups.
- `AppShell` has optional `top` and `bottom` slots so a bottom navigation (Messages, Profile,
  Settings) can be added later without restructuring screens.

## Spacing

Tailwind's 4 px scale. Common values: screen side padding `px-6` (24 px), card inner padding
`px-5`, gaps between sections `gap-3`–`gap-6`, chip gap `gap-2`.

## Buttons

- `Button` (`src/components/ui/Button.tsx`): pill shape, min height 48 px, `text-lg`.
  Variants: `primary` (filled purple), `secondary` (outlined), `ghost`.
- Swipe buttons: 64 px circles — red ✕ (reject) and mint ♥ (like).
- Disabled state = 40 % opacity. Every icon-only button needs an `aria-label`.
- Touch targets ≥ 44 × 44 px.

## Cards

- Candidate card: `rounded-card` (28 px), white, soft purple shadow.
- Top ~44 %: portrait on a lavender background (`brand-100`). Images always use a fixed container
  with `object-fit: cover` — layouts must not depend on image dimensions.
- Below: name + age + verified badge, home town, distance, "About me", interest chips.
- Interest chips: outlined grey by default; **shared interests are filled purple**.
- Timer (left) and score (right) float over the portrait area.

## Animation guidelines

- **Motion for React** for gestures, enter/exit and anything state-driven
  (`src/components/animations/variants.ts` holds shared variants and timings).
- **CSS** (`animate-float`, `animate-radar`, `animate-pulse-ring`, `animate-twinkle`,
  `animate-heartbeat`) for simple looping decoration — e.g. the inline SVG in
  `NearbyMatchesRadar.tsx`, whose parts are animated individually.
- Animations visualise state; they never decide rules or change the score.
- Keep UI transitions short (150–350 ms). Reward moments may be bigger and bouncier; the +100
  should feel noticeably more exciting than +10, and −100 should feel like a "fail" moment.
- `MotionConfig reducedMotion="user"` and a CSS media query respect "reduce motion".
- Current card/feedback animations are basic placeholders _(provisional)_.

## Responsive behaviour

| Viewport                      | Behaviour                                             |
| ----------------------------- | ----------------------------------------------------- |
| < 360 px wide                 | Still usable; text may wrap, card content scrolls     |
| 360–430 px                    | Primary target                                        |
| Short screens (< 700 px tall) | Portrait keeps ≥ 160 px; card body scrolls internally |
| ≥ 768 px (md)                 | Centred phone frame with rounded corners and shadow   |
