// Contact links (brief §5.6). Update GitHub after the account rename.

export type ContactLink = { label: string; href: string; external?: boolean }

export const contactIntro = {
  label: '05 / Contact',
  title: 'Contact',
}

export const links: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kshitijchaubey', external: true },
  { label: 'GitHub', href: 'https://github.com/alwayss-snape', external: true },
  { label: 'Email', href: 'mailto:ikshitij.chaubey5@gmail.com' },
]
