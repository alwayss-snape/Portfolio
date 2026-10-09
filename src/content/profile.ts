// Site-wide identity and the Hero / About copy (brief §1, §5.2, §5.3).

export const profile = {
  name: 'Kshitij Chaubey',
  designation: 'Data Scientist & ML Engineer',
  location: 'Bengaluru',
  wordmark: 'K—C',
  skipLink: 'Skip to content',
  footer: '© 2026 Kshitij Chaubey · Bengaluru',

  hero: {
    kicker: 'Kshitij Chaubey · Data Scientist & ML Engineer · Bengaluru',
    headline: ['Every model', 'comes back around.'] as const, // second line renders italic
    sub: 'Train, deploy, observe, retrain. I build machine learning systems that close their own loop.',
    meta: 'cycle 03 · 2026 · scroll ↓',
    poster: 'hero-poster.webp', // static frame of the scene, relative to public/
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
}

// Order matches the page. `projects` is reserved for later and hidden in v1.
export const nav: NavItem[] = [
  { id: 'about', label: 'about' },
  { id: 'cycles', label: 'cycles' },
  { id: 'stack', label: 'stack' },
  { id: 'projects', label: 'projects', hidden: true },
  { id: 'resume', label: 'résumé' },
  { id: 'contact', label: 'contact' },
]
