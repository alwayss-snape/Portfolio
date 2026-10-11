import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { profile } from '../content/profile'
import { useMediaQuery } from '../lib/useMediaQuery'
import { sceneInput } from '../three/sceneInput'

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
  const [live, setLive] = useState(false)
  const [active, setActive] = useState(true)

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
    const sync = () => setActive(onScreen && document.visibilityState === 'visible')
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
            <DataScene active={active} mobile={mobile} still={reduceMotion} onReady={onReady} />
          </Suspense>
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-8 pt-[43svh] sm:px-8 md:pt-28 lg:px-16 lg:pb-12">
        <div className="md:my-auto md:max-w-[640px]">
          <p className="font-mono text-[12px] tracking-[1px] text-ink-2 sm:text-[13px]">
            <span aria-hidden className="mr-2.5 inline-block size-2 rounded-full bg-rust align-middle shadow-[0_0_0_4px_var(--rust-glow)]" />
            <span className="font-medium text-ink">{hero.now.tag}</span> · {hero.now.text}
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

        <dl className="mt-12 grid grid-cols-2 gap-x-6 border-t border-hairline md:mt-10 md:grid-cols-4">
          {hero.stats.map((s) => (
            <div key={s.value} className="flex flex-col-reverse pt-5">
              <dt className="mt-2 text-[13px] leading-snug text-ink-2 sm:text-[14px]">{s.label}</dt>
              <dd className="font-serif text-[34px] leading-none text-ink sm:text-[44px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {mountScene && (
        <p
          aria-hidden
          className={`pointer-events-none absolute max-w-[240px] max-md:hidden text-right font-mono text-[11px] leading-relaxed tracking-[1px] text-muted transition-opacity duration-[1200ms] bottom-[210px] right-8 lg:right-16 ${
            live ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {hero.sceneCaption}
        </p>
      )}
    </section>
  )
}
