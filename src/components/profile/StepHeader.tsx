import { ArrowLeftIcon } from '@/components/ui/icons';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

/** Back arrow + progress bar, as in the profile-setup mockup. */
export function StepHeader({ currentStep, totalSteps, onBack }: StepHeaderProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="flex items-center gap-4 pb-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="-ml-2 rounded-full p-2 text-ink hover:bg-brand-50"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div
        className="mx-auto h-1.5 w-28 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Profile setup progress"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep + 1}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Spacer keeps the progress bar centred. */}
      <span className="w-10" aria-hidden />
    </div>
  );
}
