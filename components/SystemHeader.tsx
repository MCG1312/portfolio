import React, { useState, useEffect } from 'react';

export const SystemHeader: React.FC = () => {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().split('T')[1].split('.')[0] + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-12 border-b border-neutral-900 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 font-mono text-[10px] tracking-widest text-white uppercase select-none">
       {/* Left: Security Protocols */}
       <div className="flex items-center gap-6 w-1/3 text-neutral-500">
         <div className="flex items-center gap-2" title="Content Security Policy">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="hidden md:inline">CSP: STRICT</span>
         </div>
         <div className="hidden md:flex items-center gap-2" title="XSS Protection">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>XSS: BLOCK</span>
         </div>
       </div>

       {/* Center: System Clock */}
       <div className="flex items-center justify-center w-1/3">
         <span className="text-neutral-600 mr-2">SYS.TIME</span>
         <span className="text-emerald-500">{time}</span>
       </div>

       {/* Right: Network Status */}
       <div className="flex items-center justify-end gap-4 w-1/3">
         <span className="hidden md:inline text-neutral-600">ENCRYPTION</span>
         <span className="bg-emerald-950 text-emerald-500 border border-emerald-900/50 px-2 py-0.5 rounded text-[9px]">TLS 1.3</span>
       </div>
    </header>
  );
};