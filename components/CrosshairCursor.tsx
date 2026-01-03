import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CrosshairCursor: React.FC = () => {
  const [hovering, setHovering] = useState(false);
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setHovering(target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') !== null);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div 
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-exclusion flex items-center justify-center"
      style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
    >
       {/* Crosshair */}
       <motion.div 
         animate={{ 
            width: hovering ? 40 : 20, 
            height: hovering ? 40 : 20,
            rotate: hovering ? 45 : 0
         }}
         className="border border-white/80 relative transition-all duration-200"
       >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white" />
       </motion.div>
       
       {/* Axis Lines */}
       <div className="absolute w-[200vw] h-[0.5px] bg-white/10" />
       <div className="absolute h-[200vh] w-[0.5px] bg-white/10" />
    </motion.div>
  );
};