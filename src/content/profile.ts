// Site-wide identity and the Hero / About copy (brief §1, §5.2, §5.3).

export const profile = {
  name: 'Kshitij Chaubey',
  designation: 'Data Scientist & ML Engineer',
  location: 'Bengaluru',
  wordmark: 'K—C',
  skipLink: 'Skip to content',
  footer: '© 2026 Kshitij Chaubey · Bengaluru',

  hero: {
    now: { tag: 'Now', text: 'Advanced ML Engineer at Albertsons Companies · Bengaluru' },
    name: ['Kshitij', 'Chaubey'] as const, // second line renders italic
    claim:
      'I build machine learning that helps businesses make better decisions, from predictive models and AI agents to the data pipelines and MLOps behind them.',
    ctas: [
      { label: 'See my work', href: '#experience', primary: true },
      { label: 'Résumé', href: '#resume', primary: false },
      { label: 'Get in touch', href: '#contact', primary: false },
    ],
    // What I do, at a glance: broad areas rather than project specifics.
    focus: [
      { title: 'Machine learning', text: 'Models that predict, rank and decide' },
      { title: 'Agentic AI', text: 'LLM agents that plan, act and use tools' },
      { title: 'Data engineering', text: 'Pipelines that hold up at scale' },
      { title: 'MLOps', text: 'Shipping models and keeping them healthy' },
    ],
    // Caption for the 3D point cloud beside the name.
    sceneCaption: 'One cluster per focus area. Click one to see its projects, or drag to turn.',
  },

  about: {
    label: '01 / About',
    paragraphs: [
      "I'm a data scientist and machine learning engineer in Bengaluru with about 4.5 years of experience across retail, loyalty, finance and insurance. Today I'm an Advanced Machine Learning Engineer at Albertsons Companies.",
      "I care about the whole loop, not just the model: understanding the business question, building the data behind it, testing whether an idea really works, and keeping models healthy once they ship. Lately that loop includes LLMs and agents.",
    ],
  },
} as const

export type NavItem = {
  id: string // section anchor
  label: string
  hidden?: boolean
  wide?: boolean // only shown from the sm breakpoint up, so the bar fits a phone
}

// Order matches the page. `wide` items are hidden on phones so the bar fits.
export const nav: NavItem[] = [
  { id: 'about', label: 'about', wide: true },
  { id: 'experience', label: 'work' },
  { id: 'projects', label: 'projects' },
  { id: 'stack', label: 'stack', wide: true },
  { id: 'certifications', label: 'certs', wide: true },
  { id: 'resume', label: 'résumé' },
  { id: 'education', label: 'education', wide: true },
  { id: 'contact', label: 'contact' },
]
