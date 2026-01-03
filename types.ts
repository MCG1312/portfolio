export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  details: string;
}

export enum Section {
  HERO = 'HERO',
  PROJECTS = 'PROJECTS',
  ABOUT = 'ABOUT',
}