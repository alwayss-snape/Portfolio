import { resumeAlt, resumeIntro, resumePages } from '../content/resume'
import { asset } from '../lib/asset'

// Images only — no download link anywhere. Watermark and context-menu blocking
// only deter casual saving. Lightbox arrives with Milestone 5.
export default function ResumeViewer() {
  return (
    <div
      className="mx-auto max-w-[820px] select-none space-y-6"
      onContextMenu={(e) => e.preventDefault()}
    >
      {resumePages.map((page, i) => (
        <figure key={page.png} className="relative overflow-hidden border border-hairline bg-fog-2 p-3 sm:p-5">
          <picture>
            <source srcSet={asset(page.webp)} type="image/webp" />
            <img
              src={asset(page.png)}
              alt={resumeAlt(i)}
              width={page.width}
              height={page.height}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="block h-auto w-full"
            />
          </picture>
          <div aria-hidden className="resume-watermark pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -inset-1/2 flex rotate-[-30deg] flex-col justify-center gap-24">
              {Array.from({ length: 10 }, (_, row) => (
                <p key={row} className="whitespace-nowrap font-mono text-[18px] tracking-[4px] text-ink">
                  {Array.from({ length: 6 }, () => resumeIntro.watermark).join('   ·   ')}
                </p>
              ))}
            </div>
          </div>
        </figure>
      ))}
    </div>
  )
}
