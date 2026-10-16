import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { screenVariants } from '@/components/animations/variants';

/** Wrap each screen in this inside an <AnimatePresence mode="wait">. */
export function ScreenTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
