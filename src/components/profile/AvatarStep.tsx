import type { PlayerAvatar } from '@/types/content';

interface AvatarStepProps {
  avatars: PlayerAvatar[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AvatarStep({ avatars, selectedId, onSelect }: AvatarStepProps) {
  return (
    <div>
      <h2 id="avatar-heading" className="text-3xl font-bold">
        Choose your look
      </h2>
      <p className="mt-2 text-sm text-ink-muted">This picture will be shown on your profile.</p>

      <div
        role="radiogroup"
        aria-labelledby="avatar-heading"
        className="mt-6 grid grid-cols-2 gap-4"
      >
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          return (
            <button
              key={avatar.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={avatar.label}
              onClick={() => onSelect(avatar.id)}
              className={[
                'aspect-square overflow-hidden rounded-3xl border-4 transition-transform active:scale-95',
                isSelected
                  ? 'border-brand-600 shadow-lg shadow-brand-900/20'
                  : 'border-transparent',
              ].join(' ')}
            >
              <img src={avatar.src} alt="" className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
