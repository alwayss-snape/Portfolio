import { useId } from 'react'
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

// The sweep runs from the first cycle's start to the last cycle's end.
export const SWEEP_FROM = Math.min(...experience.map((c) => frac(c.start)))
export const SWEEP_TO = Math.max(...experience.map(endOf))

const point = (f: number, r: number) => {
  const a = f * 2 * Math.PI - Math.PI / 2
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}

const arcPath = (f0: number, f1: number, r = R) => {
  const p0 = point(f0, r)
  const p1 = point(f1, r)
  const large = f1 - f0 > 0.5 ? 1 : 0
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
}

const arcStyle = (c: Cycle) =>
  c.current
    ? { className: 'stroke-rust', width: 10, dash: undefined }
    : c.kind === 'education'
      ? { className: 'stroke-muted', width: 6, dash: '4 7' }
      : { className: 'stroke-moss', width: 8, dash: undefined }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

type Props = {
  sweep: MotionValue<number> // current position on the ring, SWEEP_FROM → SWEEP_TO
  rotate: MotionValue<number> // degrees
  hovered: string | null
  onHover: (id: string | null) => void
  onDrawn: (id: string, drawn: boolean) => void
}

export default function CycleRing({ sweep, rotate, hovered, onHover, onDrawn }: Props) {
  const years = Array.from({ length: SPAN_YEARS }, (_, i) => ringSpan.start + i)
  const counterRotate = useTransform(rotate, (r) => -r)

  return (
    <div className="relative [container-type:inline-size]">
      <m.svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={cyclesIntro.ringLabel}
        className="block h-auto w-full overflow-visible"
        style={{ rotate }}
      >
        <circle cx={C} cy={C} r={R} fill="none" className="stroke-hairline" strokeWidth={1} />

        {years.map((y) => {
          const f = (y - ringSpan.start) / SPAN_YEARS
          const a = point(f, R - 7)
          const b = point(f, R + 7)
          const t = point(f, R + 38)
          return (
            <g key={y}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-hairline" strokeWidth={1} />
              {/* Labels counter-rotate so they stay upright while the ring turns. */}
              <m.text
                x={t.x}
                y={t.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ rotate: counterRotate, transformBox: 'fill-box', transformOrigin: 'center' }}
                className={`font-mono text-[13px] tracking-[1px] max-sm:text-[22px] ${y === NOW.year ? 'fill-rust' : 'fill-muted'}`}
              >
                {y}
              </m.text>
            </g>
          )
        })}

        {experience.map((c) => (
          <Arc
            key={c.id}
            cycle={c}
            sweep={sweep}
            dimmed={hovered !== null && hovered !== c.id}
            highlighted={hovered === c.id}
            onHover={onHover}
            onDrawn={onDrawn}
          />
        ))}
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
  sweep: MotionValue<number>
  dimmed: boolean
  highlighted: boolean
  onHover: (id: string | null) => void
  onDrawn: (id: string, drawn: boolean) => void
}

function Arc({ cycle: c, sweep, dimmed, highlighted, onHover, onDrawn }: ArcProps) {
  const maskId = useId()
  const f0 = frac(c.start)
  const f1 = endOf(c)
  const d = arcPath(f0, f1)
  const s = arcStyle(c)
  const end = point(f1, R)

  const progress = useTransform(sweep, (v) => clamp01((v - f0) / (f1 - f0)))
  const endOpacity = useTransform(progress, [0.97, 1], [0, 1])
  // A round cap at pathLength 0 still paints a dot, so hide the arc until it starts.
  const started = useTransform(progress, (p) => (p > 0 ? 1 : 0))
  useMotionValueEvent(progress, 'change', (p) => onDrawn(c.id, p >= 1))

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
          <Milestone key={ms.label} progress={progress} at={(mf - f0) / (f1 - f0)} a={a} b={b} label={ms.label} />
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
