import { useCallback, useRef, useState } from 'react'
import { LazyMotion, domAnimation, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { cyclesIntro, experience } from '../content/experience'
import Container from '../components/Container'
import CycleRing, { SWEEP_FROM, SWEEP_TO } from '../components/CycleRing'
import SectionHeader from '../components/SectionHeader'
import { useMediaQuery } from '../lib/useMediaQuery'

// Most recent cycle first in the list; the ring stays chronological.
const roles = [...experience].reverse()

export default function Cycles() {
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion() ?? false
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = !useMediaQuery('(min-width: 768px)')

  // Desktop: the ring is sticky, so the draw-in tracks the whole section.
  // Below that, the ring scrolls past on its own, so it tracks the ring.
  const { scrollYProgress: sectionDraw } = useScroll({ target: sectionRef, offset: ['start 0.6', 'end end'] })
  const { scrollYProgress: ringDraw } = useScroll({ target: ringRef, offset: ['start 0.9', 'end 0.45'] })
  const { scrollYProgress: sectionPass } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const toSweep = (p: number) => SWEEP_FROM + p * (SWEEP_TO - SWEEP_FROM)
  const sectionSweep = useTransform(sectionDraw, toSweep)
  const ringSweep = useTransform(ringDraw, toSweep)
  const scrollRotate = useTransform(sectionPass, [0, 1], [0, -30])
  // Reduced motion: fully drawn, never turning. Phones: draw-in only.
  const fullSweep = useMotionValue(SWEEP_TO)
  const noRotate = useMotionValue(0)

  const sweep = reduceMotion ? fullSweep : isDesktop ? sectionSweep : ringSweep
  const rotate = reduceMotion || isMobile ? noRotate : scrollRotate

  const [hovered, setHovered] = useState<string | null>(null)
  const [drawn, setDrawn] = useState<Record<string, boolean>>({})
  const onDrawn = useCallback((id: string, isDrawn: boolean) => {
    setDrawn((prev) => (prev[id] === isDrawn ? prev : { ...prev, [id]: isDrawn }))
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={sectionRef} id="cycles" aria-labelledby="cycles-title" className="scroll-mt-16 py-24 sm:py-32">
        <Container>
          <SectionHeader
            label={cyclesIntro.label}
            title={cyclesIntro.title}
            sub={cyclesIntro.sub}
            headingId="cycles-title"
          />

          <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-20">
            <div
              ref={ringRef}
              className="mx-auto w-[90vw] max-w-[660px] px-6 sm:w-full lg:sticky lg:top-24 lg:self-start lg:px-8"
            >
              <CycleRing sweep={sweep} rotate={rotate} hovered={hovered} onHover={setHovered} onDrawn={onDrawn} />
            </div>

            <ol className="divide-y divide-hairline border-y border-hairline">
              {roles.map((c) => {
                const visible = reduceMotion || drawn[c.id]
                return (
                  <li
                    key={c.id}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(c.id)}
                    onPointerLeave={() => setHovered(null)}
                    className={`py-8 transition-opacity duration-700 ${
                      !visible ? 'opacity-40' : hovered && hovered !== c.id ? 'opacity-60' : 'opacity-100'
                    }`}
                  >
                    <p className={`label ${c.current ? 'text-rust' : 'text-moss'}`}>
                      {cyclesIntro.cyclePrefix} {c.number} · {c.dates}
                      {c.current && ` · ${cyclesIntro.currentTag}`}
                    </p>
                    <h3
                      className={`mt-3 font-serif font-normal leading-none transition-colors ${
                        hovered === c.id ? (c.current ? 'text-rust' : 'text-moss') : 'text-ink'
                      }`}
                      style={{ fontSize: 'var(--text-company)' }}
                    >
                      {c.company}
                    </h3>
                    <p className="mt-3 text-[15px] font-medium text-ink sm:text-[16px]">{c.role}</p>
                    <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">
                      {c.bullets.map((b) => (
                        <li
                          key={b.text}
                          className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-hairline"
                        >
                          {b.title && <span className="font-medium text-ink">{b.title}: </span>}
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        </Container>
      </section>
    </LazyMotion>
  )
}
