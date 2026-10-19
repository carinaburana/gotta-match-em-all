# Game design

## Provotype intention
Dating apps promise to help people find a partner. Their business models, however, depend on
people **staying** on the app - swiping, matching, coming back. Users who find "the one" and leave are, commercially, a loss.

Our web app turns that contradiction into a provotype delivered in the form of a game. A [provotype](https://alandix.com/glossary/hcibasics/provotype)
can be described as a _"prototype designed as a provocation. It might break conventions, or in some way 
be subversive, for example, a shopping app that randomly adds items to your order."_ (Alan Dix)

So to make this contradiction tangible and obvious to experience we created a fictional alien dating app that advertises
advanced AI matchmaking. User engagement is rewarded with points, flashy animations and urgency for continuous swiping.

However, the points have no purpose. The score visualizes neural mechanisms involved in reward anticipation and reinforcement learning. Similar mechanisms are involved in gambling, when unpredictable rewards can lead to higher dopamine-responses and reinforce repetition and compulsive use. A [2024 lawsuit against Match Group](https://www.washingtonpost.com/technology/2024/02/19/tinder-hinge-dating-app-lawsuit/) alleged that dating apps deliberately use such game-like reward mechanisms to encourage compulsive engagement.
In our provotype a countdown timer additionally introduces time pressure and thereby a sense of urgency, potentially amplifying fear of missing out (FOMO). 

## Withholding most-ideal matches
Through a video sequence the company introduces "The One" - an ideal match for the players. Then this profile is moved 
somewhere at the back of the deck. That's the core statement of the game: the company profits when users don't find highly compatible matches quickly.


In the game itself no candidate ever shares all three of the player's interests — a perfect match
is reserved for The One, who never shows up. The best the deck offers is "almost".

## Trust and verification
Most candidates carry a verification badge; some don't. Matching with an unverified alien costs
**−100** points. Players quickly learn to treat the badge as a stand-in for "safe" — a trust proxy
handed to them by the same platform that profits from their swiping.

## Screen flow
1. **Start** — the app's pitch.
2. **Profile setup** — name, three interests, avatar.
3. **Teaser** — the "AI" scans the galaxy, finds The One, shows the shared interests, then hides
   them somewhere in the deck.
4. **Playing** — 60 seconds of swiping with points, match animations, a countdown and a nudge
   partway through ("Hurry, you need to find your No. 1").
5. **Results** — the reveal: a leaked investor pitch by the app's founder. The player's profile is
   presented as "the product", their swipes are collected onto the company's pile, and The One is
   shown held at the back of the queue on purpose — "We don't sell love. We sell the search."
   Then the player's stats.

## One-session demonstration
The game is designed to be played once, e.g. at an exhibition or in a presentation. That's why
there is no persistence, no accounts and no long-term progression. A "Play again" button exists
for demos, but the experience is built to land on the first play.

## Open decisions for now (Oct. 2026)
- **Ending / results screen:** the in-app reveal is built. Still open: keep it, or deliver the
  reveal in person instead — set `ending.showReveal` to `false` in `src/game/config.ts` and the
  results screen opens straight on the stats
- **Messages / profile / settings tabs:** may be added later as a bottom navigation (the app shell
  already supports it). Not part of the current scope but could be added if players feel its less credible without one
- **Sound:** maybe :)
