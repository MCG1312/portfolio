import React from 'react';

export const BlockProgress: React.FC<{ value: number }> = ({ value }) => {
  const blocks = 20;
  const activeBlocks = Math.floor((value / 100) * blocks);
  
  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: blocks }).map((_, i) => (
        <div 
          key={i} 
          className={`h-2 flex-1 transition-all duration-500 delay-[${i * 20}ms] ${i < activeBlocks ? 'bg-white' : 'bg-neutral-900'}`}
        />
      ))}
    </div>
  );
};