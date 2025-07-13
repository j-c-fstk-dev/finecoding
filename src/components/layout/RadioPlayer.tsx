
'use client';

import { useRadio } from "@/hooks/use-radio";
import { motion, AnimatePresence } from "framer-motion";
import { X, Radio as RadioIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RadioPlayer() {
  const { isPlaying, closeRadio } = useRadio();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 w-[300px] h-[200px] rounded-lg shadow-2xl bg-card border border-border/50 overflow-hidden"
        >
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-background/50 hover:bg-background/80"
              onClick={closeRadio}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close Radio</span>
            </Button>
          </div>

          <div className="absolute inset-0 z-0">
             <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
