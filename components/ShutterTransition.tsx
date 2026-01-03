import React from 'react';
import { motion } from 'framer-motion';

export const ShutterTransition: React.FC = () => {
  const columns = 12; // Matches grid
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex w-full h-full">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: "100%" }}
          animate={{ height: "0%" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1], // Custom heavy ease
            delay: i * 0.05,
          }}
          className="flex-1 bg-white border-r border-neutral-900 last:border-r-0"
        />
      ))}
    </div>
  );
};