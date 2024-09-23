'use client';

import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

interface Props {
  text: string;
  lineNum?: number;
  className?: string;
}
export function TextFadeIn({ text, lineNum = 1, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const strArr: string[] = [];

  text.split(' ').forEach((el) => {
    el.split('').forEach((c) => strArr.push(c));
    strArr.push(' ');
  });

  return (
    <span ref={ref} className={className}>
      {isInView &&
        strArr.map((el, i) => (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.2,
              delay: i / 50 + lineNum / 2,
            }}
            key={i}
          >
            {el}
          </motion.span>
        ))}
    </span>
  );
}
