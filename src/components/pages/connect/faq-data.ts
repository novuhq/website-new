import Link from "next/link"

import type { IFaqSection } from "@/types/common"
import { ROUTE } from "@/constants/routes"

export const CONNECT_FAQ: IFaqSection = {
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
          "Yes. Agents, conversations, and channel connections are preserved across upgrades and downgrades. Past-limit items are paused (not deleted) on downgrade.",
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
