import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import { EndingQueue } from '@/components/animations/EndingQueue';
import { EndingSwipeStream } from '@/components/animations/EndingSwipeStream';
import type { StagePoint } from '@/components/animations/EndingSwipeStream';
import { FounderFigure } from '@/components/animations/FounderFigure';
import { AlienImage } from '@/components/cards/AlienImage';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import { buildSwipeStream, getQueueNumbers, getTotalMatches, getTotalSwipes } from '@/game/ending';
import { useBeatSequence } from '@/hooks/useBeatSequence';
import { useTimedProgress } from '@/hooks/useTimedProgress';
import type { PlayerProfile, SessionSummary } from '@/types/game';
import { fillTemplate } from '@/utils/format';

interface EndingRevealAnimationProps {
  player: PlayerProfile;
  summary: SessionSummary;
  /** Called once when the last beat has played. */
  onComplete: () => void;
}

type EndingBeat = keyof typeof GAME_CONFIG.ending.beatDurationsMs | 'done';

/**
 * Stage positions the choreography is built around: px right of the centre line and px above a
 * horizontal band. The intro band is the floor (the card hovers over the founder's open hand);
 * the harvest band sits halfway up the stage. Floor-anchoring keeps the card on the hand on
 * every screen height, because the founder's size follows the stage width.
 */
const FLOOR_BAND = '0%';
const HARVEST_BAND = '45%';
const PRODUCT_CARD_INTRO: StagePoint = { x: 100, y: -174 };
const PRODUCT_CARD_HARVEST: StagePoint = { x: -96, y: 0 };
/** Mini cards start at the product card's centre (its bottom edge sits on the band). */
const STREAM_FROM: StagePoint = { x: -96, y: -70 };
const PILE: StagePoint = { x: 96, y: -64 };
const STREAM_FLIGHT_MS = 620;
const STREAM_STAGGER_MAX_MS = 130;

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * The ending: the teaser's dark mirror. The app's lights go out and the founder gives a leaked
 * investor pitch in a spotlight — the player's card is "the product", their swipes are harvested
 * onto the company's pile, and THE ONE is shown waiting at the very back of the queue, held there
 * on purpose. Narrative only: nothing here touches game logic, and THE ONE is still never a card.
 */
