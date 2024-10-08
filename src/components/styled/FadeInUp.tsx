'use client';

import { motion, useInView } from 'framer-motion';
import React, { ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
  index?: number;
  className?: string;
}
export function FadeInUp({ children, index = 1, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref}>
      {isInView && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index / 5 + (index > 0 ? index / 20 : 0),
          }}
          className={className}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
}
