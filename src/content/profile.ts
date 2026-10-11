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
      'I build machine learning that moves real business numbers: measuring whether ads actually drive sales, and choosing the next best action for 35 million households.',
    ctas: [
      { label: 'See my work', href: '#experience', primary: true },
      { label: 'Résumé', href: '#resume', primary: false },
      { label: 'Get in touch', href: '#contact', primary: false },
    ],
    stats: [
      { value: '35M', label: 'households scored on 8 business actions' },
      { value: '4.6B', label: 'transaction rows engineered in PySpark' },
      { value: '90%', label: 'of high-risk insurance cases auto-routed' },
      { value: '4.5 yrs', label: 'across retail, loyalty, finance & insurance' },
    ],
    // Caption for the 3D point cloud beside the name.
    sceneCaption: 'Each point is a household, clustered by its next best action',
  },

  about: {
    label: '01 / About',
    paragraphs: [
      "I'm a data scientist and machine learning engineer in Bengaluru with about four and a half years of building models that move real business numbers, across retail, loyalty, finance and insurance. Today I'm an Advanced Machine Learning Engineer at Albertsons, where I measure whether ads actually drive sales and decide what to offer each of 35 million households next.",
      "I care about the whole loop, not just the model: features from billions of rows in PySpark and BigQuery, causal tests that hold up to scrutiny, and the MLOps that keeps everything retraining. Lately that loop includes agents. Deal Pilot, an agentic copilot that helps procurement teams negotiate with vendors, won Albertsons' internal hackathon in 2026.",
    ],
  },
} as const

export type NavItem = {
  id: string // section anchor
  label: string
  hidden?: boolean
  wide?: boolean // only shown from the sm breakpoint up, so the bar fits a phone
}

// Order matches the page. `projects` is reserved for later and hidden in v1.
export const nav: NavItem[] = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'work' },
  { id: 'stack', label: 'stack' },
  { id: 'certifications', label: 'certs', wide: true },
  { id: 'projects', label: 'projects', hidden: true },
  { id: 'resume', label: 'résumé' },
  { id: 'education', label: 'education', wide: true },
  { id: 'contact', label: 'contact' },
]
