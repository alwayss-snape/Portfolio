import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, projects, projectsIntro, type Category, type Project } from '../content/projects'
import type { ProjectDetail } from '../content/projectDetails'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { projectHref, projectsHref, useProjectRoute } from '../lib/projectRoute'

const label = (c: Category) => categories.find((x) => x.id === c)!.label
const inFilter = (p: Project, f: Category | null) => !f || p.category === f || !!p.also?.includes(f)
const count = (f: Category | null) => projects.filter((p) => inFilter(p, f)).length

// The write-ups load once, the first time any project is opened.
let detailsPromise: Promise<Record<string, ProjectDetail>> | null = null
const loadDetails = () => (detailsPromise ??= import('../content/projectDetails').then((m) => m.projectDetails))

export default function Projects() {
  const route = useProjectRoute()
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Category | null>(route.filter)
  const [openId, setOpenId] = useState<string | null>(route.open)
  const wasOpen = useRef(false)

  // Follow hash links (from the hero's clusters and focus areas, or a shared URL).
  // Closing a project with Back just closes it, without jumping the page.
  useEffect(() => {
    setOpenId(route.open)
    const closing = wasOpen.current && !route.open
    wasOpen.current = !!route.open
    if (!route.inProjects || route.open || closing) return
    setFilter(route.filter)
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    sectionRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [route])

  const shown = useMemo(() => projects.filter((p) => inFilter(p, filter)), [filter])

  // Chips update the URL in place, so filtering doesn't pile up history entries.
  const choose = (f: Category | null) => {
    setFilter(f)
    history.replaceState(null, '', projectsHref(f))
  }

  return (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-title" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionHeader
          label={projectsIntro.label}
          title={projectsIntro.title}
          sub={projectsIntro.sub}
          headingId="projects-title"
        />
        <Reveal delay={0.08}>
          <div role="group" aria-label={projectsIntro.title} className="mt-10 flex flex-wrap gap-2">
            {[null, ...categories.map((c) => c.id)].map((f) => {
              const on = filter === f
              return (
                <button
                  key={f ?? 'all'}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(f)}
                  className={`inline-flex h-10 items-center gap-2.5 border px-4 font-mono text-[12px] uppercase tracking-[1px] transition-colors sm:text-[13px] ${
                    on ? 'border-ink bg-ink text-fog-2' : 'border-hairline text-ink hover:border-ink'
                  }`}
                >
                  {f && <span aria-hidden className="size-2 rounded-full" style={{ background: `var(--cat-${f})` }} />}
                  {f ? label(f) : projectsIntro.all}
                  <span className={on ? 'text-fog-2/70' : 'text-muted'}>{count(f)}</span>
                </button>
              )
            })}
          </div>

          <ul key={filter ?? 'all'} className="mt-8 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <li key={p.id} className="card-in bg-fog" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <a
                  href={projectHref(p.id)}
                  className="group relative flex h-full flex-col p-6 transition-colors hover:bg-fog-2 focus-visible:bg-fog-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rust sm:p-7"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: `var(--cat-${p.category})` }}
                  />
                  <h3 className="font-serif text-[28px] leading-[1.05] text-ink sm:text-[30px]">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <span className="flex items-center gap-2 font-mono text-[12px] tracking-[0.5px]" style={{ color: `var(--cat-${p.category}-ink)` }}>
                      <span aria-hidden className="size-2 rounded-full" style={{ background: `var(--cat-${p.category})` }} />
                      {label(p.category)}
                    </span>
                    <span className="font-mono text-[12px] uppercase tracking-[1px] text-ink transition-colors group-hover:text-rust">
                      {projectsIntro.open} <span aria-hidden>→</span>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <ProjectDialog
        openId={openId}
        list={shown.some((p) => p.id === openId) ? shown : projects}
        onNavigate={(id) => {
          setOpenId(id)
          history.replaceState(null, '', projectHref(id))
        }}
        onClose={() => {
          // Closing rewrites the URL without a hashchange, so forget the open
          // project here; otherwise the next hash link is mistaken for a close.
          wasOpen.current = false
          setOpenId(null)
          history.replaceState(null, '', projectsHref(filter))
        }}
      />
    </section>
  )
}

