// Long write-ups for the project detail view, keyed by project id.
// Loaded on demand (dynamic import) so the initial bundle stays small.
// Source: the project bank. Only verified figures; internal names generalised.

export type ProjectDetail = { problem: string; approach: string[]; outcome: string[] }

export const projectDetails: Record<string, ProjectDetail> = {
  'decisioning-engine': {
    problem:
      'A grocery retailer wanted to nudge each of its 35M households toward one valuable action, such as winning back a lapsing shopper, signing up for the app or redeeming an offer, without flooding anyone with every message.',
    approach: [
      'Engineered 289 behavioural features from 4.6B transaction rows across 10 BigQuery sources in PySpark, over four rolling windows.',
      'Scored eight actions with a mix of rule-based scorers (a revenue-decline index for win-back, percent-rank propensity for digital sign-up and opt-in) and LightGBM propensity models for offer and reward redemption.',
      'Ranked each household’s actions by expected value, propensity times a normalised value estimate, and wrote date-partitioned activation tables.',
      'Removed leaking features, added an AUC leakage guard and pre-write data-quality gates.',
    ],
    outcome: [
      'One production pipeline, shipped as a single Databricks Asset Bundle on GCP, replacing three conflicting legacy packages.',
      'Every household gets a single, ranked next best action each run.',
    ],
  },
  'forecasting-platform': {
    problem:
      'Data scientists spent a lot of time hand-building forecasting models. The goal was a platform where anyone brings a CSV or a BigQuery table and leaves with a trained, explained and deployable forecast, without writing code.',
    approach: [
      'Built guided model selection and training across about 21 models, from statistical baselines to Prophet, gradient boosting, N-BEATS, LSTM and TSMixer, handling input incompatibilities instead of failing.',
      'Built flexible tuning across six search engines (including Optuna TPE, ASHA and Hyperband) with time budgets and LLM-suggested settings grounded in the actual dataset.',
      'Designed a refine-and-retrain loop with live feature importance, feature toggling and a leaderboard of every attempt; extended explainability to deep-learning models.',
      'Added multi-series forecasting that trains one model per series and saves the set as a single deployable artifact, and made saved models reusable on new data.',
    ],
    outcome: [
      'Data scientists compare, tune and explain many model families in one place and reuse the result without retraining.',
      'Panel datasets with hundreds of products or stores are forecast correctly instead of being silently blended into one series.',
    ],
  },
  'label-compliance': {
    problem:
      'Checking product labels against regulatory requirements was manual, slow and easy to get wrong across many fields.',
    approach: [
      'Engineered a multi-modal pipeline that combines OCR, the Google Vision API and Gemini to read labels and validate each compliance field.',
      'Added LLM observability with OpenLIT and OpenTelemetry to track cost, latency and quality through distributed tracing.',
      'Deployed on Databricks Spark with Delta Lake and CI/CD automation.',
    ],
    outcome: [
      'Automated validation across 19+ compliance fields.',
      'Runs 25 concurrent workflows with a 1,000-job queue.',
    ],
  },
  'model-monitor': {
    problem:
      'Production ML pipelines can fail quietly: data drifts, a job breaks, and a degraded model keeps making decisions until someone notices.',
    approach: [
      'Built a multi-agent framework where task-specific agents monitor pipelines in real time, detect silent drift and failures, and run root-cause analysis with recommended fixes.',
      'Designed a model trust signal that gates downstream agent recommendations, so a degraded model cannot drive decisions.',
      'Built an interactive four-scenario demo to show how the agents work together.',
    ],
    outcome: [
      'A foundation for the team’s move toward agentic AI in production monitoring.',
    ],
  },
  'deal-pilot': {
    problem:
      'Procurement teams negotiate with many consumer-goods vendors, and the supplier history that should inform each negotiation is scattered and slow to pull together.',
    approach: [
      'Built Deal Pilot, an AI copilot that supports vendor negotiations and quotations using supplier history.',
      'Built the full-stack prototype, front end and back end, during an internal hackathon.',
    ],
    outcome: [
      'Won the internal hackathon.',
      'Management is now taking the idea forward into a fuller product.',
    ],
  },
  'ad-incrementality': {
    problem:
      'Advertisers on the retailer’s site and app saw impressions and attributed sales, but could not tell whether the ads caused purchases or whether those shoppers would have bought anyway.',
    approach: [
      'Built matched control groups of logged-in shoppers who saw no ad, using K-Means stratification and 100-iteration bootstrap rank matching on pre-campaign spend.',
      'Estimated lift in sales, orders, units and conversions with difference-in-differences Welch t-tests, reporting p-values, effect size and power.',
      'Added Bayesian structural time series (CausalImpact) as a second, independent estimator, run only when data-quality gates pass.',
      'Automated it as a daily Databricks job that processes up to 100 campaigns in parallel.',
    ],
    outcome: [
      'Every eligible campaign above $25K gets an incrementality readout, including iROAS from two methods, with no manual analyst work.',
    ],
  },
  'brand-reconciliation': {
    problem:
      'Brand names in the product database and on the shelf did not always line up, which made it hard to confirm which brand a product really belonged to.',
    approach: ['Reconciled database and shelf brand names using Gemini-based LLM matching to validate brand authenticity.'],
    outcome: ['A consistent, validated mapping between database and shelf brands.'],
  },
  'keyword-to-shelf': {
    problem: 'Sponsored product ads need to know which shelf a shopper’s search keyword really points to.',
    approach: ['Built an NLP mapping from search keywords to store shelves for sponsored products.'],
    outcome: ['Keywords resolve to the right shelf for ad placement.'],
  },
  'demand-forecasting': {
    problem:
      'Demand needs forecasting across more than 500K item-level models, far too many to build and maintain one at a time.',
    approach: [
      'Exploring a global model architecture with learned embeddings for each item.',
      'Piloting on 100–200 items before scaling up.',
      'Evaluating with MAE as the main metric, with MAPE and sMAPE alongside.',
    ],
    outcome: ['In progress.'],
  },
  'pipeline-consolidation': {
    problem:
      'Pipelines lived in scattered notebooks, and adding a new data source meant writing new code each time.',
    approach: [
      'Consolidating notebooks into Python scripts within a scalable repository structure.',
      'Building YAML config-driven ingestion, so new sources are added with minimal code changes.',
      'Running ML pipelines as chained script tasks in Databricks Workflows, tracked with MLflow.',
    ],
    outcome: ['In progress: both the architecture and the hands-on build.'],
  },
  'shelf-agent': {
    problem: 'Out-of-stocks are often noticed only after shoppers have already found an empty shelf.',
    approach: [
      'Designed a LangGraph agent that watches point-of-sale velocity and inventory signals.',
      'It scores out-of-stock risk per item and store and dispatches tiered actions through Pub/Sub, Cloud Run and ERP APIs.',
      'Sensing jobs on BigQuery streaming, Delta Lake and Databricks run every 15–30 minutes.',
    ],
    outcome: ['A concept and architecture, not yet built.'],
  },
  'mlops-framework': {
    problem: 'Every model was trained, deployed and maintained by hand, which made it slow to ship and hard to keep healthy.',
    approach: [
      'Built a Python MLOps framework on Azure Databricks that automates ingestion, AutoML training, versioning and deployment.',
      'Set up CI/CD with automated testing and model validation for reproducible releases across cloud and on-prem environments.',
      'Added monitoring and continuous retraining to track drift, backed by a central feature store and model registry.',
    ],
    outcome: ['Repeatable, reproducible ML workflows that keep production models performing over time.'],
  },
  'fraud-detection': {
    problem:
      'An insurer needed to catch fraud across underwriting, persistency and claims, while its legacy risk process slowed customer onboarding.',
    approach: [
      'Built and deployed a LightGBM model with velocity, demographic and historical features.',
      'Modernised the legacy risk framework with MLOps automation.',
      'Added risk-based routing that sends each proposal to straight-through processing, underwriting or enhanced due diligence.',
    ],
    outcome: ['Onboarding time cut by 60%.', '90% of high-risk cases auto-processed, with fewer manual reviews.'],
  },
  'lapse-model': {
    problem:
      'Policyholders who miss a premium have a grace period before the policy lapses, and recovery teams could not call everyone.',
    approach: [
      'Built and deployed an XGBoost model that predicts who is likely to lapse within 30 days of the grace period.',
      'Grouped customers into five risk tiers from Very High to Very Low for prioritised outreach.',
      'Designed data-driven calling strategies around the tiers.',
    ],
    outcome: ['Grace period collections improved by 28%.'],
  },
  'loyalty-analytics': {
    problem: 'A credit card rewards programme needed to know who its valuable cardholders were and whether points were priced right.',
    approach: [
      'Analysed split-tender transactions for 1M+ card accounts across travel, dining, grocery and retail with SQL and SAS.',
      'Segmented cardholders with Value-Attrition-Potential and RFM models and recommended targeted engagement.',
      'Delivered pricing insights on the points-to-dollar conversion ratio.',
    ],
    outcome: [
      'Recommended strategies aimed at about 15% higher redemption frequency.',
      'Programme profitability improved by 8–10%.',
    ],
  },
  'healthcare-crm': {
    problem:
      'Patient engagement data for drug marketing campaigns sat in separate places, and reporting on it was manual.',
    approach: [
      'Built an end-to-end analytics framework in SAS and Python joining Google Analytics, enrolment forms and surveys.',
      'Analysed onboarding trends, engagement patterns and communication effectiveness across campaigns.',
      'Designed a Tableau dashboard for CRM KPIs such as lifecycle stages, campaign impact and engagement conversion.',
    ],
    outcome: ['Saved 30+ hours of manual reporting every month.'],
  },
  'market-basket': {
    problem: 'Business teams wanted to know which products sell together, but finding and ranking those patterns was manual.',
    approach: [
      'Built an automated pipeline that finds and ranks product associations by support, confidence and lift.',
      'Delivered prioritised insights in an interactive workbook for bundling, placement and targeted marketing.',
    ],
    outcome: ['Manual analysis time cut by 30–45%.'],
  },
}
