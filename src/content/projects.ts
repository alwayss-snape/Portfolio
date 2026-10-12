// The Projects section: one card per project. Long write-ups live in
// projectDetails.ts, which loads only when a project is opened.
// Source: the project bank, and nothing beyond it. Titles follow the bank;
// only internal product names are generalised. Tools come from each
// project's "Tech" line; a project with none listed shows none.

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
  category: Category // the main domain: sets the colour
  also?: Category[] // other domains the work genuinely spans
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
  overview: 'Overview',
  approach: 'What I did',
  outcome: 'Outcome',
  stackLabel: 'Tools',
  loading: 'Loading…',
}

export const projects: Project[] = [
  // Albertsons
  {
    id: 'decisioning-pipeline',
    title: 'Customer Decisioning Pipeline',
    org: 'Albertsons',
    category: 'ml',
    also: ['data'],
    summary: 'A two-stage pipeline that scores 35M grocery households on eight high-value actions and ranks the best action for each.',
    stack: ['PySpark', 'BigQuery', 'LightGBM', 'MLflow', 'Databricks Asset Bundles', 'GCP'],
  },
  {
    id: 'forecasting-platform',
    title: 'Enterprise Time-Series Forecasting Platform',
    org: 'Albertsons',
    category: 'ml',
    also: ['mlops'],
    summary: 'An end-to-end platform that turns a CSV or BigQuery table into a trained, deployable forecast without code. I built its modelling and inference features.',
    stack: ['Darts', 'Prophet', 'XGBoost', 'LightGBM', 'N-BEATS', 'LSTM', 'TSMixer', 'Optuna', 'SHAP', 'Captum', 'Gemini'],
  },
  {
    id: 'label-compliance',
    title: 'AI-Powered Regulatory Label Compliance System',
    org: 'Albertsons',
    category: 'ml',
    also: ['mlops'],
    summary: 'A multi-modal computer vision and NLP pipeline that automates regulatory validation of product labels across 19+ compliance fields.',
    stack: ['OCR', 'Gemini', 'Google Vision API', 'OpenLIT', 'OpenTelemetry', 'Databricks Spark', 'Delta Lake', 'CI/CD'],
  },
  {
    id: 'model-monitor',
    title: 'Agentic Model Monitor',
    org: 'Albertsons',
    category: 'agentic',
    also: ['mlops'],
    summary: 'A multi-agent framework that monitors production ML pipelines in real time, finds root causes and recommends fixes.',
    stack: [],
  },
  {
    id: 'deal-pilot',
    title: 'Deal Pilot – AI Procurement Copilot',
    org: 'Albertsons',
    category: 'agentic',
    summary: 'An AI copilot that supports vendor negotiations and quotations using supplier history. Won an internal hackathon.',
    stack: [],
  },
  {
    id: 'onsite-incrementality',
    title: 'Onsite Incrementality Measurement (Retail Media)',
    org: 'Albertsons',
    category: 'ml',
    also: ['mlops'],
    summary: 'An automated pipeline that measures incremental sales lift and iROAS for every onsite retail media campaign above $25K.',
    stack: ['Python', 'R (CausalImpact)', 'K-Means', 'Difference-in-differences', 'BSTS', 'BigQuery', 'Databricks', 'GitHub Actions'],
  },
  {
    id: 'own-brands',
    title: 'Own Brands',
    org: 'Albertsons',
    category: 'data',
    also: ['ml'],
    summary: 'Reconciles database and shelf brand names with Gemini-based LLM matching to validate brand authenticity.',
    stack: ['Gemini'],
  },
  {
    id: 'sponsored-products',
    title: 'Sponsored Products',
    org: 'Albertsons',
    category: 'ml',
    summary: 'Keyword-to-shelf mapping using NLP for Sponsored Products.',
    stack: ['NLP'],
  },
  {
    id: 'demand-forecasting',
    title: 'Large-Scale Demand Forecasting',
    org: 'Albertsons',
    category: 'ml',
    summary: 'A demand forecasting system covering 500K+ model IDs, exploring a global model architecture with model-ID embeddings.',
    stack: [],
  },
  {
    id: 'pipeline-consolidation',
    title: 'Databricks Pipeline Consolidation & Config-Driven Ingestion',
    org: 'Albertsons',
    category: 'data',
    also: ['mlops'],
    summary: 'Consolidating notebooks into a scalable script-based repo, with YAML config-driven ingestion so new sources need minimal code.',
    stack: ['Databricks Workflows', 'MLflow', 'Python', 'YAML'],
  },
  {
    id: 'shelf-intelligence',
    title: 'Shelf Intelligence Agent',
    org: 'Albertsons',
    category: 'agentic',
    also: ['data'],
    summary: 'Design for a LangGraph agent that scores out-of-stock risk per SKU and store from point-of-sale velocity and inventory signals.',
    stack: ['LangGraph', 'BigQuery', 'Delta Lake', 'Databricks', 'Pub/Sub', 'Cloud Run'],
  },
  // Epsilon
  {
    id: 'mlops-framework',
    title: 'Scalable MLOps Framework',
    org: 'Epsilon',
    category: 'mlops',
    summary: 'A Python MLOps framework on Azure Databricks that automates ingestion, AutoML training, versioning, deployment and retraining.',
    stack: ['Python', 'Azure Databricks', 'Azure', 'AutoML', 'CI/CD', 'Feature store', 'Model registry'],
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection Framework',
    org: 'Epsilon',
    category: 'ml',
    also: ['mlops'],
    summary: 'A LightGBM fraud model across underwriting, persistency and claims, with risk-based routing of proposals.',
    stack: ['LightGBM', 'Python', 'MLOps automation'],
  },
  {
    id: 'lapse-model',
    title: 'Grace Period Lapse Model',
    org: 'Epsilon',
    category: 'ml',
    summary: 'An XGBoost model that flags policyholders likely to lapse within 30 days of the grace period, with risk tiers for outreach.',
    stack: ['XGBoost', 'Python'],
  },
  {
    id: 'loyalty-analytics',
    title: 'Loyalty Program Analytics',
    org: 'Epsilon',
    category: 'ml',
    summary: 'Customer segmentation and points-pricing analysis for a credit card rewards programme with 1M+ accounts.',
    stack: ['SQL', 'SAS', 'RFM segmentation', 'VAP segmentation'],
  },
  {
    id: 'market-basket',
    title: 'Market Basket Analysis Framework',
    org: 'Epsilon',
    category: 'ml',
    also: ['data'],
    summary: 'A fully automated pipeline that finds and ranks product associations by support, confidence and lift.',
    stack: ['Python', 'Association rule mining', 'Excel'],
  },
  {
    id: 'healthcare-crm',
    title: 'Healthcare CRM & Patient Engagement Analytics',
    org: 'Epsilon',
    category: 'data',
    summary: 'An analytics framework joining Google Analytics, patient enrollment and survey data, with a Tableau dashboard for CRM KPIs.',
    stack: ['SAS', 'Python', 'Google Analytics', 'Tableau'],
  },
]
