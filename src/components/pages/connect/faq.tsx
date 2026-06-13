import Link from "next/link"

import type { IFaqSection } from "@/types/common"
import { ROUTE } from "@/constants/routes"
import FAQ from "@/components/pages/faq"

const CONNECT_FAQ: IFaqSection = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What happens when I exceed my conversation limit?",
        answer:
          "You're billed per-conversation overage at the rate for your plan ($0.03 Starter / $0.02 Pro / $0.015 Team). Free is capped and needs to wait for limit reset. Enterprise plans use committed volume.",
      },
      {
        question: "What happens when I hit my agent or channel limit?",
        answer:
          "You're prompted to upgrade or disable existing ones. Agents and channels are plan-level capacity, not metered usage, Connect won't surprise-bill you for an extra agent.",
      },
      {
        question: "Are some agent providers or channels gated to higher plans?",
        answer:
          "No. Every channel and every agent provider is available on every plan. Plans differ in how many connections you can have active and in team/security features.",
      },
      {
        question: "Can I move between plans without losing data?",
        answer:
          "es. Agents, conversations, and channel connections are preserved across upgrades and downgrades. Past-limit items are paused (not deleted) on downgraded.",
      },
      {
        question: "Is Connect HIPAA compliant?",
        answer: (
          <p>
            HIPAA BAAs are available on Enterprise.{" "}
            <Link href={ROUTE.contactUs}>Contact us</Link> if you need to route
            PHI through Connect.
          </p>
        ),
      },
    ],
  },
}

function ConnectFaq() {
  return (
    <div id="faq" className="scroll-mt-16">
      <FAQ
        {...CONNECT_FAQ}
        className="pt-28 md:pt-36 lg:pt-44 xl:pt-50"
        titleClassName="text-center text-[1.75rem] md:text-[40px] lg:text-left"
        containerClassName="lg:max-w-227 md:max-w-[796px] lg:px-0"
      />
    </div>
  )
}

export default ConnectFaq
