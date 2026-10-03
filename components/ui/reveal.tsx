'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

export function Reveal({ delay = 0, y = 24, className, children, ...p }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...p}
    >
      {children}
    </motion.div>
  );
}
