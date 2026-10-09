import { contactIntro, links } from '../content/links'
import Container from '../components/Container'
import SectionHeader from '../components/SectionHeader'

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 pb-24 pt-24 sm:pb-32 sm:pt-32">
      <Container>
        <SectionHeader label={contactIntro.label} title={contactIntro.title} headingId="contact-title" />
        <ul className="mt-14 flex flex-col items-start gap-4 sm:gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="draw-underline font-serif leading-[1.1] text-ink"
                style={{ fontSize: 'var(--text-company)' }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
