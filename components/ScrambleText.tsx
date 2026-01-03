import React, { useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!<>[]";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className, delay = 0 }) => {
  const [display, setDisplay] = useState(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView && !started) {
      setTimeout(() => setStarted(true), delay);
    }
  }, [isInView, delay, started]);

  useEffect(() => {
    if (!started) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [started, text]);

  return <span ref={ref} className={className}>{display}</span>;
};