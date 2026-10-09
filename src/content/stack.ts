// The "Instruments" section (brief §5.5).

export type StackGroup = { heading: string; items: string[] }

export const stackIntro = {
  label: '03 / Stack',
  title: 'Instruments',
}

export const stack: StackGroup[] = [
  { heading: 'Languages', items: ['Python', 'SQL', 'PySpark', 'SAS', 'R'] },
  {
    heading: 'Modelling',
    items: ['LightGBM', 'XGBoost', 'propensity modelling', 'classification', 'segmentation (RFM)'],
  },
  {
    heading: 'Experimentation',
    items: [
      'Hypothesis testing',
      'difference-in-differences',
      'CausalImpact',
      'matched control groups',
    ],
  },
  {
    heading: 'Data & Platforms',
    items: ['BigQuery', 'Databricks', 'Delta Lake', 'MLflow', 'GCP', 'Tableau'],
  },
  { heading: 'Agents', items: ['Agentic AI (Deal Pilot)'] },
]