export function EndingRevealAnimation({ player, summary, onComplete }: EndingRevealAnimationProps) {
  const config = GAME_CONFIG.ending;
  const content = GAME_CONTENT.ending;
  const beat: EndingBeat = useBeatSequence(config.beatDurationsMs, 'done', onComplete);

  const totalSwipes = getTotalSwipes(summary);
  const totalMatches = getTotalMatches(summary);
  const seconds = Math.round(summary.sessionDurationMs / 1000);
  const queueNumbers = getQueueNumbers(summary, config.queueVisibleCards);

  const streamDirections = buildSwipeStream(summary, config.maxStreamCards);
  const streamStaggerMs = Math.min(
    STREAM_STAGGER_MAX_MS,
    (config.beatDurationsMs.harvest - STREAM_FLIGHT_MS - 900) /
      Math.max(1, streamDirections.length),
  );
  const streamPortraits = GAME_CONTENT.portraitSrcs.slice(0, streamDirections.length);
  const queuePortraits = GAME_CONTENT.portraitSrcs.slice(
    streamDirections.length,
    streamDirections.length + config.queueVisibleCards,
  );
  const playerAvatarSrc = GAME_CONTENT.playerAvatars.find(
    (avatar) => avatar.id === player.avatarId,
  )?.src;

  // Warm the browser cache so the mini cards don't pop in blank mid-flight. Keyed by a string so
  // the effect runs once, not on every animation frame.
  const preloadKey = [...streamPortraits, ...queuePortraits].join('\n');
  useEffect(() => {
    for (const src of preloadKey.split('\n')) {
      if (src) new Image().src = src;
    }
  }, [preloadKey]);

  const templateValues = {
    name: player.name,
    seconds: String(seconds),
    swipes: String(totalSwipes),
    matches: String(totalMatches),
    next: String(queueNumbers.next),
    position: String(queueNumbers.theOne),
  };
  const caption =
    beat === 'done'
      ? content.captions.closer
      : fillTemplate(content.captions[beat], templateValues);

  const founderOnStage = beat === 'intro' || beat === 'closer' || beat === 'done';
  const showProductCard = beat === 'intro' || beat === 'harvest';
  const showQueue = beat === 'queue' || beat === 'held';

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-ink text-white">
      {/* Lights off: the app's light canvas fades away to reveal the backstage. */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-canvas"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        aria-hidden
      />

      <Letterhead text={content.letterhead} />

      {/* Stage */}
      <div className="relative min-h-0 flex-1" aria-hidden>
        <Spotlight bright={founderOnStage} />
        <Dust />

        {/* Founder: in the spotlight for the intro and the closer, off stage in between. */}
        <div className="absolute inset-x-0 bottom-0 flex h-[80%] items-end justify-center">
          <motion.div
            className="aspect-[10/13] max-h-full w-[68%] max-w-80 origin-bottom"
            initial={{ opacity: 0, y: 70, scale: 0.92 }}
            animate={
              founderOnStage
                ? { opacity: 1, x: 0, y: 0, scale: beat === 'intro' ? 1 : 1.06 }
                : { opacity: 0, x: -140, y: 30, scale: 0.85 }
            }
            transition={
              founderOnStage
                ? { duration: 1.1, ease: EASE_OUT_SOFT, delay: beat === 'intro' ? 0.35 : 0.3 }
                : { duration: 0.55, ease: 'easeIn' }
            }
          >
            <FounderFigure />
          </motion.div>
        </div>

        {/* The player's own card: "the product". */}
        <AnimatePresence>
          {showProductCard && (
            <motion.div
              key="product"
              className="absolute left-1/2 h-0 w-0"
              initial={{ bottom: FLOOR_BAND }}
              animate={{ bottom: beat === 'intro' ? FLOOR_BAND : HARVEST_BAND }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              transition={{ duration: 0.7, ease: EASE_OUT_SOFT }}
            >
              <motion.div
                className="absolute bottom-0 -left-14 w-28 origin-bottom overflow-hidden rounded-2xl bg-surface text-ink shadow-2xl shadow-black/60 ring-1 ring-white/40"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  rotate: -14,
                  x: PRODUCT_CARD_INTRO.x,
                  y: PRODUCT_CARD_INTRO.y + 70,
                }}
                animate={
                  beat === 'intro'
                    ? { opacity: 1, scale: 1, rotate: -6, ...PRODUCT_CARD_INTRO }
                    : { opacity: 1, scale: 0.92, rotate: -3, ...PRODUCT_CARD_HARVEST }
                }
                exit={{ scale: 0.8, transition: { duration: 0.35 } }}
                transition={
                  beat === 'intro'
                    ? { type: 'spring', stiffness: 220, damping: 18, delay: 1.5 }
                    : { duration: 0.7, ease: EASE_OUT_SOFT }
                }
              >
                <div className="relative h-28 bg-brand-100">
                  {playerAvatarSrc && <AlienImage src={playerAvatarSrc} alt="" />}
                  <span className="absolute top-2 left-2 h-2.5 w-2.5 rounded-full bg-like ring-2 ring-white" />
                </div>
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-bold">{player.name}</p>
                  <p className="truncate text-[10px] text-ink-muted">{content.productCard.role}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The player's swipes, harvested onto the company's pile. */}
        <AnimatePresence>
          {beat === 'harvest' && (
            <EndingSwipeStream
              key="stream"
              directions={streamDirections}
              portraitSrcs={streamPortraits}
              band={HARVEST_BAND}
              from={STREAM_FROM}
              to={PILE}
              staggerMs={streamStaggerMs}
              flightMs={STREAM_FLIGHT_MS}
            />
          )}
          {beat === 'harvest' && (
            <Ledger
              key="ledger"
              values={[
                { total: totalSwipes, label: content.ledger.swipes },
                { total: totalMatches, label: content.ledger.matches },
                { total: seconds, label: content.ledger.seconds },
              ]}
              startMs={STREAM_FLIGHT_MS}
              durationMs={streamStaggerMs * streamDirections.length + STREAM_FLIGHT_MS}
            />
          )}
        </AnimatePresence>

        {/* The rest of the deck, with THE ONE kept at the back. */}
        <AnimatePresence>
          {showQueue && (
            <EndingQueue
              key="queue"
              portraitSrcs={queuePortraits}
              numbers={queueNumbers}
              held={beat === 'held'}
              tags={{
                next: fillTemplate(content.queueTags.next, templateValues),
                theOne: fillTemplate(content.queueTags.theOne, templateValues),
                held: fillTemplate(content.queueTags.held, templateValues),
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* One line per beat. The visuals carry the story; this is the founder's voice. */}
      <div
        className="flex min-h-24 shrink-0 items-center justify-center px-7 pt-2 pb-3 text-center"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={beat === 'done' ? 'closer' : beat}
            className={`font-display font-black text-balance ${
              beat === 'closer' || beat === 'done'
                ? 'text-[1.7rem] leading-tight text-accent-pink'
                : 'text-[1.45rem] leading-snug text-white'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE_OUT_SOFT, delay: beat === 'intro' ? 0.5 : 0 }}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Letterhead({ text }: { text: string }) {
  return (
    <motion.header
      className="pt-safe flex shrink-0 items-center justify-between gap-4 px-6"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <img
        src="/logo.webp"
        alt="Gotta Match 'Em All"
        width={840}
        height={476}
        draggable={false}
        className="h-auto w-24 select-none opacity-90"
      />
      <p className="text-right text-[10px] font-semibold tracking-[0.22em] text-white/55 uppercase">
        {text}
      </p>
    </motion.header>
  );
}

/** A cone of light from above, a glow behind the figure, and a warm pool on the floor. */
function Spotlight({ bright }: { bright: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{ opacity: bright ? 1 : 0.45 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, white 10%, transparent), transparent 78%)',
          clipPath: 'polygon(41% 0, 59% 0, 110% 100%, -10% 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 48% at 50% 62%, color-mix(in oklab, var(--color-brand-400) 55%, transparent), transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            'radial-gradient(50% 100% at 50% 100%, color-mix(in oklab, var(--color-accent-pink) 32%, transparent), transparent 100%)',
        }}
      />
    </motion.div>
  );
}

const DUST = [
  { top: '12%', left: '36%', size: 3, delay: '0s' },
  { top: '22%', left: '61%', size: 2, delay: '0.7s' },
  { top: '35%', left: '28%', size: 2, delay: '1.3s' },
  { top: '44%', left: '70%', size: 3, delay: '0.4s' },
  { top: '58%', left: '22%', size: 2, delay: '1.6s' },
  { top: '66%', left: '77%', size: 2, delay: '1s' },
  { top: '30%', left: '48%', size: 2, delay: '2s' },
  { top: '76%', left: '40%', size: 3, delay: '0.2s' },
];

/** Specks drifting through the light beam. */
function Dust() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DUST.map(({ top, left, size, delay }) => (
        <span
          key={`${top}-${left}`}
          className="absolute animate-float rounded-full bg-white/30"
          style={{ top, left, width: size, height: size, animationDelay: delay }}
        >
          <span
            className="block h-full w-full animate-twinkle rounded-full bg-white"
            style={{ animationDelay: delay }}
          />
        </span>
      ))}
    </div>
  );
}

interface LedgerValue {
  total: number;
  label: string;
}

/** Three counters ticking up as the pile grows: what the session was worth to the company. */
function Ledger({
  values,
  startMs,
  durationMs,
}: {
  values: LedgerValue[];
  startMs: number;
  durationMs: number;
}) {
  const progress = useTimedProgress(durationMs);
  const countProgress = Math.min(
    1,
    Math.max(0, (progress * durationMs - startMs) / Math.max(1, durationMs - startMs)),
  );

  return (
    <motion.dl
      className="absolute inset-x-6 bottom-[9%] grid grid-cols-3 gap-2 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_SOFT }}
    >
      {values.map(({ total, label }) => (
        <div key={label} className="rounded-2xl bg-white/6 px-2 py-3 ring-1 ring-white/10">
          <dd className="font-display text-3xl font-black tabular-nums">
            {Math.round(countProgress * total)}
          </dd>
          <dt className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase">
            {label}
          </dt>
        </div>
      ))}
    </motion.dl>
  );
}
