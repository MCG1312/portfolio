import React, { useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string;
}

export const MagneticText: React.FC<MagneticTextProps> = ({ children, className }) => {
  // Springs for smooth movement lag
  const x = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from center of screen (-1 to 1)
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Apply subtle movement range (e.g., move 20px max)
      x.set(normalizedX * 15); 
      y.set(normalizedY * 15);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
};