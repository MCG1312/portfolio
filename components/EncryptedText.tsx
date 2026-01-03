import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface EncryptedTextProps {
  text: string;
  className?: string;
  scrambleDuration?: number; // ms
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export const EncryptedText: React.FC<EncryptedTextProps> = ({ text, className, scrambleDuration = 600 }) => {
  const [display, setDisplay] = useState(text);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrambleDuration, 1);
        
        setDisplay(
          text.split("").map((char, i) => {
            if (char === " ") return " ";
            if (progress * text.length > i) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );

        if (progress >= 1) clearInterval(interval);
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [isInView, hasAnimated, text, scrambleDuration]);

  return <span ref={ref} className={className}>{display}</span>;
};