import { cyclesIntro, experience, ringSpan, type Cycle, type YearMonth } from '../content/experience'

// Milestone 2: static, fully drawn ring (also the reduced-motion state).
// Milestone 3 adds the scroll-linked draw-in, rotation and hover sync.

const SIZE = 660
const C = SIZE / 2
const R = 236
const SPAN_YEARS = ringSpan.end - ringSpan.start

const today = new Date()
const NOW: YearMonth = { year: today.getFullYear(), month: today.getMonth() + 1 }

// 0 = 12 o'clock at the ring's start year, increasing clockwise.
const frac = ({ year, month }: YearMonth) => (year - ringSpan.start + (month - 1) / 12) / SPAN_YEARS

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

export default function CycleRing() {
  const years = Array.from({ length: SPAN_YEARS }, (_, i) => ringSpan.start + i)

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={cyclesIntro.ringLabel} className="h-auto w-full overflow-visible">
      <circle cx={C} cy={C} r={R} fill="none" className="stroke-hairline" strokeWidth={1} />

      {years.map((y) => {
        const f = (y - ringSpan.start) / SPAN_YEARS
        const a = point(f, R - 7)
        const b = point(f, R + 7)
        const t = point(f, R + 38)
        return (
          <g key={y}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-hairline" strokeWidth={1} />
            <text
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`font-mono text-[13px] tracking-[1px] max-sm:text-[22px] ${y === NOW.year ? 'fill-rust' : 'fill-muted'}`}
            >
              {y}
            </text>
          </g>
        )
      })}

      {experience.map((c) => {
        const f0 = frac(c.start)
        const f1 = frac(c.end === 'now' ? NOW : c.end)
        const s = arcStyle(c)
        const end = point(f1, R)
        return (
          <g key={c.id} data-cycle={c.id}>
            <path
              d={arcPath(f0, f1)}
              fill="none"
              className={s.className}
              strokeWidth={s.width}
              strokeDasharray={s.dash}
              strokeLinecap={s.dash ? 'butt' : 'round'}
            />
            {c.milestones?.map((m) => {
              const mf = frac(m.at)
              const a = point(mf, R - 12)
              const b = point(mf, R + 12)
              return (
                <line key={m.label} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-moss" strokeWidth={2}>
                  <title>{m.label}</title>
                </line>
              )
            })}
            {c.current && (
              <g>
                <circle cx={end.x} cy={end.y} r={18} className="fill-[var(--rust-glow)]" />
                <circle cx={end.x} cy={end.y} r={13} fill="none" className="cycle-pulse stroke-rust" strokeWidth={1.5} />
                <circle cx={end.x} cy={end.y} r={7} className="fill-rust" />
              </g>
            )}
          </g>
        )
      })}

      <text x={C} y={C - 6} textAnchor="middle" className="fill-ink font-serif text-[72px]">
        {cyclesIntro.centre.value}
      </text>
      <text x={C} y={C + 32} textAnchor="middle" className="fill-muted font-mono text-[12px] uppercase tracking-[3px] max-sm:text-[18px] max-sm:tracking-[2px]">
        {cyclesIntro.centre.caption}
      </text>
    </svg>
  )
}
