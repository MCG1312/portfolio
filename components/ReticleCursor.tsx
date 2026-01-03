import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ReticleCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const startClick = () => setClicked(true);
    const endClick = () => setClicked(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', startClick);
    window.addEventListener('mouseup', endClick);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', startClick);
      window.removeEventListener('mouseup', endClick);
    };
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      style={{ left: position.x, top: position.y }}
    >
      <motion.div 
        className="absolute -top-3 -left-3 w-6 h-6 border border-white rounded-full flex items-center justify-center"
        animate={{ scale: clicked ? 0.8 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        <div className="w-0.5 h-0.5 bg-white rounded-full" />
      </motion.div>
      {/* Target Lines */}
      <div className="absolute top-0 -left-4 w-2 h-[1px] bg-white opacity-50" />
      <div className="absolute top-0 right-2 w-2 h-[1px] bg-white opacity-50" />
      <div className="absolute -top-4 left-0 w-[1px] h-2 bg-white opacity-50" />
      <div className="absolute bottom-2 left-0 w-[1px] h-2 bg-white opacity-50" />
    </div>
  );
};