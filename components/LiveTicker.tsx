import React, { useEffect, useState } from 'react';

const MESSAGES = [
  "SCANNING_NETWORK...",
  "THREAT_LEVEL: NULL",
  "ENCRYPTION: AES-256",
  "FIREWALL: ACTIVE",
  "IP_SPOOF: DETECTED",
  "PACKET_LOSS: 0.0%",
  "PORT_22: OPEN",
  "ROOT_ACCESS: GRANTED"
];

export const LiveTicker: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-8 left-8 md:left-24 z-50 font-mono text-[10px] text-white/70 flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="tracking-widest">[{MESSAGES[msgIndex]}]</span>
    </div>
  );
};