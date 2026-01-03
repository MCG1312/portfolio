import React, { useState, useEffect } from 'react';

export const TypingHeader: React.FC = () => {
  const text = "MEHDI OUMASSAD";
  const [display, setDisplay] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setDisplay(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(typing);
    }, 100);

    const blink = setInterval(() => setCursor(c => !c), 500);

    return () => {
      clearInterval(typing);
      clearInterval(blink);
    };
  }, []);

  return (
    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">
      {display}
      <span className={`${cursor ? 'opacity-100' : 'opacity-0'} text-green-500`}>_</span>
    </h1>
  );
};