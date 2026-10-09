import { useEffect, useState } from 'react'
import { nav, profile } from '../content/profile'

const items = nav.filter((n) => !n.hidden)
const SCROLL_THRESHOLD = 80

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The active section is the one crossing the middle of the viewport.
  useEffect(() => {
    // The hero (#top) is observed too, so scrolling back up clears the highlight.
    const sections = ['top', ...items.map((n) => n.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? null : entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled ? 'bg-[var(--nav-bar)] backdrop-blur-md' : ''
      }`}
    >
      {/* Soft scrim keeps light links legible over the brighter parts of the poster. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--scene-scrim)] to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 font-mono text-[12px] sm:px-8 sm:text-[13px] lg:px-16"
      >
        <a href="#top" className={`tracking-[2px] ${scrolled ? 'text-ink' : 'text-on-scene'}`}>
          {profile.wordmark}
        </a>
        <ul className="flex gap-3 lowercase sm:gap-8">
          {items.map((n) => {
            const isActive = active === n.id
            const isContact = n.id === 'contact'
            const color = scrolled
              ? isActive || isContact
                ? 'text-rust'
                : 'text-ink hover:text-rust'
              : isActive || isContact
                ? 'text-rust-light'
                : 'text-on-scene hover:text-rust-light'
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`transition-colors ${color}`}
                >
                  {n.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
