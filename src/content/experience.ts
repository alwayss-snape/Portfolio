// The work experience section, drawn as cycles on a ring (brief §5.4).
// Source of truth: the October 2026 résumé. Education lives in education.ts.

export type YearMonth = { year: number; month: number } // month is 1–12

export type Cycle = {
  id: string
  number: string // "01", "02", ...
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
  label: '02 / Experience',
  title: 'Work Experience',
  sub: 'Two roles on one loop. Scroll turns the ring; the current role stays in the light.',
  centre: { value: '4.5 yrs', caption: 'Two roles · One loop' },
  cyclePrefix: 'Cycle',
  currentTag: 'Current',
  ringLabel: 'Timeline from 2022 to 2029 showing two roles as arcs on a ring',
}

// The ring spans 8 years, starting at 12 o'clock and running clockwise.
export const ringSpan = { start: 2022, end: 2030 } // 2022 → 2029 inclusive

export const experience: Cycle[] = [
  {
    id: 'epsilon',
    number: '01',
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
    number: '02',
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
