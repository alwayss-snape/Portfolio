import { profile } from '../content/profile'
import { asset } from '../lib/asset'

const { hero } = profile

// Milestone 2: static poster. The live ForestScene cross-fades over it in Milestone 4.
export default function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative h-svh min-h-[560px] overflow-hidden">
      <img
        src={asset(hero.poster)}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
      />
      {/* Scene dissolves into the page over the bottom 40%. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--fog)_88%,transparent)] via-45% to-fog md:h-[40%] md:via-70%"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-10 sm:px-8 sm:pb-14 lg:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[var(--tracking-kicker)] text-ink sm:text-[12px]">
          {hero.kicker}
        </p>
        <h1
          className="mt-5 font-serif font-normal text-ink"
          style={{ fontSize: 'var(--text-hero)', lineHeight: 'var(--leading-hero)' }}
        >
          {hero.headline[0]}
          <br />
          <em>{hero.headline[1]}</em>
        </h1>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[520px] text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{hero.sub}</p>
          <p className="font-mono text-[12px] tracking-[1px] text-muted">{hero.meta}</p>
        </div>
      </div>
    </section>
  )
}
