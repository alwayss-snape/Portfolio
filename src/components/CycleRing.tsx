import { useEffect, useId, useRef } from 'react'
import { m, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { cyclesIntro, experience, ringSpan, type Cycle, type YearMonth } from '../content/experience'

const SIZE = 660
const C = SIZE / 2
const R = 236
const SPAN_YEARS = ringSpan.end - ringSpan.start

const today = new Date()
const NOW: YearMonth = { year: today.getFullYear(), month: today.getMonth() + 1 }

// 0 = 12 o'clock at the ring's start year, increasing clockwise.
const frac = ({ year, month }: YearMonth) => (year - ringSpan.start + (month - 1) / 12) / SPAN_YEARS
const endOf = (c: Cycle) => frac(c.end === 'now' ? NOW : c.end)

// The sweep runs backwards in time, from today to the first cycle's start,
// so the ring draws in the same order the list reads (newest first).
export const SWEEP_FROM = Math.min(...experience.map((c) => frac(c.start)))
export const SWEEP_TO = Math.max(...experience.map(endOf))

const point = (f: number, r: number) => {
  const a = f * 2 * Math.PI - Math.PI / 2
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}

// Drawn from the later date back to the earlier one (anticlockwise), so
// pathLength reveals each arc starting at its end date.
const arcPath = (f0: number, f1: number, r = R) => {
  const p0 = point(f0, r)
  const p1 = point(f1, r)
  const large = f1 - f0 > 0.5 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`
}

const arcStyle = (c: Cycle) =>
  c.current
    ? { className: 'stroke-rust', width: 10, dash: undefined }
    : { className: 'stroke-moss', width: 8, dash: undefined }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// How far an arc is drawn when a single sweep runs back in time across the ring.
export const arcProgressAt = (c: Cycle, sweep: number) => {
  const f0 = frac(c.start)
  const f1 = endOf(c)
  return clamp01((f1 - sweep) / (f1 - f0))
}

type Props = {
  progress: Record<string, MotionValue<number>> // per cycle id, 0 → 1 drawn
  rotate: MotionValue<number> // degrees
  hovered: string | null
  onHover: (id: string | null) => void
  onDrawing: (id: string, drawing: boolean) => void
}

export default function CycleRing({ progress, rotate, hovered, onHover, onDrawing }: Props) {
  const years = Array.from({ length: SPAN_YEARS }, (_, i) => ringSpan.start + i)
  const ringRef = useRef<SVGGElement>(null)
  const labelRefs = useRef<(SVGTextElement | null)[]>([])

  // The ring turns via SVG's own rotate attribute, and each year label is
  // moved around the circle so it stays upright beside its tick. CSS rotation
  // with transform-box is applied around the wrong origin in Safari, which
  // pulled the labels off the ring on iPhone.
  useEffect(() => {
    const apply = (r: number) => {
      ringRef.current?.setAttribute('transform', `rotate(${r} ${C} ${C})`)
      years.forEach((y, i) => {
        const el = labelRefs.current[i]
        if (!el) return
        const t = point((y - ringSpan.start) / SPAN_YEARS + r / 360, R + 38)
        el.setAttribute('x', t.x.toFixed(2))
        el.setAttribute('y', t.y.toFixed(2))
      })
    }
    apply(rotate.get())
    return rotate.on('change', apply)
    // years is derived from module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotate])

  return (
    <div className="relative [container-type:inline-size]">
      <m.svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={cyclesIntro.ringLabel}
        className="block h-auto w-full overflow-visible"
      >
        <g ref={ringRef}>
          <circle cx={C} cy={C} r={R} fill="none" className="stroke-hairline" strokeWidth={1} />
          {years.map((y) => {
            const f = (y - ringSpan.start) / SPAN_YEARS
            const a = point(f, R - 7)
            const b = point(f, R + 7)
            return <line key={y} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-hairline" strokeWidth={1} />
          })}
          {experience.map((c) => (
            <Arc
              key={c.id}
              cycle={c}
              progress={progress[c.id]}
              dimmed={hovered !== null && hovered !== c.id}
              highlighted={hovered === c.id}
              onHover={onHover}
              onDrawing={onDrawing}
            />
          ))}
        </g>

        {/* Year labels stay upright: positioned around the circle, never rotated. */}
        {years.map((y, i) => {
          const t = point((y - ringSpan.start) / SPAN_YEARS, R + 38)
          return (
            <text
              key={y}
              ref={(el) => {
                labelRefs.current[i] = el
              }}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`font-mono text-[13px] tracking-[1px] max-sm:text-[22px] ${y === NOW.year ? 'fill-rust' : 'fill-muted'}`}
            >
              {y}
            </text>
          )
        })}
      </m.svg>

      {/* Centre copy sits outside the rotating SVG so it never turns. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="font-serif leading-none text-ink" style={{ fontSize: 'clamp(36px, 10.9cqw, 72px)' }}>
          {cyclesIntro.centre.value}
        </p>
        <p className="label mt-3 text-[10px] text-muted sm:text-[12px]">{cyclesIntro.centre.caption}</p>
      </div>
    </div>
  )
}

type ArcProps = {
  cycle: Cycle
  progress: MotionValue<number>
  dimmed: boolean
  highlighted: boolean
  onHover: (id: string | null) => void
  onDrawing: (id: string, drawing: boolean) => void
}

function Arc({ cycle: c, progress, dimmed, highlighted, onHover, onDrawing }: ArcProps) {
  const maskId = useId()
  const f0 = frac(c.start)
  const f1 = endOf(c)
  const d = arcPath(f0, f1)
  const s = arcStyle(c)
  const end = point(f1, R)

  // The "now" dot marks where the sweep begins, so it appears first.
  const endOpacity = useTransform(progress, [0, 0.04], [0, 1])
  // A round cap at pathLength 0 still paints a dot, so hide the arc until it starts.
  const started = useTransform(progress, (p) => (p > 0 ? 1 : 0))
  useMotionValueEvent(progress, 'change', (p) => onDrawing(c.id, p > 0 && p < 1))

  const width = s.width + (highlighted ? 3 : 0)
  const common = {
    d,
    fill: 'none',
    strokeWidth: width,
    className: `${s.className} transition-[stroke-width,opacity] duration-300`,
    style: { opacity: dimmed ? 0.3 : 1 },
  }

  return (
    <g data-cycle={c.id}>
      {s.dash ? (
        // pathLength drives stroke-dasharray, so a dashed arc is revealed through a mask instead.
        <>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
            <m.path d={d} fill="none" stroke="white" strokeWidth={width + 6} style={{ pathLength: progress }} />
          </mask>
          <path {...common} strokeDasharray={s.dash} strokeLinecap="butt" mask={`url(#${maskId})`} />
        </>
      ) : (
        <m.g style={{ opacity: started }}>
          <m.path {...common} strokeLinecap="round" style={{ ...common.style, pathLength: progress }} />
        </m.g>
      )}

      {c.milestones?.map((ms) => {
        const mf = frac(ms.at)
        const a = point(mf, R - 12)
        const b = point(mf, R + 12)
        return (
          <Milestone key={ms.label} progress={progress} at={(f1 - mf) / (f1 - f0)} a={a} b={b} label={ms.label} />
        )
      })}

      {c.current && (
        <m.g style={{ opacity: endOpacity }}>
          <circle cx={end.x} cy={end.y} r={18} className="fill-[var(--rust-glow)]" />
          <circle cx={end.x} cy={end.y} r={13} fill="none" className="cycle-pulse stroke-rust" strokeWidth={1.5} />
          <circle cx={end.x} cy={end.y} r={7} className="fill-rust" />
        </m.g>
      )}

      {/* Wide invisible stroke makes the arc easy to hover. */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={28}
        className="cursor-pointer"
        onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(c.id)}
        onPointerLeave={() => onHover(null)}
      />
    </g>
  )
}

type MilestoneProps = {
  progress: MotionValue<number>
  at: number
  a: { x: number; y: number }
  b: { x: number; y: number }
  label: string
}

function Milestone({ progress, at, a, b, label }: MilestoneProps) {
  const opacity = useTransform(progress, [at, at + 0.02], [0, 1])
  return (
    <m.line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-moss" strokeWidth={2} style={{ opacity }}>
      <title>{label}</title>
    </m.line>
  )
}
