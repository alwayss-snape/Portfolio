// Milestone 1 placeholder: confirms tokens, fonts, content and the base path.
// Replaced by the real sections in Milestone 2.
import { profile, nav } from './content/profile'
import { experience } from './content/experience'
import { resumePages, resumeAlt } from './content/resume'

const swatches = [
  'fog', 'fog-2', 'ink', 'ink-2', 'moss', 'muted', 'hairline', 'rust', 'rust-light', 'on-scene',
]

export default function App() {
  const base = import.meta.env.BASE_URL
  const page = resumePages[0]

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="flex items-center justify-between">
        <span className="font-mono text-ink">{profile.wordmark}</span>
        <nav className="flex gap-5 font-mono text-sm lowercase">
          {nav.filter((n) => !n.hidden).map((n) => (
            <span key={n.id} className={n.id === 'contact' ? 'text-rust' : 'text-ink'}>
              {n.label}
            </span>
          ))}
        </nav>
      </header>

      <p className="label mt-24 text-rust" style={{ letterSpacing: 'var(--tracking-kicker)' }}>
        {profile.hero.kicker}
      </p>
      <h1
        className="mt-6 font-serif text-ink"
        style={{ fontSize: 'var(--text-hero)', lineHeight: 'var(--leading-hero)' }}
      >
        {profile.hero.headline[0]}
        <br />
        <em>{profile.hero.headline[1]}</em>
      </h1>
      <p className="mt-6 max-w-[620px] text-[17px]">{profile.hero.sub}</p>

      <section className="mt-20 border-t border-hairline pt-8">
        <p className="label text-muted">Milestone 1 · tokens</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map((s) => (
            <li key={s} className="font-mono text-xs text-ink-2">
              <span
                className="mb-2 block h-12 border border-hairline"
                style={{ background: `var(--${s})` }}
              />
              --{s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-hairline pt-8">
        <p className="label text-muted">Milestone 1 · content</p>
        <ul className="mt-4 space-y-2">
          {experience.map((c) => (
            <li key={c.id} className="flex items-baseline gap-4">
              <span className={`label ${c.current ? 'text-rust' : 'text-moss'}`}>
                Cycle {c.number} · {c.dates}
              </span>
              <span className="font-serif text-3xl text-ink">{c.company}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-hairline pt-8">
        <p className="label text-muted">Milestone 1 · base path ({base})</p>
        <picture>
          <source srcSet={`${base}${page.webp}`} type="image/webp" />
          <img
            src={`${base}${page.png}`}
            alt={resumeAlt(0)}
            width={page.width}
            height={page.height}
            loading="lazy"
            draggable={false}
            className="mt-4 h-auto w-40 border border-hairline bg-fog-2"
          />
        </picture>
      </section>
    </main>
  )
}
