import Image from "next/image"
import imageCommunicationFlow from "@/images/pages/aci/communication-flow/image.jpg"
import { Route, Settings, UsersRound } from "lucide-react"

const EXPLANATIONS = [
  {
    title: "Communication providers — where humans actually are.",
    description:
      "Slack, WhatsApp, Teams, Telegram, Email — and every long-tail channel behind a single adapter, normalized to one message shape.",
    Icon: UsersRound,
  },
  {
    title: "Agent bridge (ACI) — the only piece we run.",
    description:
      "Stateful, idempotent, traced end-to-end. One brain answering on Slack also answers on Teams, WhatsApp, and Email.",
    Icon: Route,
  },
  {
    title: "Agent Brain — stays on your side.",
    description:
      "Bring your own — Agent SDK, LangChain, a managed Claude agent, or your own server. ACI never sees your prompts, memory, or model.",
    Icon: Settings,
  },
] as const

function CommunicationFlow() {
  return (
    <section className="bg-black px-5 text-white md:px-8">
      <div className="mx-auto w-full max-w-304">
        <Image
          src={imageCommunicationFlow}
          alt="Communication providers connect through the ACI layer to an agent brain"
          className="h-auto w-full rounded-xl border border-[#1C2131]"
          sizes="(max-width: 1280px) calc(100vw - 40px), 1216px"
          width={1216}
          height={505}
        />
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-12 lg:px-8">
          {EXPLANATIONS.map(({ title, description, Icon }) => (
            <div key={title}>
              <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#fff,#aaa)] text-black">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 md:max-w-88 text-xl leading-tight font-medium tracking-tighter">
                {title}
              </h3>
              <p className="mt-2 md:max-w-88 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunicationFlow
