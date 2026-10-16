import type { InterestCategory, InterestId } from '@/types/content';

interface InterestStepProps {
  categories: InterestCategory[];
  selectedIds: InterestId[];
  requiredCount: number;
  onToggle: (id: InterestId) => void;
}

/** Interest picker grouped by top-level category. Exactly `requiredCount` must be selected. */
export function InterestStep({
  categories,
  selectedIds,
  requiredCount,
  onToggle,
}: InterestStepProps) {
  const isFull = selectedIds.length >= requiredCount;

  return (
    <div>
      <h2 className="text-3xl font-bold">Pick your interests</h2>
      <p className="mt-2 text-sm text-ink-muted" aria-live="polite">
        Choose exactly {requiredCount}.{' '}
        <span className="font-semibold text-brand-600">
          {selectedIds.length} / {requiredCount} selected
        </span>
      </p>

      <div className="mt-6 flex flex-col gap-6 pb-4">
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`category-${category.id}`}>
            <h3 id={`category-${category.id}`} className="text-sm font-semibold text-ink-muted">
              {category.label}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {category.interests.map((interest) => {
                const isSelected = selectedIds.includes(interest.id);
                return (
                  <li key={interest.id}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      disabled={!isSelected && isFull}
                      onClick={() => onToggle(interest.id)}
                      className={[
                        'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors',
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-line bg-surface text-ink hover:border-brand-400',
                        'disabled:opacity-40',
                      ].join(' ')}
                    >
                      {interest.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
