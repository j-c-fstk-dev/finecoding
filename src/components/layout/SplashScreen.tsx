'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { LogoMark } from '@/components/icons/LogoMark';

const NAME = 'fine_coding';

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
  },
};

interface SplashScreenProps {
  onExitComplete: () => void;
}

/** Terminal-style boot screen: logo, the name being "typed", a boot line. */
export function SplashScreen({ onExitComplete }: SplashScreenProps) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => {
      const timer = setInterval(() => {
        setTyped((n) => {
          if (n >= NAME.length) {
            clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, 55);
    }, 350);
    return () => clearTimeout(start);
  }, []);

  const done = typed >= NAME.length;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={onExitComplete}
    >
      <motion.div variants={logoVariants} initial="hidden" animate="visible">
        <LogoMark glow className="h-24 w-24" title="Fine Coding" />
      </motion.div>

      <div className="mt-7 h-7 font-mono text-xl font-medium text-foreground" aria-label={NAME}>
        {NAME.slice(0, typed)}
        <span className="terminal-cursor" aria-hidden="true" />
      </div>

      <div className="mt-3 h-4 font-mono text-xs text-muted-foreground/70">
        {done && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <span className="text-phosphor">✓</span> booting… ok
          </motion.span>
        )}
      </div>

      <div className="absolute bottom-10 font-mono text-xs text-muted-foreground/60">Powered by BeRegen®</div>
    </motion.div>
  );
}
