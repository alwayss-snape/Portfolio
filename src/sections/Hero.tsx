import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { profile } from '../content/profile'
import { useMediaQuery } from '../lib/useMediaQuery'
import { sceneInput } from '../three/sceneInput'
import { categories } from '../content/projects'
import { goTo, projectsHref } from '../lib/projectRoute'

const DataScene = lazy(() => import('../three/DataScene'))

const { hero } = profile

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Name first: the identity block is plain DOM (and the LCP), the 3D point
// cloud loads after idle and fades in beside it. Without WebGL the hero is
// simply the text on fog.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion() ?? false
  const mobile = !useMediaQuery('(min-width: 768px)')
  const [mountScene, setMountScene] = useState(false)
  // Checked once up front, so the phone cloud slot is reserved from the first
  // paint (no jump when the scene loads) and skipped where 3D can't run.
  const [canWebGL] = useState(hasWebGL)
  const [live, setLive] = useState(false)
  const [rendering, setRendering] = useState(true)
  // Which focus area is lit: hover/keyboard focus on a tile, else a hover on the cloud.
  const [pointed, setPointed] = useState<number | null>(null)
  const [cloudHover, setCloudHover] = useState<number | null>(null)
  const highlight = pointed ?? cloudHover
  const dragStart = useRef<{ x: number; y: number; touch: boolean } | null>(null)

  // Load the 3D chunk only after the page is idle, so it never competes with the LCP.
  useEffect(() => {
    if (!hasWebGL()) return
    const start = () => setMountScene(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(start, 300)
    return () => clearTimeout(id)
  }, [])

  // Pointer, scroll and visibility feed the scene.
  useEffect(() => {
    if (!mountScene || reduceMotion) return
    const el = sectionRef.current
    if (!el) return
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      sceneInput.pointer.x = (e.clientX / innerWidth) * 2 - 1
      sceneInput.pointer.y = (e.clientY / innerHeight) * 2 - 1
    }
    const onScroll = () => {
      sceneInput.scroll = Math.min(1, Math.max(0, scrollY / el.offsetHeight))
    }
    onScroll()

    let onScreen = true
    const sync = () => setRendering(onScreen && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(el)

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [mountScene, reduceMotion])

  const onReady = useCallback(() => setLive(true), [])

  // The drag surface sits over the cloud: it hit-tests clusters for hover and
  // turns the cloud on drag. Touch only turns it sideways, so vertical swipes
  // still scroll the page.
  const clusterAt = (e: React.PointerEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    let best: number | null = null
    let bestDist = sceneInput.clusterRadius * 1.4
    sceneInput.clusters.forEach((c, i) => {
      const d = Math.hypot(c.x - x, c.y - y)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }
  const onSurfaceDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch' }
    // Reduced motion: a press can still click a cluster, but never turns the cloud.
    sceneInput.drag.active = !reduceMotion
  }
  const onSurfaceMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    if (start) {
      if (reduceMotion) return
      sceneInput.drag.yaw = (e.clientX - start.x) * 0.008
      sceneInput.drag.pitch = start.touch ? 0 : (e.clientY - start.y) * 0.006
      return
    }
    if (e.pointerType === 'mouse') setCloudHover(clusterAt(e))
  }
  // A press that barely moves is a click: it opens that cluster's projects.
  const onSurfaceUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    dragStart.current = null
    sceneInput.drag.active = false
    if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return
    sceneInput.drag.yaw = 0
    sceneInput.drag.pitch = 0
    const hit = clusterAt(e)
    if (hit !== null) goTo(projectsHref(categories[hit].id))
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="hero relative flex min-h-svh flex-col overflow-hidden bg-fog"
    >
      {mountScene && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            live ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Suspense fallback={null}>
            <DataScene rendering={rendering} mobile={mobile} still={reduceMotion} highlight={highlight} onReady={onReady} />
          </Suspense>
        </div>
      )}

      {mountScene && live && <ClusterLabels highlight={highlight} />}

      <div className="relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-4 pb-8 pt-24 sm:px-8 lg:px-16 lg:pb-10 lg:pt-20 2xl:px-20">
        <div className="my-auto lg:max-w-[min(640px,48%)]">
          <p className="font-mono text-[12px] tracking-[1px] text-ink-2 sm:text-[13px]">
            <span aria-hidden className="mr-2.5 inline-block size-2 rounded-full bg-rust align-middle shadow-[0_0_0_4px_var(--rust-glow)]" />
            {hero.now.text}
          </p>
          <h1
            className="mt-6 font-serif font-normal text-ink"
            style={{ fontSize: 'var(--text-hero)', lineHeight: 'var(--leading-hero)', letterSpacing: '-0.02em' }}
          >
            {hero.name[0]}
            <br />
            <em>{hero.name[1]}</em>
          </h1>
          <p className="mt-6 flex items-center gap-4 font-medium text-ink" style={{ fontSize: 'var(--text-designation)' }}>
            <span aria-hidden className="h-0.5 w-8 shrink-0 bg-rust sm:w-11" />
            {profile.designation}
          </p>
          <p className="mt-5 max-w-[580px] text-[16px] leading-relaxed text-ink-2 sm:text-[18px]">{hero.claim}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.ctas.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className={`inline-flex h-11 items-center border px-5 font-mono text-[12px] uppercase tracking-[1px] transition-colors sm:h-12 sm:text-[13px] ${
                  c.primary
                    ? 'border-rust bg-rust text-fog-2 hover:border-ink hover:bg-ink'
                    : 'border-ink text-ink hover:border-rust hover:text-rust'
                }`}
              >
                {c.label}
                {c.primary && <span aria-hidden className="ml-2">→</span>}
              </a>
            ))}
          </div>
        </div>

        {/* Phones and tablets: the cloud gets its own space here, below the
            pitch and above the focus areas. Tap a cluster to open its projects. */}
        <div
          id="cloud-slot"
          aria-hidden
          onPointerDown={onSurfaceDown}
          onPointerMove={onSurfaceMove}
          onPointerUp={onSurfaceUp}
          onPointerCancel={() => {
            dragStart.current = null
            sceneInput.drag.active = false
          }}
          className={`mt-6 h-[min(88vw,420px)] touch-pan-y lg:hidden ${canWebGL ? '' : 'hidden'}`}
        />

        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-hairline lg:mt-8 lg:grid-cols-4">
          {hero.focus.map((f, i) => {
            const lit = highlight === i
            const cat = categories[i].id
            return (
              <li key={f.title} data-lit={lit || undefined} className="relative">
                {/* The divider above a lit item takes its cluster's colour. */}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -top-px h-0.5 origin-left transition-transform duration-500 ${
                    lit ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ background: `var(--cat-${cat})` }}
                />
                <a
                  href={projectsHref(cat)}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(projectsHref(cat))
                  }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setPointed(i)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setPointed(null)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && setPointed(i)}
                  onBlur={() => setPointed(null)}
                  className="group block pb-1 pt-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust"
                >
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: `var(--cat-${cat})` }} />
                    <span
                      className="font-serif text-[24px] leading-tight text-ink transition-colors duration-500 sm:text-[30px]"
                      style={lit ? { color: `var(--cat-${cat}-ink)` } : undefined}
                    >
                      {f.title}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-ink-2 sm:text-[14px]">
                    {f.text}
                    <span aria-hidden className={`ml-1.5 inline-block transition-opacity duration-300 ${lit ? 'opacity-100' : 'opacity-0'}`}>
                      →
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        {mountScene && live && (
          <div
            aria-hidden
            onPointerDown={onSurfaceDown}
            onPointerMove={onSurfaceMove}
            onPointerUp={onSurfaceUp}
            onPointerCancel={() => {
              dragStart.current = null
              sceneInput.drag.active = false
            }}
            onPointerLeave={() => setCloudHover(null)}
            className={`absolute bottom-[190px] left-1/2 right-0 top-16 hidden touch-pan-y lg:block ${
              cloudHover !== null ? 'cursor-pointer' : reduceMotion ? '' : 'cursor-grab active:cursor-grabbing'
            }`}
          />
        )}
        {mountScene && (
          <p
            aria-hidden
            className={`pointer-events-none absolute bottom-[170px] right-16 hidden max-w-[260px] text-right font-mono text-[11px] leading-relaxed tracking-[1px] text-muted transition-opacity duration-[1200ms] lg:block 2xl:right-20 ${
              live ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hero.sceneCaption}
          </p>
        )}
      </div>

    </section>
  )
}

// Category names that float beside each cluster and follow it as the cloud
// turns. Positions come from the scene each frame (sceneInput.clusters).
function ClusterLabels({ highlight }: { highlight: number | null }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  useEffect(() => {
    let frame = 0
    // Each label sits just outside its cluster, pushed away from the cloud's
    // centre, so it never lands on a neighbouring cluster.
    const tick = () => {
      const cs = sceneInput.clusters
      const r = sceneInput.clusterRadius
      if (cs.length) {
        const mx = cs.reduce((s, c) => s + c.x, 0) / cs.length
        const my = cs.reduce((s, c) => s + c.y, 0) / cs.length
        cs.forEach((c, i) => {
          const el = refs.current[i]
          if (!el) return
          const dx = c.x - mx
          const dy = c.y - my
          const len = Math.hypot(dx, dy) || 1
          const x = c.x + (dx / len) * r * 1.2
          const y = c.y + (dy / len) * r * 1.2
          // Anchor the label on the side facing the cluster, then keep it on screen.
          const lw = el.offsetWidth
          const lh = el.offsetHeight
          const side = Math.abs(dx) > Math.abs(dy)
          let left = side ? (dx < 0 ? x - lw : x) : x - lw / 2
          const top = side ? y - lh / 2 : dy < 0 ? y - lh : y
          left = Math.max(8, Math.min(left, window.innerWidth - lw - 8))
          el.style.transform = `translate(${left}px, ${top}px)`
        })
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {categories.map((c, i) => (
        <span
          key={c.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="absolute left-0 top-0 whitespace-nowrap bg-[color-mix(in_srgb,var(--fog)_75%,transparent)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[1.5px] transition-opacity duration-500 sm:text-[11px]"
          style={{
            color: `var(--cat-${c.id}-ink)`,
            opacity: highlight === null ? 0.85 : highlight === i ? 1 : 0.3,
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
  )
}
