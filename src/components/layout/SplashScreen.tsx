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
            {/* Centered Content: Logo is positioned a bit above the absolute center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3">
                {/* Using a standard <img> tag to bypass Next.js Image optimization for reliability */}
                <img
                    src="https://res.cloudinary.com/dr0weongo/image/upload/v1751543333/fine-coding-logo.png"
                    alt="Fine Coding Logo"
                    className="h-64 w-64" // Equivalent to width/height 256
                    loading="eager" // Similar to priority=true
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
