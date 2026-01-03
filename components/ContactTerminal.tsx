import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from './ScrambleText';
import { SecureUplink } from '../utils/secureUplink';

export const ContactTerminal: React.FC = () => {
  const [formState, setFormState] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    identity: '',
    frequency: '', // Email
    message: '',
    _honey: '' // Honeypot field
  });

  const addLog = (msg: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const prefix = type === 'error' ? 'ERR' : type === 'success' ? 'OK' : type === 'warning' ? 'WARN' : 'SYS';
    const color = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-emerald-500' : type === 'warning' ? 'text-amber-500' : 'text-emerald-500/70';
    setLogs(prev => [...prev, `<span class="${color}">[${prefix}]</span> ${new Date().toISOString().split('T')[1].split('.')[0]} :: ${msg}`]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === 'SENDING') return;

    setFormState('SENDING');
    
    try {
        addLog("INITIATING ZOD VALIDATION PROTOCOL...");
        
        const response = await SecureUplink.transmit(formData);

        if (response.status === 201) {
             addLog("ENCRYPTING PAYLOAD...", 'info');
             addLog(response.message, 'success');
             setFormState('SUCCESS');
        } else {
             // Handle 400/429/500 errors gracefully
             addLog(response.message, 'error');
             setFormState('ERROR');
        }

    } catch (err: any) {
        setFormState('ERROR');
        addLog(`FATAL_EXCEPTION: ${err.message}`, 'error');
    }
  };

  return (
    <div className="border border-neutral-800 bg-black p-0 md:p-1 relative overflow-hidden h-full min-h-[500px] flex flex-col md:flex-row">
      
      {/* LEFT: SECURE INPUT INTERFACE */}
      <div className="w-full md:w-1/2 p-8 border-r border-neutral-800 flex flex-col relative z-10 bg-black">
        <h3 className="text-xl font-light mb-8 flex items-center gap-4 text-emerald-500">
            <span className="text-xs font-mono text-emerald-900">04</span>
            <ScrambleText text="SECURE UPLINK" />
        </h3>

        {formState === 'SUCCESS' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 text-2xl animate-pulse">
               ✓
             </div>
             <h4 className="text-xl tracking-widest text-emerald-500 font-mono">PAYLOAD DELIVERED</h4>
             <p className="text-xs font-mono text-neutral-500">Message stored in secure Supabase vault.</p>
             <button 
                onClick={() => { setFormState('IDLE'); setFormData({ identity: '', frequency: '', message: '', _honey: '' }); }}
                className="mt-8 text-xs underline decoration-neutral-700 hover:text-white"
             >
                ESTABLISH_NEW_LINK
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-mono text-sm relative">
            {/* HONEYPOT FIELD (Visually Hidden but accessible to bots) */}
            <input 
                type="text" 
                name="_honey" 
                value={formData._honey}
                onChange={e => setFormData({...formData, _honey: e.target.value})}
                className="opacity-0 absolute -z-10 w-0 h-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="group">
              <label className="block text-[10px] text-neutral-500 mb-2 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                // IDENTITY_STRING
              </label>
              <input 
                type="text" 
                value={formData.identity}
                onChange={e => setFormData({...formData, identity: e.target.value})}
                className="w-full bg-transparent border-b border-neutral-800 text-white focus:border-emerald-500 py-2 focus:outline-none transition-colors placeholder-neutral-800"
                placeholder="USER_ID"
                required
              />
            </div>

            <div className="group">
              <label className="block text-[10px] text-neutral-500 mb-2 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                // COMM_FREQUENCY
              </label>
              <input 
                type="email" 
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.target.value})}
                className="w-full bg-transparent border-b border-neutral-800 text-white focus:border-emerald-500 py-2 focus:outline-none transition-colors placeholder-neutral-800"
                placeholder="TARGET_ADDRESS"
                required
              />
            </div>

            <div className="group">
              <label className="block text-[10px] text-neutral-500 mb-2 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                // DATA_PACKET
              </label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-transparent border-b border-neutral-800 text-white focus:border-emerald-500 py-2 focus:outline-none transition-colors placeholder-neutral-800 resize-none"
                placeholder="INSERT_DATA..."
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={formState === 'SENDING'}
              className="mt-4 border border-emerald-900/50 bg-emerald-950/10 text-emerald-500 py-4 text-xs tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-2 group-hover:gap-4"
            >
              {formState === 'SENDING' ? 'ENCRYPTING...' : 'EXECUTE_TRANSMISSION'}
            </button>

            <div className="mt-4 text-[9px] text-neutral-600 font-mono text-center">
                SECURE PROTOCOL V.2.0 // SSL_PINNING: ACTIVE
            </div>
          </form>
        )}
      </div>

      {/* RIGHT: LIVE KERNEL LOGS */}
      <div className="w-full md:w-1/2 bg-[#020202] relative font-mono text-[10px] p-8 overflow-hidden">
        {/* Matrix Rain Background Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        <div className="mb-4 text-emerald-700 flex justify-between border-b border-emerald-900/30 pb-2">
           <span>KERNEL_PANIC_LOG</span>
           <span className="animate-pulse text-emerald-500">● SECURE</span>
        </div>

        <div ref={scrollRef} className="h-full overflow-y-auto space-y-1 pb-12 font-mono scrollbar-hide">
            <div className="text-emerald-900 opacity-50">
               Initializing Supabase client...<br/>
               Loading Zod schema definitions...<br/>
               Honeypot protection active.<br/>
               Ready for input.<br/>
               --------------------------------
            </div>
            {logs.map((log, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-2 border-emerald-500/20 pl-2 py-0.5 text-emerald-500/90 break-all"
                    dangerouslySetInnerHTML={{ __html: log }}
                />
            ))}
            {formState === 'SENDING' && (
                <div className="animate-pulse text-emerald-500">_</div>
            )}
        </div>
      </div>
    </div>
  );
};