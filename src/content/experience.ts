// The "Cycles" section (brief §5.4). Source of truth: the October 2026 résumé.
// Kept as an array so further roles (e.g. HighRadius) can be added back later.

export type YearMonth = { year: number; month: number } // month is 1–12

export type Cycle = {
  id: string
  number: string // "01", "02", ...
  kind: 'education' | 'work'
  company: string
  role: string
  dates: string // display label
  start: YearMonth
  end: YearMonth | 'now'
  current?: boolean
  // Points on the arc worth a tick, e.g. a promotion.
  milestones?: { at: YearMonth; label: string }[]
  bullets: { title?: string; text: string }[]
}

export const cyclesIntro = {
  label: '02 / Cycles',
  title: 'Cycles',
  sub: 'Twelve years on one loop. Scroll turns the ring; the current cycle stays in the light.',
  centre: { value: '4.5 yrs', caption: 'Three cycles · One loop' },
  cyclePrefix: 'Cycle',
  currentTag: 'Current',
  ringLabel: 'Timeline from 2018 to 2029 showing education and two roles as arcs on a ring',
}

// The ring spans 12 years, starting at 12 o'clock and running clockwise.
export const ringSpan = { start: 2018, end: 2030 } // 2018 → 2029 inclusive

export const experience: Cycle[] = [
  {
    id: 'kiit',
    number: '01',
    kind: 'education',
    company: 'KIIT University',
    role: 'B.Tech, Computer Science & Communication Engineering',
    dates: '2018 → 2022',
    start: { year: 2018, month: 7 },
    end: { year: 2022, month: 6 },
    bullets: [
      { text: 'CGPA 8.2/10' },
      { text: 'Databricks Certified Machine Learning Associate' },
    ],
  },
  {
    id: 'epsilon',
    number: '02',
    kind: 'work',
    company: 'Epsilon (Publicis Groupe)',
    role: 'Data Scientist II, then Data Scientist I before that',
    dates: 'Aug 2022 → Mar 2026',
    start: { year: 2022, month: 8 },
    end: { year: 2026, month: 3 },
    milestones: [{ at: { year: 2024, month: 8 }, label: 'Promoted to Data Scientist II' }],
    bullets: [
      {
        title: 'Insurance fraud detection',
        text: 'a LightGBM model across underwriting, persistency and claims, with risk-based routing that auto-processes 90% of high-risk cases and cuts onboarding time by 60%',
      },
      {
        title: 'Loyalty analytics',
        text: 'VAP and RFM segmentation for 1M+ card accounts, and points-pricing work that lifted program profitability 8–10%',
      },
    ],
  },
  {
    id: 'albertsons',
    number: '03',
    kind: 'work',
    company: 'Albertsons Companies',
    role: 'Advanced Machine Learning Engineer',
    dates: 'Mar 2026 → now',
    start: { year: 2026, month: 3 },
    end: 'now',
    current: true,
    bullets: [
      {
        title: 'Retail media incrementality',
        text: 'an automated pipeline that measures incremental sales lift and iROAS for every onsite campaign above $25K, using matched control groups, diff-in-diff and CausalImpact',
      },
      {
        title: 'Customer targeting engine',
        text: 'scores 35M households on 8 business actions, with features from 4.6B transaction rows in PySpark and LightGBM propensity models',
      },
      {
        title: 'Deal Pilot',
        text: 'an agentic AI negotiation copilot for procurement that won the 2026 internal hackathon',
      },
    ],
  },
]
