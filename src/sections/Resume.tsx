import { resumeIntro } from '../content/resume'
import Container from '../components/Container'
import ResumeViewer from '../components/ResumeViewer'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={resumeIntro.label} title={resumeIntro.title} headingId="resume-title" />
        <Reveal delay={0.08}>
          <div className="mt-14">
            <ResumeViewer />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
