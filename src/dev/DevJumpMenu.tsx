import { useState } from 'react';

import { DEV_JUMP_TARGETS, type DevJumpTarget } from '@/dev/devJump';
import type { AppState } from '@/types/app';

/** DEV ONLY: a small floating menu to jump to any screen. Rendered only in `npm run dev`. */
export function DevJumpMenu({ onJump }: { onJump: (state: AppState) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const targets = Object.keys(DEV_JUMP_TARGETS) as DevJumpTarget[];

  return (
    <div className="fixed bottom-3 left-3 z-50 flex flex-col items-start gap-1 font-mono text-xs">
      {isOpen &&
        targets.map((target) => (
          <button
            key={target}
            type="button"
            className="rounded-md bg-ink px-3 py-1.5 text-white shadow-lg hover:bg-brand-700"
            onClick={() => {
              onJump(DEV_JUMP_TARGETS[target].state());
              setIsOpen(false);
            }}
          >
            → {DEV_JUMP_TARGETS[target].label}
          </button>
        ))}
      <button
        type="button"
        className="rounded-md bg-ink/80 px-3 py-1.5 font-bold text-white shadow-lg"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        DEV {isOpen ? '▾' : '▸'}
      </button>
    </div>
  );
}
