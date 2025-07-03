'use client';

import { motion } from 'framer-motion';

// The animation is controlled by layout.tsx using AnimatePresence
export function SplashScreen() {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1A1A]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
        >
            {/* Centered Content: This div now acts as the circular frame */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 h-48 w-48 rounded-full overflow-hidden border-2 border-gray-700">
                <img
                    src="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg"
                    alt="Fine Coding Logo"
                    className="h-full w-full scale-110"
                    loading="eager"
                    data-ai-hint="logo tech"
                />
            </div>

            {/* Footer text at the bottom */}
            <div className="absolute bottom-12 text-center">
                <p className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 bg-clip-text text-lg font-semibold text-transparent">
                    Powered by BeRegen ®
                </p>
                <p className="text-xs text-gray-500 mt-1">All rights reserved</p>
            </div>
        </motion.div>
    );
}