type DialogProps = {
  openId: string | null
  list: Project[] // previous/next step through the current filter
  onNavigate: (id: string) => void
  onClose: () => void
}

function ProjectDialog({ openId, list, onNavigate, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [details, setDetails] = useState<Record<string, ProjectDetail> | null>(null)
  const project = projects.find((p) => p.id === openId) ?? null
  const index = project ? list.findIndex((p) => p.id === project.id) : -1
  const detail = project && details?.[project.id]

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (project && !d.open) {
      d.showModal()
      loadDetails().then(setDetails)
    } else if (!project && d.open) d.close()
  }, [project])

  // Each project opens scrolled to the top.
  useEffect(() => {
    ref.current?.querySelector('[data-scroll]')?.scrollTo(0, 0)
  }, [openId])

  const step = (dir: number) => onNavigate(list[(index + dir + list.length) % list.length].id)

  // ← and → step through projects while the panel is open.
  const stepRef = useRef(step)
  stepRef.current = step
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stepRef.current(-1)
      if (e.key === 'ArrowRight') stepRef.current(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project])

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      onClose={() => project && onClose()}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="project-dialog m-0 ml-auto h-dvh max-h-none w-full max-w-[760px] bg-fog p-0 text-ink"
    >
      {project && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3 font-mono text-[12px] uppercase tracking-[1px] sm:px-8">
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} aria-label={projectsIntro.prev} className="grid size-10 place-items-center border border-hairline transition-colors hover:border-ink hover:text-rust">←</button>
              <button type="button" onClick={() => step(1)} aria-label={projectsIntro.next} className="grid size-10 place-items-center border border-hairline transition-colors hover:border-ink hover:text-rust">→</button>
              <span className="self-center pl-2 text-muted">
                {index + 1} / {list.length}
              </span>
            </div>
            <button type="button" autoFocus onClick={() => ref.current?.close()} className="min-h-10 px-2 py-2 hover:text-rust">
              {projectsIntro.close} ✕
            </button>
          </div>

          <div data-scroll className="flex-1 overflow-y-auto px-5 pb-16 pt-10 sm:px-8">
            <h2 id="project-dialog-title" className="font-serif text-[40px] leading-[1] sm:text-[52px]">
              {project.title}
            </h2>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[12px] tracking-[0.5px]">
              {[project.category, ...(project.also ?? [])].map((c) => (
                <span key={c} className="flex items-center gap-2" style={{ color: `var(--cat-${c}-ink)` }}>
                  <span aria-hidden className="size-2 rounded-full" style={{ background: `var(--cat-${c})` }} />
                  {label(c)}
                </span>
              ))}
            </p>
            <p className="mt-6 text-[18px] leading-relaxed text-ink">{project.summary}</p>

            {detail ? (
              <div className="mt-10 space-y-9 text-[16px] leading-relaxed text-ink-2">
                <DetailBlock title={projectsIntro.overview}>
                  <p>{detail.overview}</p>
                </DetailBlock>
                <DetailBlock title={projectsIntro.approach}>
                  <Bullets items={detail.approach} />
                </DetailBlock>
                {detail.outcome && (
                  <DetailBlock title={projectsIntro.outcome}>
                    <Bullets items={detail.outcome} />
                  </DetailBlock>
                )}
              </div>
            ) : (
              <p className="mt-10 font-mono text-[12px] text-muted">{projectsIntro.loading}</p>
            )}

            {project.stack.length > 0 && (
              <DetailBlock title={projectsIntro.stackLabel} className="mt-9">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="border border-hairline px-2.5 py-1 font-mono text-[12px] text-ink">
                      {s}
                    </li>
                  ))}
                </ul>
              </DetailBlock>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

function DetailBlock({ title, className = '', children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="label mb-3 text-rust">{title}</h3>
      {children}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-hairline">
          {t}
        </li>
      ))}
    </ul>
  )
}
