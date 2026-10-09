import { useRef } from 'react'
import { resumeAlt, resumeIntro, resumePages, type ResumePage } from '../content/resume'
import { asset } from '../lib/asset'

// Images only — no download link anywhere. The watermark is baked into the
// images; drag and context-menu blocking only deter casual saving.
const block = (e: React.SyntheticEvent) => e.preventDefault()

function PageImage({ page, index, eager = false }: { page: ResumePage; index: number; eager?: boolean }) {
  return (
    <div className="relative select-none" onContextMenu={block} onDragStart={block}>
      <picture>
        <source srcSet={asset(page.webp)} type="image/webp" />
        <img
          src={asset(page.png)}
          alt={resumeAlt(index)}
          width={page.width}
          height={page.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="block h-auto w-full"
        />
      </picture>
    </div>
  )
}

export default function ResumeViewer() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const open = (index: number) => {
    dialogRef.current?.showModal()
    // Jump to the page that was clicked.
    const target = scrollRef.current?.children[index] as HTMLElement | undefined
    target?.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <div className="mx-auto max-w-[820px] space-y-6">
        {resumePages.map((page, i) => (
          <figure key={page.png} className="border border-hairline bg-fog-2 p-3 sm:p-5">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={resumeIntro.open(i + 1, resumePages.length)}
              className="group block w-full cursor-zoom-in"
            >
              <PageImage page={page} index={i} />
            </button>
            <figcaption className="label mt-3 text-right text-muted">{resumeIntro.hint}</figcaption>
          </figure>
        ))}
      </div>

      {/* Native modal dialog: Esc closes it and the rest of the page is inert while open. */}
      <dialog
        ref={dialogRef}
        aria-label={resumeIntro.title}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="resume-lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end px-4 py-3 sm:px-8">
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="label bg-fog-2 px-4 py-2 text-ink hover:text-rust"
            >
              {resumeIntro.close}
            </button>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-10 sm:px-8"
            onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
          >
            {resumePages.map((page, i) => (
              <div key={page.png} className="mx-auto max-w-[1100px] border border-hairline bg-fog-2 p-3 sm:p-6">
                <PageImage page={page} index={i} eager />
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  )
}
