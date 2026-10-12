import { stack, stackIntro } from '../content/stack'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import StackIcon from '../components/StackIcon'

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <SectionHeader label={stackIntro.label} title={stackIntro.title} headingId="stack-title" />
        <Reveal delay={0.08}>
          <dl className="mt-14 divide-y divide-hairline border-y border-hairline">
            {stack.map((g) => (
              <div key={g.heading} className="grid gap-3 py-6 md:grid-cols-[240px_1fr] md:gap-10">
                <dt className="label pt-1.5 text-moss">{g.heading}</dt>
                {/* Every item carries a leading "·"; the list is pulled left under an
                    overflow clip, so the one starting each wrapped line is hidden. */}
                <dd className="overflow-hidden">
                  <ul className="-ml-7 flex flex-wrap gap-y-2 text-[16px] leading-relaxed text-ink sm:text-[18px]">
                    {g.items.map((item) => (
                      <li
                        key={item.name}
                        className="group flex items-center whitespace-nowrap before:w-7 before:text-center before:text-hairline before:content-['·']"
                      >
                        <StackIcon
                          name={item.icon}
                          className="mr-2 size-[18px] shrink-0 text-moss transition-colors duration-300 group-hover:text-rust sm:size-5"
                        />
                        <span className="transition-colors duration-300 group-hover:text-rust">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  )
}
