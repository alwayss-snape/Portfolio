import type { ReactNode } from 'react'
import { brandPaths, type BrandIcon } from './brandPaths'

// Line glyphs drawn for tools without an official mark and for methods.
// 24×24, 1.5px stroke, round joins — sized to sit beside the brand marks.
const glyphs = {
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  // A single bold S in a tile: the letters themselves are illegible at 18px.
  sas: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M15.5 8.6c-.8-.9-2-1.4-3.4-1.4-1.9 0-3.3 1-3.3 2.4 0 3.2 6.9 1.8 6.9 5.1 0 1.4-1.5 2.5-3.5 2.5-1.4 0-2.7-.6-3.6-1.5" />
    </>
  ),
  // Leaf-wise growth: only one branch keeps splitting.
  lightgbm: (
    <>
      <path d="M12 5L6.5 11.5M12 5l5.5 6.5M17.5 11.5L14 18M17.5 11.5L21 18" />
      <circle cx="12" cy="5" r="1.8" fill="currentColor" />
      <circle cx="6.5" cy="11.5" r="1.8" fill="currentColor" />
      <circle cx="17.5" cy="11.5" r="1.8" fill="currentColor" />
      <circle cx="14" cy="18.5" r="1.5" />
      <circle cx="21" cy="18.5" r="1.5" />
    </>
  ),
  // Level-wise trees, boosted: two small trees side by side.
  xgboost: (
    <>
      <path d="M6.5 7L3.5 15M6.5 7l3 8M17.5 7l-3 8M17.5 7l3 8" />
      <circle cx="6.5" cy="7" r="1.8" fill="currentColor" />
      <circle cx="17.5" cy="7" r="1.8" fill="currentColor" />
      <circle cx="3.5" cy="16" r="1.5" />
      <circle cx="9.5" cy="16" r="1.5" />
      <circle cx="14.5" cy="16" r="1.5" />
      <circle cx="20.5" cy="16" r="1.5" />
    </>
  ),
  propensity: (
    <>
      <path d="M3 20h18M3 20V4" />
      <path d="M5 17.5c4 0 5-.5 7-5.5s3-6 7-6" />
    </>
  ),
  classification: (
    <>
      <path d="M4 20L20 4" />
      <circle cx="7" cy="8" r="2" fill="currentColor" />
      <circle cx="10.5" cy="4.5" r="1.6" fill="currentColor" />
      <rect x="14" y="14" width="3.4" height="3.4" />
      <rect x="17" y="19" width="3" height="3" />
    </>
  ),
  segmentation: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v8l6.9 4M12 12l-6.9 4" />
    </>
  ),
  hypothesis: (
    <>
      <path d="M3 19h18" />
      <path d="M3 19c3 0 4-11 9-11s6 11 9 11" />
      <path d="M17 13.2V19" />
    </>
  ),
  did: (
    <>
      <path d="M12 3v18" strokeDasharray="2 2.5" />
      <path d="M3 15l9-2 9-7" />
      <path d="M3 19l9-2 9-2" />
    </>
  ),
  causalimpact: (
    <>
      <path d="M12 3v18" strokeDasharray="2 2.5" />
      <path d="M3 15h9l3-7h6" />
      <path d="M12 15h9" strokeDasharray="1.5 2.5" />
    </>
  ),
  matched: (
    <>
      <circle cx="6" cy="6" r="1.8" />
      <circle cx="18" cy="6" r="1.8" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="18" cy="18" r="1.8" />
      <path d="M8 6h8M8 18h8" />
    </>
  ),
  tableau: (
    <>
      <path d="M4 20h16" />
      <path d="M6.5 20v-6M11 20V8M15.5 20v-9M20 20V4" />
    </>
  ),
  deltalake: (
    <>
      <path d="M12 3.5L21 19.5H3z" />
      <path d="M7 15.5c1.2 0 1.8-1 3-1s1.8 1 3 1 1.8-1 3-1" />
    </>
  ),
  agent: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M17.6 3.5v3.4h-3.4" />
      <path d="M12 8.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type GlyphIcon = keyof typeof glyphs
export type StackIconName = BrandIcon | GlyphIcon

export default function StackIcon({ name, className = '' }: { name: StackIconName; className?: string }) {
  const brand = name in brandPaths
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill={brand ? 'currentColor' : 'none'}
      stroke={brand ? 'none' : 'currentColor'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {brand ? <path d={brandPaths[name as BrandIcon]} /> : glyphs[name as GlyphIcon]}
    </svg>
  )
}
