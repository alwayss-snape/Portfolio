import { education, educationIntro } from '../content/education'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-16 py-14 sm:py-20">
      <Container>
        <SectionHeader label={educationIntro.label} title={educationIntro.title} headingId="education-title" />
        <Reveal delay={0.08}>
          <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
            {education.map((e) => (
              <li key={e.school} className="py-8">
                <p className="label text-moss">{e.dates}</p>
                <h3 className="mt-3 font-serif font-normal leading-none text-ink" style={{ fontSize: 'var(--text-company)' }}>
                  {e.school}
                </h3>
                <p className="mt-3 text-[15px] font-medium text-ink sm:text-[16px]">{e.degree}</p>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">
                  {e.notes.map((n) => (
                    <li
                      key={n}
                      className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-hairline"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
