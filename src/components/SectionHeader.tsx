type Props = { label: string; title?: string; sub?: string; headingId?: string }

// headingId goes on the title, or on the label when a section has no title,
// so the section can point aria-labelledby at it.
export default function SectionHeader({ label, title, sub, headingId }: Props) {
  return (
    <div>
      <p id={title ? undefined : headingId} className="label text-rust">
        {label}
      </p>
      {title && (
        <h2
          id={headingId}
          className="mt-4 font-serif font-normal leading-[0.95] text-ink"
          style={{ fontSize: 'var(--text-section)' }}
        >
          {title}
        </h2>
      )}
      {sub && <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{sub}</p>}
    </div>
  )
}
