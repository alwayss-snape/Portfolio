import { profile } from '../content/profile'
import Container from '../components/Container'
import SectionHeader from '../components/SectionHeader'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-label" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={profile.about.label} headingId="about-label" />
        <div className="mt-8 max-w-[620px] space-y-5 text-[16px] leading-[1.7] text-ink-2 sm:text-[17px]">
          {profile.about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Container>
    </section>
  )
}
