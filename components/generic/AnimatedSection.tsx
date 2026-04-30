'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offsetY?: number;
  once?: boolean;
  margin?: string;
  disabled?: boolean;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  offsetY = 40,
  once = true,
  margin = '-100px',
  disabled = false,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={disabled ? undefined : { opacity: 0, y: offsetY }}
      whileInView={disabled ? undefined : { opacity: 1, y: 0 }}
      transition={
        disabled
          ? undefined
          : {
              duration,
              delay,
              type: 'spring',
              stiffness: 50,
            }
      }
      viewport={disabled ? undefined : { once, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


