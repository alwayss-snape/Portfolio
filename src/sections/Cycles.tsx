import { createRef, useCallback, useRef, useState, type RefObject } from 'react'
import {
  LazyMotion,
  domAnimation,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { cyclesIntro, experience } from '../content/experience'
import Container from '../components/Container'
import CycleRing, { SWEEP_FROM, SWEEP_TO, arcProgressAt } from '../components/CycleRing'
import SectionHeader from '../components/SectionHeader'
import { useMediaQuery } from '../lib/useMediaQuery'

// Most recent cycle first in the list; the ring stays chronological.
const roles = [...experience].reverse()

export default function Cycles() {
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const entryRefs = useRef(
    Object.fromEntries(experience.map((c) => [c.id, createRef<HTMLLIElement>()])) as Record<string, RefObject<HTMLLIElement | null>>,
  )
  const reduceMotion = useReducedMotion() ?? false
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = !useMediaQuery('(min-width: 768px)')

  // Desktop: the ring is sticky beside the list, so each arc draws while its
  // role passes the reading line — you read Albertsons, its arc draws.
  // `experience` is a module constant, so this hook loop has a fixed length.
  const entryProgress: Record<string, MotionValue<number>> = {}
  for (const c of experience) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    entryProgress[c.id] = useScroll({
      target: entryRefs.current[c.id],
      offset: ['start 0.7', 'end 0.45'],
    }).scrollYProgress
  }

  // Smaller screens: the ring sits above the list, so one sweep runs back in
  // time (today → 2018) as the ring itself scrolls through view.
  const { scrollYProgress: ringDraw } = useScroll({ target: ringRef, offset: ['start 0.9', 'end 0.45'] })
  const sweep = useTransform(ringDraw, (p) => SWEEP_TO - p * (SWEEP_TO - SWEEP_FROM))
  const sweepProgress: Record<string, MotionValue<number>> = {}
  for (const c of experience) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sweepProgress[c.id] = useTransform(sweep, (v) => arcProgressAt(c, v))
  }

  // Reduced motion: fully drawn and still.
  const full = useMotionValue(1)
  const progress = Object.fromEntries(
    experience.map((c) => [c.id, reduceMotion ? full : isDesktop ? entryProgress[c.id] : sweepProgress[c.id]]),
  )

  const { scrollYProgress: sectionPass } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const scrollRotate = useTransform(sectionPass, [0, 1], [0, -30])
  const noRotate = useMotionValue(0)
  const rotate = reduceMotion || isMobile ? noRotate : scrollRotate

  const [hovered, setHovered] = useState<string | null>(null)
  // The role whose arc is mid-draw is tinted, so list and ring move together.
  const [drawing, setDrawing] = useState<string | null>(null)
  const onDrawing = useCallback((id: string, isDrawing: boolean) => {
    setDrawing((prev) => (isDrawing ? id : prev === id ? null : prev))
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={sectionRef} id="experience" aria-labelledby="experience-title" className="scroll-mt-16 py-14 sm:py-20">
        <Container>
          <SectionHeader
            label={cyclesIntro.label}
            title={cyclesIntro.title}
            sub={cyclesIntro.sub}
            headingId="experience-title"
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-20">
            <div
              ref={ringRef}
              className="mx-auto w-[90vw] max-w-[660px] px-6 sm:w-full lg:sticky lg:top-24 lg:self-start lg:px-8"
            >
              <CycleRing progress={progress} rotate={rotate} hovered={hovered} onHover={setHovered} onDrawing={onDrawing} />
            </div>

            <ol className="divide-y divide-hairline border-y border-hairline">
              {roles.map((c) => {
                const lit = hovered === c.id || (!hovered && drawing === c.id)
                return (
                  <li
                    key={c.id}
                    ref={entryRefs.current[c.id]}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(c.id)}
                    onPointerLeave={() => setHovered(null)}
                    className="py-8"
                  >
                    <p className={`label ${c.current ? 'text-rust' : 'text-moss'}`}>
                      {cyclesIntro.cyclePrefix} {c.number} · {c.dates}
                      {c.current && ` · ${cyclesIntro.currentTag}`}
                    </p>
                    <h3
                      className={`mt-3 font-serif font-normal leading-none transition-colors ${
                        lit ? (c.current ? 'text-rust' : 'text-moss') : 'text-ink'
                      } duration-500`}
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
