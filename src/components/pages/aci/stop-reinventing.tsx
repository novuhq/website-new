import Image from "next/image"
import bgImage from "@/images/pages/aci/stop-reinventing/bg.jpg"

const METRICS = [
  {
    value: "5+",
    description: (
      <>
        channels to build
        <br />
        and maintain
      </>
    ),
  },
  {
    value: "0%",
    description: (
      <>
        of this plumbing
        <br />
        makes your agent smarter
      </>
    ),
  },
  {
    value: "100%",
    description: (
      <>
        undifferentiated heavy
        <br />
        lifting
      </>
    ),
  },
] as const

function StopReinventing() {
  return (
    <section
      id="what-is-aci"
      className="scroll-mt-20 bg-black px-5 pb-26 text-white md:px-8 md:pt-18 md:pb-66"
    >
      <div className="mx-auto w-full max-w-240">
        <div className="mx-auto flex max-w-184 flex-col items-center text-center">
          <h2 className="text-4xl leading-dense font-medium tracking-tighter text-balance md:text-5xl lg:text-[3.5rem]">
            Stop re-inventing the wheel
          </h2>
          <p className="mt-4 max-w-160.5 text-base leading-normal font-book tracking-tighter text-pretty text-gray-8 md:text-lg">
            Instead of focusing on building the most capable and intelligent
            agent, teams spend months to wire and establish communication
            patterns that have nothing to do with their core value.
          </p>
        </div>
        <div className="mt-16 aspect-[960/428] w-full overflow-hidden rounded-xl border border-[#1C2131]">
          <Image src={bgImage} alt="" width={960} height={428} aria-hidden />
        </div>

        <div className="mt-12 grid grid-cols-1 justify-between gap-20 px-4 text-center sm:grid-cols-3 sm:text-left md:px-24">
          {METRICS.map(({ value, description }) => (
            <div key={value} className="w-full sm:max-w-50">
              <p className="text-[2.75rem] leading-none font-normal tracking-tighter">
                {value}
              </p>
              <p className="mt-2 text-base leading-snug font-book tracking-tighter text-gray-8">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StopReinventing
