import React from 'react';
import { Section } from '../types';

export const Sidebar: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 md:w-20 border-r border-[#222] bg-black z-40 hidden md:flex flex-col justify-between items-center py-12">
       <div className="text-[10px] font-mono rotate-[-90deg] whitespace-nowrap text-neutral-500">
         SYS_V.4.0.1
       </div>
       
       <div className="flex flex-col gap-12 font-mono text-xs tracking-widest [writing-mode:vertical-rl] items-center">
         <button onClick={() => scrollTo('about')} className="hover:text-white text-neutral-600 transition-colors uppercase flex items-center gap-2">
            <span>01</span> ABOUT
         </button>
         <button onClick={() => scrollTo('arsenal')} className="hover:text-white text-neutral-600 transition-colors uppercase flex items-center gap-2">
            <span>02</span> ARSENAL
         </button>
         <button onClick={() => scrollTo('logs')} className="hover:text-white text-neutral-600 transition-colors uppercase flex items-center gap-2">
            <span>03</span> LOGS
         </button>
         <button onClick={() => scrollTo('contact')} className="hover:text-white text-neutral-600 transition-colors uppercase flex items-center gap-2">
            <span>04</span> UPLINK
         </button>
       </div>

       <div className="w-[1px] h-12 bg-neutral-800" />
    </div>
  );
};