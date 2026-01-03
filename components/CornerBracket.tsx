import React from 'react';

export const CornerBracket: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-4 h-[1px] bg-white" />
      <div className="absolute top-0 left-0 w-[1px] h-4 bg-white" />
      
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-4 h-[1px] bg-white" />
      <div className="absolute top-0 right-0 w-[1px] h-4 bg-white" />
      
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-white" />
      <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-white" />
      
      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-white" />
      <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-white" />
    </div>
  );
};