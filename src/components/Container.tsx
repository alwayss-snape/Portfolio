import type { ReactNode } from 'react'

export default function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 ${className}`}>{children}</div>
}
