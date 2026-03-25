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
    content: '<p>I\'m a <em>human</em> software engineer who started toying with computers and videogames in the early 90s <strike>way before it was cool</strike>. I spend most of my time coding, exploring new ideas, and trying to keep up with the latest <strike>bubbles</strike> trends in the industry.</p> <p>I was born in the 80s, which means my personality firmware hasn\'t received an update since roughly 2005. I\'ve been listening to the same music since high school, and whenever I get the chance, I remind my kids that their generation\'s music has no soul — exactly like my dad told me in the 90s. The cycle is beautiful, really.</p> <p>I do have one new interest though: <strong>AI</strong>. The plan is to replace myself before someone else does(?). <em>Btw, this gamesite was fully vibecoded! --Thanks <a href="https://claude.ai" style="color:#ff8844" target="_blank" rel="noopener noreferrer">Claude</a></em></p>',
    category: 'about',
  },
  {
    id: 'target-experience-1',
    title: 'Experience',
    content: '<ul><li><strong>SQM</strong> — Junior dev. Did some real mining stuff. No, not crypto — actual dirt-and-explosives mining.</li><li><strong>Oracle</strong> — Support Engineer. Fancy title for an overrated call-center agent with a database.</li><li><strong>Citi</strong> — Real software work! Required 14 approvals to change a button color. Everyone had VP in their title.</li><li><strong>Nisum</strong> — Good times. Lots of learning and genuinely challenging work back when e-commerce was still figuring itself out.</li><li><strong>Iterable</strong> — Pandemic era. High demand, absurd perks, meetings that could\'ve been emails.</li><li><strong>SpaceX</strong> — Fun times, hard times, long times. The results were worth every hour I\'ll never bill for.</li><li><strong>Quilter</strong> — Awesome team, hard problems, still ramping up. Ask me again in a year.</li></ul>',
    category: 'experience',
  },
  {
    id: 'target-skills',
    title: 'Skills & Tech',
    content: '<p><s>Pascal, C/C++, Java, JS, TypeScript, Scala, Go, C#, Python</s> It\'s mostly vibecoding now. I mass-produce <code>tab</code> and <code>enter</code> for a living.</p>',
    category: 'skills',
  },
  {
    id: 'target-experience-2',
    title: 'Education',
    content: '<ul><li><strong>Bachelor\'s in Computer Engineering</strong> — <em>Universidad Católica del Norte, Antofagasta.</em> I was good at videogames growing up, so naturally I assumed I could be a software engineer. Back then we just called it "programmer" and nobody took us seriously.</li><li><strong>Master\'s in Industrial Engineering</strong> — <em>Universidad del Desarrollo, Santiago.</em> Had my doubts about software engineering being a <em>real</em> engineering, so I did this to prove something to myself. All I proved was that I enjoy suffering. 1.5 years I\'ll never get back.</li></ul>.',
    category: 'experience',
  },
  {
    id: 'target-contact',
    title: 'Contact',
    content: '<p>I exist on the internet in a few places:</p><ul><li><a href="https://github.com/hoofmen" style="color:#ff8844" target="_blank"rel="noopener noreferrer">GitHub</a> — where I push code and pretend my commit history is clean</li><li><a href="https://linkedin.com/in/osmanromero" style="color:#ff8844" target="_blank" rel="noopener noreferrer">LinkedIn</a> — where I pretend to be professional</li><li><a href="https://x.com/osmanromero" style="color:#ff8844" target="_blank" rel="noopener noreferrer">X</a> — where I pretend to have opinions</li></ul><p>Best way to actually reach me is through X. I read everything and try to respond to thoughtful messages.</p>',
    category: 'contact',
  },
]
