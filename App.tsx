import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import { HeroArtifact } from './components/HeroArtifact';
import { CrosshairCursor } from './components/CrosshairCursor';
import { LiveTicker } from './components/LiveTicker';
import { Sidebar } from './components/Sidebar';
import { ScrambleText } from './components/ScrambleText';
import { MagneticText } from './components/MagneticText';
import { ProjectCard } from './components/ProjectCard';
import { ContactTerminal } from './components/ContactTerminal';
import { SystemHeader } from './components/SystemHeader';
import { TerminalAudit } from './components/TerminalAudit';
import { Project } from './types';

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'SECURITY LABS',
    category: 'Analysis',
    description: 'Enterprise-grade simulation environment for testing zero-day exploits and patch verification.',
    tech: ['DOCKER', 'PYTHON', 'WIRESHARK']
  },
  {
    id: '02',
    title: 'WEB VULNERABILITY',
    category: 'Audit',
    description: 'Automated scanner detecting SQLi, XSS, and CSRF vulnerabilities in legacy web applications.',
    tech: ['NODE.JS', 'PUPPETEER', 'OWASP']
  },
  {
    id: '03',
    title: 'SECURE APPS',
    category: 'DevSecOps',
    description: 'End-to-end encrypted messaging platform featuring self-destructing data packets.',
    tech: ['REACT', 'SIGNAL_PROTOCOL', 'REDIS']
  }
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white bg-blueprint selection:bg-emerald-500 selection:text-black">
      <SystemHeader />
      <CrosshairCursor />
      <LiveTicker />
      <Sidebar />

      {/* Main Content Area */}
      <main className="pl-0 md:pl-20 pt-12 relative">
        
        {/* HERO SECTION - 100vh */}
        <section className="h-[calc(100vh-48px)] w-full relative flex flex-col md:flex-row border-b border-[#222]">
          {/* Left: Typography (Reduced width to give 3D more space) */}
          <div className="w-full md:w-2/5 p-12 flex flex-col justify-center z-10 relative pointer-events-none md:pointer-events-auto">
             <h2 className="text-sm font-mono text-emerald-500/70 mb-8 tracking-widest">
               <ScrambleText text="IDENTITY_VERIFIED" />
             </h2>
             
             {/* Magnetic Text Interaction */}
             <MagneticText>
                <h1 className="text-6xl md:text-8xl font-thin tracking-tighter leading-none mb-6">
                  MEHDI<br />OUMASSAD
                </h1>
             </MagneticText>

             <div className="h-[1px] w-24 bg-emerald-500 mb-6" />
             <p className="font-mono text-sm text-neutral-400 max-w-sm leading-relaxed mb-8">
               Specialist in digital fortification. Building resilient systems against asymmetric threats.
             </p>

             {/* Social Media Links */}
             <div className="flex flex-wrap gap-4 pointer-events-auto">
                <a 
                  href="https://www.linkedin.com/in/mehdi-oumassad-0b71841a7/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-neutral-500 group-hover:bg-emerald-500 transition-colors" />
                  <span className="font-mono text-xs tracking-widest text-neutral-400 group-hover:text-emerald-500">LINKEDIN</span>
                </a>
                <a 
                  href="https://github.com/MCG1312" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-neutral-500 group-hover:bg-emerald-500 transition-colors" />
                  <span className="font-mono text-xs tracking-widest text-neutral-400 group-hover:text-emerald-500">GITHUB</span>
                </a>
             </div>
          </div>

          {/* Right: The High-End 3D Artifact (Expanded Width) */}
          <div className="absolute inset-0 md:relative md:w-3/5 h-full z-0 overflow-hidden">
             <Canvas 
                gl={{ antialias: true, alpha: true }} 
                camera={{ position: [0, 0, 5], fov: 45 }} // Moved camera closer (was 6)
                className="w-full h-full"
             >
                <Suspense fallback={null}>
                   <PresentationControls 
                      global 
                      zoom={1.0} 
                      rotation={[0, -Math.PI / 4, 0]} 
                      polar={[-Math.PI / 4, Math.PI / 4]} 
                      azimuth={[-Math.PI / 4, Math.PI / 4]}
                      config={{ mass: 2, tension: 500 }}
                      snap={{ mass: 4, tension: 1500 }}
                   >
                      <HeroArtifact />
                   </PresentationControls>
                </Suspense>
             </Canvas>
          </div>
          
          {/* Overlay Grid Info */}
          <div className="absolute bottom-8 right-8 font-mono text-[10px] text-neutral-600 hidden md:block pointer-events-none">
             COORDS: 34.0522° N, 118.2437° W <br/>
             SECTOR: 7G // ZONE_EXPANDED
          </div>
        </section>

        {/* ABOUT & ARSENAL SECTION */}
        <section id="about" className="flex flex-col md:flex-row border-b border-[#222]">
           {/* About Text */}
           <div id="about" className="w-full md:w-1/2 p-12 md:p-24 border-b md:border-b-0 md:border-r border-[#222]">
              <h3 className="text-xl font-light mb-8 flex items-center gap-4">
                 <span className="text-xs font-mono text-neutral-500">01</span>
                 <ScrambleText text="ABOUT THE SPECIALIST" />
              </h3>
              <p className="text-neutral-400 leading-8 font-light text-lg">
                 I operate at the intersection of offensive security and infrastructure engineering. 
                 My mission is to deconstruct complex systems to identify critical vulnerabilities before they can be exploited.
                 I don't just patch holes; I redesign the fabric of the network to be inherently secure.
              </p>
           </div>
           
           {/* Arsenal (Skills) - NOW REPLACED WITH TERMINAL AUDIT */}
           <div id="arsenal" className="w-full md:w-1/2 p-12 md:p-24 bg-neutral-900/10">
              <h3 className="text-xl font-light mb-12 flex items-center gap-4">
                 <span className="text-xs font-mono text-neutral-500">02</span>
                 <ScrambleText text="SYSTEM SPECIFICATIONS" />
              </h3>
              
              <TerminalAudit />
           </div>
        </section>

        {/* LOGS (PROJECTS) SECTION */}
        <section id="logs" className="p-12 md:p-24 border-b border-[#222]">
           <h3 className="text-xl font-light mb-16 flex items-center gap-4">
               <span className="text-xs font-mono text-neutral-500">03</span>
               <ScrambleText text="BREACH REPORTS" />
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROJECTS.map((project) => (
                 <ProjectCard key={project.id} project={project} />
              ))}
           </div>
        </section>

        {/* CONTACT TERMINAL SECTION */}
        <section id="contact" className="p-12 md:p-24 pb-32">
           <ContactTerminal />
        </section>

      </main>
    </div>
  );
};

export default App;