// Certifications, shown after the stack. Source: the October 2026 résumé.
// Add issuer / year / credential link as they're confirmed.

export type Certification = { name: string; issuer?: string; year?: string; href?: string }

export const certificationsIntro = {
  label: '04 / Certifications',
  title: 'Certifications',
}

export const certifications: Certification[] = [
  { name: 'Databricks Certified Machine Learning Associate', issuer: 'Databricks' },
  { name: 'SQL for Data Science' },
]
