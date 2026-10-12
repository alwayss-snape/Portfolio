import { profile } from '../content/profile'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-label" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <SectionHeader label={profile.about.label} headingId="about-label" />
          <Reveal delay={0.08}>
            <div className="max-w-[760px] space-y-5 text-[17px] leading-[1.65] text-ink-2 sm:text-[19px] lg:text-[21px]">
              {profile.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
