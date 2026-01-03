import React from 'react';
import { motion } from 'framer-motion';

const DATA_STREAM = [
  "SYSTEM_STATUS: ACTIVE",
  "PACKET_INSPECTION: ON",
  "THREAT_LEVEL: LOW",
  "ENCRYPTION: AES-256-GCM",
  "FIREWALL_RULES: UPDATED",
  "PORT_SCAN: NEGATIVE",
  "INTEGRITY_CHECK: PASSED",
  "VPN_TUNNEL: ESTABLISHED",
  "IDS/IPS: MONITORING",
  "AUTH_TOKEN: VALID",
];

export const DataTicker: React.FC = () => {
  return (
    <div className="fixed top-0 right-0 z-50 overflow-hidden w-64 h-full pointer-events-none opacity-50 mix-blend-difference hidden md:block">
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
        <div className="w-2 h-2 bg-white animate-pulse" />
        {DATA_STREAM.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: [0.3, 1, 0.3], x: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              repeatType: "reverse"
            }}
            className="text-[8px] font-mono-tech text-right text-white tracking-widest uppercase"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
};