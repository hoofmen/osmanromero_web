export interface BioEntry {
  id: string
  title: string
  content: string
  category: 'about' | 'experience' | 'skills' | 'projects' | 'contact'
}

export const bioEntries: BioEntry[] = [
  {
    id: 'target-about',
    title: 'About Me',
    content: 'PLACEHOLDER — I will fill this in. A brief intro about who I am, what drives me, and why I built a Quake-style portfolio site.',
    category: 'about',
  },
  {
    id: 'target-experience-1',
    title: 'Experience',
    content: 'PLACEHOLDER — Professional experience, roles, and achievements. The journey so far.',
    category: 'experience',
  },
  {
    id: 'target-skills',
    title: 'Skills & Tech',
    content: 'PLACEHOLDER — Languages, frameworks, tools, and technologies I work with.',
    category: 'skills',
  },
  {
    id: 'target-project-1',
    title: 'Project: Arena',
    content: 'PLACEHOLDER — This very site! A Quake 3 defrag-inspired portfolio built with React, Three.js, and Rapier physics.',
    category: 'projects',
  },
  {
    id: 'target-project-2',
    title: 'Project: Two',
    content: 'PLACEHOLDER — Another notable project. Description, tech stack, and impact.',
    category: 'projects',
  },
  {
    id: 'target-experience-2',
    title: 'Education',
    content: 'PLACEHOLDER — Education background, certifications, and continuous learning.',
    category: 'experience',
  },
  {
    id: 'target-contact',
    title: 'Contact',
    content: 'PLACEHOLDER — How to reach me. Email, GitHub, LinkedIn, and other links.',
    category: 'contact',
  },
]
