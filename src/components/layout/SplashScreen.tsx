'use client';

import { motion } from 'framer-motion';

const logoVariants = {
  hidden: { 
    filter: 'blur(12px)',
    opacity: 0,
    scale: 1.1,
  },
  visible: { 
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2,
      ease: [0.25, 1, 0.5, 1],
    }
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 1,
      ease: 'easeOut'
    }
  }
}

interface SplashScreenProps {
  onExitComplete: () => void;
}

export function SplashScreen({ onExitComplete }: SplashScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#1A1A1A]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            onAnimationComplete={onExitComplete}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]">
              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
              >
                  <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gray-700">
                      <img
                          src="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg"
                          alt="Fine Coding Logo"
                          className="h-full w-full scale-110"
                          loading="eager"
                          data-ai-hint="logo tech"
                      />
                  </div>
              </motion.div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                  <p className="animate-text-shine bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-lg font-semibold text-transparent">
                      Powered by BeRegen ®
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All rights reserved</p>
              </motion.div>
            </div>
        </motion.div>
    );
}
