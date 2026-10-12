import { resumeIntro } from '../content/resume'
import Container from '../components/Container'
import ResumeViewer from '../components/ResumeViewer'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title" className="scroll-mt-16 py-14 sm:py-20">
      <Container>
        <SectionHeader label={resumeIntro.label} title={resumeIntro.title} headingId="resume-title" />
        <Reveal delay={0.08}>
          <div className="mt-10">
            <ResumeViewer />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
