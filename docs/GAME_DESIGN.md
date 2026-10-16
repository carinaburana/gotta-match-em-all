# Game design

## Satirical intention

Dating apps promise to help people find a partner. Their business models, however, depend on
people **staying** on the app — swiping, matching, coming back. A user who finds "the one" and
leaves is, commercially, a lost user.

Gotta Match 'Em All turns that contradiction into a game. A fictional alien dating app advertises
advanced AI matchmaking that will find your perfect match, "THE ONE". It then rewards you with
points, flashy animations and urgency for continuous swiping — and never actually shows you
THE ONE.

The tone is playful, not preachy: bright colours, cute aliens, silly bios. The critique lives in
the mechanics, not in lectures.

## Player experience

A single session of roughly 1–2 minutes, understandable without instructions:

1. **Start** — logo, a one-line promise ("find 'The One' before the time runs out"), Start button.
2. **Profile setup** — enter a name, pick exactly three interests, choose one of four avatars.
   Mimics real onboarding; nothing is stored.
3. **AI searching** — an over-the-top fake "analysis" with buzzwords and a progress bar. It ends by
   announcing THE ONE has been found.
4. **THE ONE teaser** — a short video introduces the player's supposedly ideal match.
5. **Swipe gameplay** — 60 seconds of swiping through generated alien profiles. Matches give
   +10, rare "special" matches +100, matches with unverified "bad guys" −100. A big timer and
   reward animations create urgency.
6. **Results** — session statistics. The final satirical ending is still open (see below).

## Why THE ONE never appears

THE ONE is the hook that keeps the player swiping. The teaser makes the promise concrete — you
_saw_ them, so you keep looking. But THE ONE is not in the deck, not hidden at position 99, not
reachable with a high score. Every card is someone else.

This is the core statement of the game: the system profits from the search, not from the find.
Points and animations are there to make the search feel rewarding enough that the player doesn't
notice — or doesn't mind.

To protect this, THE ONE does not exist as a game entity at all (no candidate, no kind, no ID).
It is a narrative promise only.

## Points have no purpose

The score can't be spent, isn't saved and doesn't unlock anything. It's gamification for its own
sake — another mirror of engagement mechanics. Special matches give big points but aren't more
compatible; compatibility and reward are deliberately unrelated.

## One-session demonstration

The game is designed to be played once, e.g. at an exhibition or in a presentation. That's why
there is no persistence, no accounts and no long-term progression. A "Play again" button exists
for demos, but the experience should land on the first play.

## Open decisions

- **Ending / results screen:** not decided — neither the final satirical message nor the ending
  animation. The current results screen is a neutral placeholder that lists all session
  statistics, so the team can design any ending without touching the game engine.
- **Messages / profile / settings tabs:** may be added later as a bottom navigation (the app shell
  already supports it). Not part of the current scope.
- **Sound:** not yet designed.
- **Teaser video:** in production; a placeholder is used meanwhile. The logo (start screen),
  the "nearby matches" radar (searching screen), alien portraits and player avatars are final.
