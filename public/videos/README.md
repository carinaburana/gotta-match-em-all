# THE ONE teaser video

Place the teaser video here as:

```
public/videos/the-one-teaser.mp4
```

That's all — the teaser screen picks it up automatically. If the file is missing or fails to
load, the screen shows a placeholder instead, so the game is always playable.

- The path is configured in `src/game/config.ts` → `teaser.videoSrc`.
- Prefer H.264 MP4, portrait (9:16), short (≈10–20 s), and under ~10 MB so it loads quickly.
- An optional poster image can be set via `teaser.posterSrc` in the same config.
- The player reaches this screen by tapping a button, so the video may start with sound on most
  mobile browsers. If a browser blocks autoplay, a play button is shown.
