import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { profile } from '../content/profile'
import { asset } from '../lib/asset'
import { useMediaQuery } from '../lib/useMediaQuery'
import { sceneInput } from '../three/sceneInput'

const ForestScene = lazy(() => import('../three/ForestScene'))

const { hero } = profile

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// The poster (with its painted ring) is the LCP image and the reduced-motion
// fallback. When the live scene has drawn, the poster fades away, revealing
// the ring-free photo with the WebGL ring and rain over it.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion() ?? false
  const mobile = !useMediaQuery('(min-width: 768px)')
  const [mountScene, setMountScene] = useState(false)
  const [live, setLive] = useState(false)
  const [active, setActive] = useState(true)

  // Load the 3D chunk only after the page is idle, so it never competes with the LCP.
  useEffect(() => {
    if (reduceMotion || !hasWebGL()) return
    const start = () => setMountScene(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(start, 300)
    return () => clearTimeout(id)
  }, [reduceMotion])

  // Pointer, scroll and visibility feed the scene and the DOM parallax.
  useEffect(() => {
    if (!mountScene) return
    const el = sectionRef.current
    if (!el) return
    sceneInput.autoDrift = mobile

    let frame = 0
    const write = () => {
      frame = 0
      el.style.setProperty('--px', sceneInput.pointer.x.toFixed(3))
      el.style.setProperty('--py', sceneInput.pointer.y.toFixed(3))
      el.style.setProperty('--scroll', sceneInput.scroll.toFixed(3))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }
    const onPointer = (e: PointerEvent) => {
      if (mobile || e.pointerType !== 'mouse') return
      sceneInput.pointer.x = (e.clientX / innerWidth) * 2 - 1
      sceneInput.pointer.y = (e.clientY / innerHeight) * 2 - 1
      schedule()
    }
    const onScroll = () => {
      sceneInput.scroll = Math.min(1, Math.max(0, scrollY / el.offsetHeight))
      schedule()
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
      cancelAnimationFrame(frame)
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [mountScene, mobile])

  const onReady = useCallback(() => setLive(true), [])

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="hero relative h-svh min-h-[560px] overflow-hidden bg-fog"
    >
      {mountScene && (
        <>
          <img src={asset(hero.backdrop)} alt="" decoding="async" className="hero-backdrop absolute inset-0 h-full w-full object-cover object-[68%_center]" />
          <Suspense fallback={null}>
            <ForestScene active={active} mobile={mobile} onReady={onReady} />
          </Suspense>
        </>
      )}

      <img
        src={asset(hero.poster)}
        alt=""
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-[68%_center] transition-opacity duration-[1400ms] ease-out ${
          live ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Drifting fog banks in front of the ring, and haze that thickens on the way out. */}
      {mountScene && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="fog-bank fog-bank-a" />
          <div className="fog-bank fog-bank-b" />
          <div className="hero-haze absolute inset-0 bg-fog" />
        </div>
      )}

      {/* Scene dissolves into the page. */}
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
