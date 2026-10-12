import type { ReactNode } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'

type Props = { children: ReactNode; className?: string; delay?: number }

// Fades content up a little the first time it scrolls into view.
// Reduced motion: rendered as-is, always visible.
export default function Reveal({ children, className, delay = 0 }: Props) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
