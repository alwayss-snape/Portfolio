import { certifications, certificationsIntro } from '../content/certifications'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={certificationsIntro.label} title={certificationsIntro.title} headingId="certifications-title" />
        <Reveal delay={0.08}>
          <ul className="mt-14 divide-y divide-hairline border-y border-hairline">
            {certifications.map((c) => {
              const meta = [c.issuer, c.year].filter(Boolean).join(' · ')
              return (
                <li key={c.name} className="grid gap-2 py-6 md:grid-cols-[240px_1fr] md:gap-10">
                  <p className="label pt-1.5 text-moss">{meta}</p>
                  <p className="text-[16px] leading-relaxed text-ink sm:text-[18px]">
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="draw-underline">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
