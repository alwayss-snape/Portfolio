// The Projects section: one card per project. Long write-ups live in
// projectDetails.ts, which loads only when a project is opened.
// Source: the project bank. Only verified figures; internal names generalised.

export type Category = 'ml' | 'agentic' | 'data' | 'mlops'

// Same order and names as the hero's focus areas and the point-cloud clusters.
export const categories: { id: Category; label: string }[] = [
  { id: 'ml', label: 'Machine learning' },
  { id: 'agentic', label: 'Agentic AI' },
  { id: 'data', label: 'Data engineering' },
  { id: 'mlops', label: 'MLOps' },
]

export type Project = {
  id: string
  title: string
  org: 'Albertsons' | 'Epsilon'
  period: string
  category: Category // primary: sets the colour
  also?: Category[] // the project also shows under these filters
  status?: 'Concept' | 'In progress'
  summary: string
  stack: string[]
}

export const projectsIntro = {
  label: '03 / Projects',
  title: 'Projects',
  sub: 'A wider look at what I have built. Filter by focus area, or open a project for the full story.',
  all: 'All',
  open: 'Read more',
  close: 'Close',
  prev: 'Previous project',
  next: 'Next project',
  problem: 'The problem',
  approach: 'What I did',
  outcome: 'Outcome',
  stackLabel: 'Tools',
  loading: 'Loading…',
}

const ALB = { org: 'Albertsons', period: '2026' } as const
const EPS = { org: 'Epsilon', period: '2022 – 2026' } as const

export const projects: Project[] = [
  {
    id: 'decisioning-engine',
    title: 'Customer next-best-action engine',
    ...ALB,
    category: 'ml',
    also: ['data'],
    summary: 'Scores tens of millions of grocery households on eight actions and picks the best one for each.',
    stack: ['PySpark', 'BigQuery', 'LightGBM', 'MLflow', 'Databricks'],
  },
  {
    id: 'forecasting-platform',
    title: 'Self-serve forecasting platform',
    ...ALB,
    category: 'mlops',
    also: ['ml'],
    summary: 'A no-code platform that takes data scientists from raw data to a deployable forecast.',
    stack: ['Python', 'FastAPI', 'Darts', 'Optuna', 'SHAP', 'Gemini'],
  },
  {
    id: 'label-compliance',
    title: 'AI regulatory label compliance',
    ...ALB,
    category: 'agentic',
    also: ['mlops'],
    summary: 'Reads product labels with vision and LLMs to check regulatory fields automatically.',
    stack: ['Gemini', 'Google Vision API', 'OCR', 'OpenTelemetry', 'Databricks'],
  },
  {
    id: 'model-monitor',
    title: 'Agentic model monitor',
    ...ALB,
    category: 'agentic',
    also: ['mlops'],
    summary: 'A team of agents that watches production ML pipelines, finds root causes and suggests fixes.',
    stack: ['Multi-agent systems', 'Drift detection', 'Root-cause analysis'],
  },
  {
    id: 'deal-pilot',
    title: 'Deal Pilot, an AI procurement copilot',
    ...ALB,
    category: 'agentic',
    summary: 'A hackathon-winning copilot that helps buyers negotiate with vendors using supplier history.',
    stack: ['LLMs', 'Full-stack prototype'],
  },
  {
    id: 'ad-incrementality',
    title: 'Retail media incrementality measurement',
    ...ALB,
    category: 'ml',
    also: ['data'],
    summary: 'Measures whether onsite ads truly caused extra sales, automatically, for every large campaign.',
    stack: ['Python', 'R', 'CausalImpact', 'BigQuery', 'Databricks'],
  },
  {
    id: 'brand-reconciliation',
    title: 'Brand name reconciliation with LLMs',
    ...ALB,
    category: 'agentic',
    summary: 'Matches brand names between the product database and the shelf using an LLM.',
    stack: ['Gemini', 'LLM matching'],
  },
  {
    id: 'keyword-to-shelf',
    title: 'Keyword-to-shelf mapping',
    ...ALB,
    category: 'ml',
    summary: 'Maps shopper search keywords to store shelves with NLP for sponsored product ads.',
    stack: ['NLP'],
  },
  {
    id: 'demand-forecasting',
    title: 'Large-scale demand forecasting',
    ...ALB,
    category: 'ml',
    status: 'In progress',
    summary: 'Forecasting demand across hundreds of thousands of items with a single global model.',
    stack: ['Global model', 'Embeddings', 'MAE / sMAPE'],
  },
  {
    id: 'pipeline-consolidation',
    title: 'Config-driven Databricks pipelines',
    ...ALB,
    category: 'data',
    also: ['mlops'],
    status: 'In progress',
    summary: 'Turning notebooks into a clean, config-driven pipeline repo where new sources need little code.',
    stack: ['Databricks Workflows', 'Python', 'YAML', 'MLflow'],
  },
  {
    id: 'shelf-agent',
    title: 'Shelf intelligence agent',
    ...ALB,
    category: 'agentic',
    status: 'Concept',
    summary: 'An agent design that spots out-of-stock risk early and triggers the right action per store.',
    stack: ['LangGraph', 'BigQuery', 'Pub/Sub', 'Cloud Run'],
  },
  {
    id: 'mlops-framework',
    title: 'MLOps framework on Azure Databricks',
    ...EPS,
    category: 'mlops',
    summary: 'A reusable framework that automates training, versioning, deployment and retraining.',
    stack: ['Python', 'Azure Databricks', 'AutoML', 'CI/CD', 'Feature store'],
  },
  {
    id: 'fraud-detection',
    title: 'Insurance fraud detection',
    ...EPS,
    category: 'ml',
    also: ['mlops'],
    summary: 'Catches fraud across underwriting, persistency and claims, and routes cases by risk.',
    stack: ['LightGBM', 'Python', 'MLOps'],
  },
  {
    id: 'lapse-model',
    title: 'Grace period lapse prediction',
    ...EPS,
    category: 'ml',
    summary: 'Predicts which policyholders will let a policy lapse, so recovery teams call the right people first.',
    stack: ['XGBoost', 'Python'],
  },
  {
    id: 'loyalty-analytics',
    title: 'Credit card loyalty analytics',
    ...EPS,
    category: 'ml',
    summary: 'Segments rewards cardholders and tunes points pricing for a more profitable programme.',
    stack: ['SQL', 'SAS', 'RFM segmentation'],
  },
  {
    id: 'healthcare-crm',
    title: 'Healthcare CRM & patient engagement analytics',
    ...EPS,
    category: 'data',
    summary: 'Joins web, enrolment and survey data into one view of how patients engage with campaigns.',
    stack: ['SAS', 'Python', 'Google Analytics', 'Tableau'],
  },
  {
    id: 'market-basket',
    title: 'Market basket analysis',
    ...EPS,
    category: 'data',
    also: ['ml'],
    summary: 'An automated pipeline that finds which products sell together and turns it into bundling ideas.',
    stack: ['Python', 'Association rules', 'Excel'],
  },
]
