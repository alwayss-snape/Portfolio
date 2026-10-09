import { profile } from './content/profile'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Cycles from './sections/Cycles'
import Stack from './sections/Stack'
import Resume from './sections/Resume'
import Contact from './sections/Contact'
import Container from './components/Container'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-fog-2 px-4 py-2 font-mono text-[13px] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {profile.skipLink}
      </a>
      <Nav />
      <Hero />
      <main id="main">
        <About />
        <Cycles />
        <Stack />
        <Resume />
        <Contact />
      </main>
      <footer className="border-t border-hairline py-8">
        <Container>
          <p className="font-mono text-[12px] tracking-[1px] text-muted">{profile.footer}</p>
        </Container>
      </footer>
    </>
  )
}
