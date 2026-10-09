import { stack, stackIntro } from '../content/stack'
import Container from '../components/Container'
import SectionHeader from '../components/SectionHeader'

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={stackIntro.label} title={stackIntro.title} headingId="stack-title" />
        <dl className="mt-14 divide-y divide-hairline border-y border-hairline">
          {stack.map((g) => (
            <div key={g.heading} className="grid gap-3 py-6 md:grid-cols-[240px_1fr] md:gap-10">
              <dt className="label pt-1 text-moss">{g.heading}</dt>
              <dd className="flex flex-wrap items-baseline gap-y-1 text-[16px] leading-relaxed text-ink sm:text-[18px]">
                {g.items.map((item, i) => (
                  <span key={item} className="whitespace-nowrap">
                    {i > 0 && (
                      <span aria-hidden className="mx-3 text-hairline">
                        ·
                      </span>
                    )}
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
