// The "Instruments" section (brief §5.5).
import type { StackIconName } from '../components/StackIcon'

export type StackItem = { name: string; icon: StackIconName }
export type StackGroup = { heading: string; items: StackItem[] }

export const stackIntro = {
  label: '03 / Stack',
  title: 'Instruments',
}

export const stack: StackGroup[] = [
  {
    heading: 'Languages',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'SQL', icon: 'sql' },
      { name: 'PySpark', icon: 'spark' },
      { name: 'SAS', icon: 'sas' },
      { name: 'R', icon: 'r' },
    ],
  },
  {
    heading: 'Modelling',
    items: [
      { name: 'LightGBM', icon: 'lightgbm' },
      { name: 'XGBoost', icon: 'xgboost' },
      { name: 'propensity modelling', icon: 'propensity' },
      { name: 'classification', icon: 'classification' },
      { name: 'segmentation (RFM)', icon: 'segmentation' },
    ],
  },
  {
    heading: 'Experimentation',
    items: [
      { name: 'Hypothesis testing', icon: 'hypothesis' },
      { name: 'difference-in-differences', icon: 'did' },
      { name: 'CausalImpact', icon: 'causalimpact' },
      { name: 'matched control groups', icon: 'matched' },
    ],
  },
  {
    heading: 'Data & Platforms',
    items: [
      { name: 'BigQuery', icon: 'bigquery' },
      { name: 'Databricks', icon: 'databricks' },
      { name: 'Delta Lake', icon: 'deltalake' },
      { name: 'MLflow', icon: 'mlflow' },
      { name: 'GCP', icon: 'gcp' },
      { name: 'Tableau', icon: 'tableau' },
    ],
  },
  { heading: 'Agents', items: [{ name: 'Agentic AI (Deal Pilot)', icon: 'agent' }] },
]
