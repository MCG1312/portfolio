import React from 'react';
import { Project } from '../types';
import { ScrambleText } from './ScrambleText';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative border border-[#222] bg-black p-8 overflow-hidden hover:border-white/50 transition-colors duration-300">
      {/* Hex Background Reveal */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300 font-mono text-[8px] break-all leading-none z-0">
        {Array(2000).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join('')}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
         <div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-1 py-0.5">
                  ID_{project.id}
               </span>
               <span className="w-2 h-2 bg-neutral-800 group-hover:bg-green-500 transition-colors" />
            </div>
            <h3 className="text-2xl font-light mb-2 text-white">
               <ScrambleText text={project.title} />
            </h3>
            <p className="text-sm text-neutral-500 font-mono mb-6 leading-relaxed">
               {project.description}
            </p>
         </div>
         
         <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
               <span key={tech} className="text-[10px] uppercase font-mono text-neutral-400 bg-neutral-900 px-2 py-1">
                  {tech}
               </span>
            ))}
         </div>
      </div>
    </div>
  );
};