import { useEffect, useRef, useState } from 'react'
import { contactIntro, email, links } from '../content/links'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

type CopyState = 'idle' | 'done' | 'failed'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers and non-secure contexts: fall back to a hidden textarea.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

// The closing section: a large email address with one-click copy, and the
// other places to find me beside it.
export default function Contact() {
  const [copy, setCopy] = useState<CopyState>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    const ok = await copyText(email)
    setCopy(ok ? 'done' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopy('idle'), 2200)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 pb-24 pt-24 sm:pb-32 sm:pt-32">
      <Container>
        <SectionHeader
          label={contactIntro.label}
          title={contactIntro.title}
          sub={contactIntro.sub}
          headingId="contact-title"
        />
        <Reveal delay={0.08}>
          <div className="mt-14 grid gap-12 border-t border-hairline pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <p className="label text-muted">{contactIntro.emailLabel}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={`mailto:${email}`}
                  className="draw-underline font-serif leading-[1.05] text-ink"
                  style={{ fontSize: 'var(--text-email)' }}
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={onCopy}
                  className={`inline-flex h-11 min-w-[96px] items-center justify-center border px-4 font-mono text-[12px] uppercase tracking-[1px] transition-colors sm:text-[13px] ${
                    copy === 'done'
                      ? 'border-rust bg-rust text-fog-2'
                      : 'border-ink text-ink hover:border-rust hover:text-rust'
                  }`}
                >
                  {contactIntro.copy[copy]}
                </button>
              </div>
            </div>
            <div>
              <p className="label text-muted">{contactIntro.elsewhereLabel}</p>
              <ul className="mt-4 flex gap-8 font-mono text-[13px] uppercase tracking-[1.5px] sm:text-[14px]">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="border-b border-hairline pb-1 text-ink transition-colors hover:border-rust hover:text-rust"
                    >
                      {l.label}
                      <span aria-hidden> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
        <p aria-live="polite" className="sr-only">
          {copy === 'done' ? contactIntro.copy.announce : ''}
        </p>
      </Container>
    </section>
  )
}
