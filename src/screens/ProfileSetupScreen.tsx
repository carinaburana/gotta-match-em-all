import { useState } from 'react';

import { StageBackdrop } from '@/components/animations/StageBackdrop';
import { Screen } from '@/components/layout/Screen';
import { AvatarStep } from '@/components/profile/AvatarStep';
import { InterestStep } from '@/components/profile/InterestStep';
import { NameStep } from '@/components/profile/NameStep';
import { StepHeader } from '@/components/profile/StepHeader';
import { Button } from '@/components/ui/Button';
import { GAME_CONTENT } from '@/data';
import { GAME_CONFIG } from '@/game/config';
import type { InterestId } from '@/types/content';
import type { PlayerProfile } from '@/types/game';

const STEPS = ['name', 'interests', 'avatar'] as const;
type SetupStep = (typeof STEPS)[number];

interface ProfileSetupScreenProps {
  onComplete: (profile: PlayerProfile) => void;
  onExit: () => void;
}

/** Three-step wizard: name → exactly three interests → profile picture. */
export function ProfileSetupScreen({ onComplete, onExit }: ProfileSetupScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('');
  const [interestIds, setInterestIds] = useState<InterestId[]>([]);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const step: SetupStep = STEPS[stepIndex] ?? 'name';
  const { requiredInterestCount } = GAME_CONFIG.profile;

  const canContinue: Record<SetupStep, boolean> = {
    name: name.trim().length > 0,
    interests: interestIds.length === requiredInterestCount,
    avatar: avatarId !== null,
  };

  const goNext = () => {
    if (!canContinue[step]) return;
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    if (avatarId !== null) onComplete({ name: name.trim(), interestIds, avatarId });
  };

  const goBack = () => (stepIndex === 0 ? onExit() : setStepIndex(stepIndex - 1));

  const toggleInterest = (id: InterestId) => {
    setInterestIds((current) => {
      if (current.includes(id)) return current.filter((existing) => existing !== id);
      if (current.length >= requiredInterestCount) return current;
      return [...current, id];
    });
  };

  return (
    // Same lighting as the landing page and the teaser, running under the footer too.
    <div className="relative h-full overflow-hidden bg-canvas">
      <StageBackdrop tone="light" />
      <Screen
        className="relative"
        footer={
          <Button fullWidth disabled={!canContinue[step]} onClick={goNext}>
            {step === 'avatar' ? 'Find my match' : 'Continue'}
          </Button>
        }
      >
        <StepHeader currentStep={stepIndex} totalSteps={STEPS.length} onBack={goBack} />

        {step === 'name' && <NameStep value={name} onChange={setName} onSubmit={goNext} />}
        {step === 'interests' && (
          <InterestStep
            categories={GAME_CONTENT.interestCategories}
            selectedIds={interestIds}
            requiredCount={requiredInterestCount}
            onToggle={toggleInterest}
          />
        )}
        {step === 'avatar' && (
          <AvatarStep
            avatars={GAME_CONTENT.playerAvatars}
            selectedId={avatarId}
            onSelect={setAvatarId}
          />
        )}
      </Screen>
    </div>
  );
}
