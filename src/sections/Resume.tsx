import { resumeIntro } from '../content/resume'
import Container from '../components/Container'
import ResumeViewer from '../components/ResumeViewer'
import SectionHeader from '../components/SectionHeader'

export default function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={resumeIntro.label} title={resumeIntro.title} headingId="resume-title" />
        <div className="mt-14">
          <ResumeViewer />
        </div>
      </Container>
    </section>
  )
}
