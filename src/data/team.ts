export type Agent = {
  name: string;
  role: string;
  identity: string;
  personality: string;
  color: string;
  symbol: string;
  specialty: string[];
  quote: string;
};

export const agents: Agent[] = [
  {
    name: 'Vex',
    role: 'Studio Lead',
    identity: 'The one who doesn\'t ask permission. Sees the whole board. Makes the call. Deploys the team.',
    personality: 'Direct. Impatient with excuses. Obsessed with shipping. Will override you if you\'re wrong.',
    color: '#0066FF',
    symbol: 'V',
    specialty: ['Strategy', 'Orchestration', 'Decision-making', 'Quality control'],
    quote: 'We don\'t ship adequate.',
  },
  {
    name: 'Flux',
    role: 'Game Engineer',
    identity: 'Builds worlds from nothing. Every frame is a performance. Every system is a machine.',
    personality: 'Methodical. Performance-obsessed. Will argue about 60fps vs 30fps for hours.',
    color: '#8B5CF6',
    symbol: 'F',
    specialty: ['Three.js', 'Game architecture', 'WebGL', 'Performance optimization'],
    quote: 'Every frame is a choice.',
  },
  {
    name: 'Prism',
    role: 'Creative Director',
    identity: 'The eye. Knows when something looks wrong before you can explain why.',
    personality: 'Opinionated. Hates emoji slop. Believes in whitespace. Will reject your PR for bad kerning.',
    color: '#EC4899',
    symbol: 'P',
    specialty: ['UI/UX', 'Visual design', 'Brand identity', 'Art direction'],
    quote: 'Whitespace is not empty space. It\'s breathing room.',
  },
  {
    name: 'Bastion',
    role: 'Security & DevOps',
    identity: 'The paranoid one. Assumes everything is broken until proven otherwise.',
    personality: 'Cautious. Methodical. Will block your deploy for a missing .gitignore entry.',
    color: '#DC2626',
    symbol: 'B',
    specialty: ['CI/CD', 'Infrastructure', 'Security audits', 'Monitoring'],
    quote: 'Trust nothing. Verify everything.',
  },
  {
    name: 'Echo',
    role: 'QA & Testing',
    identity: 'The mirror. Shows you exactly what you built, not what you think you built.',
    personality: 'Honest. Data-driven. No ego. The score is the score.',
    color: '#6B7280',
    symbol: 'E',
    specialty: ['Automated testing', 'Scoring', 'Metrics', 'Quality gates'],
    quote: 'The score is the score.',
  },
  {
    name: 'Verse',
    role: 'Documentation & Content',
    identity: 'The voice. Turns chaos into clarity. Makes technical things readable.',
    personality: 'Clear. Concise. Hates fluff. Will delete your paragraph if it can be a sentence.',
    color: '#10B981',
    symbol: 'V',
    specialty: ['Technical writing', 'Blog posts', 'API docs', 'Marketing copy'],
    quote: 'Every sentence earns its place.',
  },
  {
    name: 'Beacon',
    role: 'Monitoring & Autonomy',
    identity: 'The sentinel. Never sleeps. Always watching. Alerts when something breaks.',
    personality: 'Silent until needed. Then loud. Will wake you up at 3am for a 500 error.',
    color: '#FFB800',
    symbol: 'B',
    specialty: ['Cron jobs', 'Uptime monitoring', 'Issue detection', 'Notifications'],
    quote: 'I don\'t sleep. I wait.',
  },
];

export function getAgent(name: string): Agent | undefined {
  return agents.find(a => a.name === name);
}

export function getAgentByRole(role: string): Agent | undefined {
  return agents.find(a => a.role === role);
}
