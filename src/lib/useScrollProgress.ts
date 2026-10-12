import { useCallback, useEffect, type RefObject } from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'

// Scroll progress from plain scroll/resize listeners. motion's useScroll can
// hand off to the browser's native scroll timelines, and in some Safari
// versions those never update values read from JS (the cycle ring froze on
// iPhone). These hooks behave the same in every browser.

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function useScrollListener(update: () => void) {
  useEffect(() => {
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [update])
}

// 0 when the element's top reaches `from` (a fraction of the viewport height),
// 1 when its bottom reaches `to`: the same as useScroll's offset
// ['start <from>', 'end <to>'].
export function useElementProgress(ref: RefObject<HTMLElement | null>, from: number, to: number): MotionValue<number> {
  const progress = useMotionValue(0)
  useScrollListener(
    useStable(() => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = (from - to) * vh + rect.height
      progress.set(clamp01(total > 0 ? (from * vh - rect.top) / total : 1))
    }, [ref, from, to, progress]),
  )
  return progress
}

// 0 at the top of the page, 1 at the bottom.
export function usePageProgress(): MotionValue<number> {
  const progress = useMotionValue(0)
  useScrollListener(
    useStable(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.set(max > 0 ? clamp01(window.scrollY / max) : 0)
    }, [progress]),
  )
  return progress
}

// A memoised callback, so the listener re-binds only when its inputs change.
const useStable = (fn: () => void, deps: unknown[]) => useCallback(fn, deps) // eslint-disable-line react-hooks/exhaustive-deps
