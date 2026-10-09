import { cyclesIntro, experience } from '../content/experience'
import Container from '../components/Container'
import CycleRing from '../components/CycleRing'
import SectionHeader from '../components/SectionHeader'

// Most recent cycle first in the list; the ring stays chronological.
const roles = [...experience].reverse()

export default function Cycles() {
  return (
    <section id="cycles" aria-labelledby="cycles-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader
          label={cyclesIntro.label}
          title={cyclesIntro.title}
          sub={cyclesIntro.sub}
          headingId="cycles-title"
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-20">
          <div className="mx-auto w-[90vw] max-w-[660px] px-6 sm:w-full lg:sticky lg:top-24 lg:self-start lg:px-8">
            <CycleRing />
          </div>

          <ol className="divide-y divide-hairline border-y border-hairline">
            {roles.map((c) => (
              <li key={c.id} className="py-8">
                <p className={`label ${c.current ? 'text-rust' : 'text-moss'}`}>
                  {cyclesIntro.cyclePrefix} {c.number} · {c.dates}
                  {c.current && ` · ${cyclesIntro.currentTag}`}
                </p>
                <h3 className="mt-3 font-serif font-normal leading-none text-ink" style={{ fontSize: 'var(--text-company)' }}>
                  {c.company}
                </h3>
                <p className="mt-3 text-[15px] font-medium text-ink sm:text-[16px]">{c.role}</p>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">
                  {c.bullets.map((b) => (
                    <li key={b.text} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-hairline">
                      {b.title && <span className="font-medium text-ink">{b.title}: </span>}
                      {b.text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
