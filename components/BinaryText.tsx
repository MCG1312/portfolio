import React, { useState, useEffect } from 'react';

interface BinaryTextProps {
  text: string;
  className?: string;
  revealDelay?: number;
}

export const BinaryText: React.FC<BinaryTextProps> = ({ text, className, revealDelay = 0 }) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      // Wait for delay
      if (iteration < -1 * (revealDelay / 30)) {
        iteration++;
        return;
      }

      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return Math.random() > 0.5 ? "0" : "1";
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 2; // Speed of reveal
    }, 30);

    return () => clearInterval(interval);
  }, [text, revealDelay]);

  return <span className={className}>{display}</span>;
};