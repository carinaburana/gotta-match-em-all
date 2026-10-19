import { motion } from 'motion/react';

import { LandingTitleAnimation } from '@/components/animations/LandingTitleAnimation';
import { Button } from '@/components/ui/Button';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <LandingTitleAnimation
      footer={
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
        >
          {/* A gentle, occasional pulse invites the tap. */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ delay: 2.4, duration: 0.7, repeat: Infinity, repeatDelay: 2.6 }}
          >
            <Button fullWidth onClick={onStart}>
              Start
            </Button>
          </motion.div>
        </motion.div>
      }
    >
      <p className="max-w-64 text-ink-muted">
        Start matching to find “The One” before the time runs out!
      </p>
    </LandingTitleAnimation>
  );
}
