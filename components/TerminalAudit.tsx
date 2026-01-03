import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AuditLine {
  label: string;
  status: string;
  details: string;
  bar?: number;
}

const DATA: AuditLine[] = [
  { label: "NETWORK_SECURITY", status: "HARDENED", details: "LEVEL: 95%", bar: 95 },
  { label: "VULNERABILITY_OPS", status: "ACTIVE", details: "DETECTION_RATE: HIGH" },
  { label: "SYSTEM_SECURITY", status: "SECURE", details: "KERNEL: LINUX/HARDENED" },
  { label: "PENETRATION_TEST", status: "READY", details: "TOOLS: NMAP, METASPLOIT, BURP" },
  { label: "FULL_STACK_ENG", status: "OPTIMIZED", details: "REACT, NODE, THREE.JS", bar: 90 },
];

const ProgressBar = ({ value }: { value: number }) => {
  const total = 10;
  const filled = Math.floor(value / 10);
  return (
    <span className="text-emerald-500 ml-2 tracking-tighter">
      [{Array(total).fill(0).map((_, i) => (i < filled ? '■' : '□')).join('')}]
    </span>
  );
};

export const TerminalAudit: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [checksum, setChecksum] = useState("0x00000000");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (hovered !== null) {
      interval = setInterval(() => {
        setChecksum("0x" + Math.floor(Math.random()*4294967295).toString(16).toUpperCase().padStart(8, '0'));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <div className="w-full font-mono text-xs md:text-sm shadow-2xl">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between bg-neutral-900/90 border border-white border-b-0 p-2 rounded-t-sm select-none backdrop-blur-sm">
        <div className="flex gap-2 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] hover:brightness-110 transition-all" />
        </div>
        <div className="text-neutral-500 text-[10px] tracking-wider font-bold">root@mehdi-oumassad:~# nmap -sV localhost</div>
        <div className="w-12" />
      </div>

      {/* Terminal Body */}
      <div className="border border-white bg-[#020202]/80 backdrop-blur-sm p-6 min-h-[400px] relative overflow-hidden rounded-b-sm">
         {/* CRT Scanline / Noise Overlay */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
         <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

         <div className="space-y-2 relative z-10">
            <div className="text-neutral-500 mb-8 leading-relaxed font-mono text-[11px] md:text-xs">
                Starting Nmap 7.94 at {new Date().toISOString().split('T')[0]} 14:02 UTC...<br/>
                Nmap scan report for localhost (127.0.0.1)<br/>
                Host is up (0.000042s latency).<br/>
                <span className="text-emerald-900">rDNS record for 127.0.0.1: localhost</span>
            </div>

            <div className="grid grid-cols-[1fr] gap-1">
               <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] text-[10px] text-neutral-600 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-widest">
                  <span>SERVICE / SKILL</span>
                  <span>VERSION / STATUS</span>
               </div>
               
               <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
               >
                    {DATA.map((item, i) => (
                        <motion.div 
                            key={i}
                            variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            className="group grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-center py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-crosshair"
                        >
                            <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-tight group-hover:text-white transition-colors">
                                <span className="opacity-50 text-[10px] mr-1 hidden md:inline">{i + 20}/tcp</span>
                                {item.label}
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between text-neutral-400 text-xs pr-4 relative">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                   <span className={item.status === 'HARDENED' || item.status === 'SECURE' ? 'text-emerald-400' : ''}>
                                     STATUS: {item.status}
                                   </span>
                                   <span className="hidden md:inline text-neutral-600">|</span>
                                   <span>{item.details}</span>
                                   {item.bar && <ProgressBar value={item.bar} />}
                                </div>

                                {/* Hover Checksum - Absolute on mobile to not shift layout, Relative on Desktop */}
                                <div className={`font-mono text-[10px] text-emerald-500 transition-opacity duration-200 ${hovered === i ? 'opacity-100' : 'opacity-0'} md:ml-auto mt-1 md:mt-0`}>
                                    CHECKSUM: {checksum}
                                </div>
                            </div>
                        </motion.div>
                    ))}
               </motion.div>
            </div>

            <div className="mt-8 flex items-center text-emerald-500 font-bold">
                <span className="mr-2">root@mehdi:~#</span>
                <span className="animate-pulse bg-emerald-500 w-2.5 h-5 block shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>
         </div>
      </div>
    </div>
  );
};