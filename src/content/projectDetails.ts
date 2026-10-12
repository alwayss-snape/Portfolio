// Long write-ups for the project detail view, keyed by project id.
// Loaded on demand (dynamic import) so the initial bundle stays small.
// Every line restates the project bank. Outcomes appear only where the bank
// records one; figures the bank marks "to verify" or "to fill in" are left out.

export type ProjectDetail = { overview: string; approach: string[]; outcome?: string[] }

export const projectDetails: Record<string, ProjectDetail> = {
  'decisioning-pipeline': {
    overview:
      'Activation for high-value customer actions in grocery retail, built as a two-stage decision engine. Stage 1 scores every household from 0 to 1 for each of eight actions, such as departmental win-back, digital sign-up, marketing opt-in and offer redemption. Stage 2 picks the final action for each household.',
    approach: [
      'Engineered 289 behavioural features from 4.6B transaction rows across 10 BigQuery sources using PySpark, aggregating spend, clickstream, offer-redemption and reward signals over four rolling windows.',
      'Scored the eight actions with three strategies: a rule-based revenue-decline index for win-back, rule-based percent-rank propensity for sign-up, opt-in and subscription, and LightGBM propensity models for offer and reward redemption.',
      'Trained the LightGBM models with time-based label cutoffs, negative downsampling, correlation-based feature pruning and MLflow tracking; removed leaking 90-day features and added an AUC leakage guard.',
      'Ranked each household’s actions by expected value (propensity × normalised value estimate) and wrote date-partitioned activation tables to BigQuery.',
      'Added pre-flight source checks and pre-write data-quality gates (row counts, null or duplicate households, score bounds).',
    ],
    outcome: [
      'A unified production scoring pipeline, deployed as a single Databricks Asset Bundle on GCP, replacing three conflicting legacy packages.',
    ],
  },
  'forecasting-platform': {
    overview:
      'An end-to-end time-series forecasting platform. A user brings a CSV or a BigQuery table and gets a trained, saved and deployable forecast without writing code, through a guided 11-step wizard. Pipelines can be exported and deployed as Databricks jobs.',
    approach: [
      'Built guided model selection and training across about 21 forecasting models (statistical, Prophet, XGBoost and LightGBM, N-BEATS, LSTM, TSMixer) on Darts, adapting to input-variable incompatibilities instead of failing and streaming live training results to the UI.',
      'Built flexible hyperparameter tuning across six engines (including Optuna TPE, ASHA and Hyperband) with warm-starting, time-budgeted searches and LLM suggestions grounded in the dataset’s actual input variables.',
      'Designed a refine-and-retrain loop: live feature importance and correlation scores, feature toggling, quick retrain or re-tune, and a leaderboard history of every attempt.',
      'Extended explainability (SHAP, and Captum Integrated Gradients) to all model families, including deep learning.',
      'Added multi-series forecasting that trains one model per series and saves the set as a single deployable artifact, and fixed crashes on many-series inference.',
      'Made inference reusable and robust: saved models forecast on new data without retraining, what-if edits are applied, and short future inputs shorten the horizon with a warning instead of failing.',
    ],
  },
  'label-compliance': {
    overview: 'A system that automates regulatory validation of product labels.',
    approach: [
      'Engineered a multi-modal computer vision and NLP pipeline using OCR, Gemini and the Google Vision API, automating validation across 19+ compliance fields.',
      'Implemented observability with OpenLIT and OpenTelemetry, monitoring LLM cost, latency and performance with distributed tracing and centralised telemetry.',
      'Deployed on Databricks Spark with Delta Lake and CI/CD automation, orchestrating 25 concurrent workflows with a 1,000-job queue.',
    ],
  },
  'model-monitor': {
    overview:
      'Real-time monitoring of production ML pipelines by a multi-agent framework, with specific agents for specific tasks, that performs root-cause analysis and suggests the fixes to apply.',
    approach: [
      'Built task-specific agents that monitor pipelines in real time, detect silent drift and pipeline failures, and perform root-cause analysis with recommended fixes.',
      'Designed a model trust signal that gates downstream agent recommendations, so decisions are not driven by degraded models.',
      'Built related prototypes: a model health and auto-retraining agent, and a promo ROI intelligence agent whose recommendations the health agent gates, plus an interactive four-scenario demo simulator.',
    ],
  },
  'deal-pilot': {
    overview:
      'An AI procurement copilot that helps the procurement team with vendor negotiations and quotations using supplier history, aimed at direct merchandise spend with consumer-goods vendors.',
    approach: ['Built the working prototype, front end and back end.'],
    outcome: ['Won an internal hackathon.', 'Management is taking it forward to build something more substantial.'],
  },
  'onsite-incrementality': {
    overview:
      'The retail media business sells display ads on the retailer’s own site and app. Advertisers received impression and attributed-sales reports, which cannot show whether the ads caused purchases. The goal was a scalable, automated and statistically defensible measure of incremental sales lift and iROAS for every eligible onsite campaign.',
    approach: [
      'Built matched control groups from shoppers who logged in during a campaign but saw no ad, using K-Means stratification and 100-iteration bootstrap rank matching on pre-campaign spend.',
      'Estimated lift in sales, orders, units and conversions with difference-in-differences Welch t-tests, reporting p-value, Cohen’s d and power.',
      'Added Bayesian structural time series (CausalImpact) as a second, independent estimator behind data-quality gates, with iROAS computed from both methods.',
      'Automated it as a daily Databricks job on GCP that picks up eligible campaigns and runs up to 100 in parallel, deployed with Databricks Asset Bundles and GitHub Actions.',
    ],
    outcome: [
      'Every eligible campaign above $25K gets an incrementality readout with no manual analyst effort, replacing manual analyst readouts.',
    ],
  },
  'own-brands': {
    overview: 'Reconciliation of brands: mapping the brand names in the database to those on the shelf, and checking their authenticity.',
    approach: ['Reconciled database and shelf brand names using Gemini-based LLM matching to validate brand authenticity.'],
  },
  'sponsored-products': {
    overview: 'Keyword-to-shelf mapping for Sponsored Products.',
    approach: ['Built an NLP-based mapping from keywords to shelves.'],
  },
  'demand-forecasting': {
    overview: 'A large-scale demand forecasting system covering 500K+ model IDs.',
    approach: [
      'Exploring a global model architecture with model-ID embeddings.',
      'Piloting with 100–200 model IDs before scaling.',
      'Evaluating with MAE as the primary metric, with MAPE and sMAPE as complements.',
    ],
  },
  'fraud-detection': {
    overview: 'Fraud detection for insurance across underwriting, persistency and claims.',
    approach: [
      'Built and deployed a LightGBM model with velocity, demographic and historical features.',
      'Modernised the legacy risk framework with MLOps automation and streamlined risk assessments.',
      'Implemented risk-based routing that channels proposals into straight-through processing, underwriting or enhanced due diligence.',
    ],
    outcome: ['Onboarding time cut by 60%.', '90% of high-risk cases auto-processed, reducing manual reviews.'],
  },
  'lapse-model': {
    overview: 'Predicting which insurance policyholders are likely to lapse on premium payments within 30 days of the grace period.',
    approach: [
      'Developed and deployed an XGBoost model to identify policyholders likely to lapse.',
      'Segmented customers into five risk tiers, from Very High to Very Low, for targeted and prioritised outreach by recovery teams.',
      'Implemented data-driven calling strategies.',
    ],
    outcome: ['Grace period collections improved by 28%.'],
  },
  'loyalty-analytics': {
    overview: 'Analytics for a credit card rewards programme.',
    approach: [
      'Analysed split-tender transactions for 1M+ credit card accounts with SQL and SAS, across travel, dining, grocery and retail.',
      'Segmented customers with VAP (Value, Attrition, Potential) and RFM models, identifying high-value cohorts and recommending targeted engagement strategies.',
      'Optimised the points-to-dollar conversion ratio.',
    ],
    outcome: [
      'Recommended strategies to increase redemption frequency by about 15%.',
      'Programme profitability improved by 8–10% while maintaining customer satisfaction.',
    ],
  },
  'market-basket': {
    overview: 'Identifying and ranking which products are bought together.',
    approach: [
      'Architected a fully automated pipeline that ranks product associations by support, confidence and lift.',
      'Delivered prioritised insights in an interactive Excel workbook for product bundling, placement and targeted marketing.',
      'Translated association rules into clear strategies for business teams.',
    ],
    outcome: ['Manual analysis time reduced by 30–45%.'],
  },
  'healthcare-crm': {
    overview: 'Patient engagement analytics across drug marketing campaigns.',
    approach: [
      'Developed an end-to-end analytics framework in SAS and Python integrating Google Analytics, patient enrollment forms and customer surveys.',
      'Analysed patient onboarding trends, engagement patterns and communication effectiveness.',
      'Designed a Tableau dashboard for CRM KPIs, including patient lifecycle stages, campaign impact and engagement conversion.',
    ],
    outcome: ['Manual reporting time reduced by 30+ hours a month.'],
  },
}
