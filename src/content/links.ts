// Contact block (brief §5.6). Update GitHub after the account rename.

export type ContactLink = { label: string; href: string; external?: boolean }

export const contactIntro = {
  label: '07 / Contact',
  title: "Let's talk",
  sub: 'Open to conversations about machine learning, agentic AI and data roles. Email is the quickest way to reach me.',
  emailLabel: 'Email',
  elsewhereLabel: 'Elsewhere',
  copy: { idle: 'Copy', done: 'Copied', failed: 'Copy failed', announce: 'Email address copied to clipboard' },
}

export const email = 'ikshitij.chaubey5@gmail.com'

export const links: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kshitijchaubey', external: true },
  { label: 'GitHub', href: 'https://github.com/alwayss-snape', external: true },
]
