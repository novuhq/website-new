import Image from "next/image"
import NextLink from "next/link"
import bgIllustration from "@/images/pages/aci/aci-definition/bg.jpg"
import stars from "@/images/pages/pricing/stars.png"
import shine from "@/svgs/pages/customers/cta/shine.svg"
import { ArrowLeftRight, Boxes, Send, Settings } from "lucide-react"

const CONNECTIONS = [
  {
    label: "MCP",
    from: "Agent",
    to: "Tools",
    description: "How the agent thinks with the world.",
    Icon: Settings,
  },
  {
    label: "A2A",
    from: "Agent",
    to: "Agent",
    description: "How agents coordinate with each other.",
    Icon: Boxes,
  },
  {
    label: "ACI",
    from: "Agent",
    to: "People",
    description: "How the agent reaches the people who care.",
    Icon: Send,
  },
] as const

const SHARE_URL =
  "https://x.com/intent/post?text=Agent%20Communication%20Infrastructure%20%E2%80%94%20the%20missing%20agent-user%20layer&url=https%3A%2F%2Fnovu.co%2Faci"

function AciDefinition() {
  return (
    <section className="relative bg-black px-5 pb-32 text-white md:px-8 md:pb-58">
      <div className="mx-auto w-full max-w-240">
        <div className="relative min-h-86 overflow-hidden rounded-xl px-5 pt-9 pb-8 sm:px-9">
          <Image
            className="pointer-events-none absolute -top-[103px] -right-[190px] z-0 h-[206px] w-[482px] max-w-none"
            src={stars}
            width={482}
            height={206}
            alt=""
            loading="eager"
            aria-hidden
          />
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
            <Image
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover"
              src={bgIllustration}
              width={960}
              height={344}
              quality={100}
              sizes="(max-width: 768px) 100vw, 1920px"
              alt=""
              aria-hidden
            />
          </div>
          <span
            className="absolute inset-0 z-[1] rounded-[inherit] border-gradient bg-[radial-gradient(114.29%_113.4%_at_74%_-13.4%,#f1ddfa_10.74%,rgba(95,82,122,0.3)_49.79%,rgba(168,148,209,0.1)_100%)]"
            aria-hidden
          />
          <Image
            className="pointer-events-none absolute -top-[9px] -right-[11px] z-[2]"
            src={shine}
            width={276}
            height={87}
            alt=""
            aria-hidden
          />
          <div className="relative z-10 flex items-center gap-3 text-sm leading-none font-normal text-fuchsia-100 uppercase">
            <span>Noun</span>
            <span className="size-1.5 bg-fuchsia-400" />
            <span>Infrastructure</span>
            <span className="size-1.5 bg-fuchsia-400" />
            <span>/ˈe. si. a/</span>
          </div>
          <NextLink
            className="absolute top-6 right-6 z-10 hidden h-10 w-38 items-center justify-center rounded-md border border-[#9C62A1] bg-[#6B3F6E] text-xs font-medium uppercase shadow-[0_3.333px_20px_0_rgba(0,0,0,0.30)] transition-colors hover:bg-[#814985] sm:flex"
            href={SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="aci_definition"
            data-click-text="share_on_x"
          >
            Share on X.com
          </NextLink>
          <div className="relative z-10 mt-15 max-w-146">
            <h2 className="text-3xl leading-dense font-medium tracking-tighter sm:text-4xl md:text-[2.75rem]">
              ACI — Agent Communication Infrastructure
            </h2>
            <p className="mt-6 text-base leading-normal font-book tracking-tighter text-gray-8 md:text-lg [&_span]:text-white">
              The infrastructure layer between an autonomous agent and the
              channels where humans actually receive messages. The third leg of
              the agent triad, alongside <span>MCP</span> and <span>A2A</span>.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 lg:grid-cols-[274px_274px_274px] lg:justify-between">
          {CONNECTIONS.map(({ label, from, to, description, Icon }) => (
            <div key={label}>
              <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffffff,#9a9a9a)] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                <Icon className="size-[22px]" strokeWidth={2} aria-hidden />
              </span>
              <div className="mt-5 flex items-center gap-1.5 text-xl leading-tight font-medium tracking-tighter">
                <span>{label}:</span>
                <span>{from}</span>
                <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
                <span>{to}</span>
              </div>
              <p className="mt-2 text-sm leading-normal font-book tracking-tighter text-gray-8 md:text-base">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AciDefinition
