import { ROUTE } from "@/constants/routes"

import type { ISolutionPageData } from "@/types/solution"

// Persona: "The Enterprise Agent Deployer". Director or VP of Engineering,
// platform, or architecture at a 1,000+ company, often in a regulated
// industry. Security-review-driven; evaluating internal agents and worried
// about where agent conversation data flows.
export const enterpriseSolutionData: ISolutionPageData = {
  slug: "enterprise",
  name: "For Enterprise",
  seoTitle: "Novu for Enterprise | Compliant Communication Infrastructure",
  seoDescription:
    "Notifications and agent conversations at enterprise scale. SOC 2 Type II, HIPAA, ISO 27001, GDPR, SSO/SAML, RBAC, audit logs, SLA. Cloud with US or EU data residency, or self-hosted.",
  conversionTrack: "book-a-call",
  hero: {
    eyebrow: "For enterprise",
    heading: "Communication infrastructure your security team can sign off",
    subheading:
      "Notifications and agent conversations at enterprise scale, for teams whose review process reads the audit log before the feature list: SOC 2 Type II, HIPAA, ISO 27001, and GDPR, with SSO, RBAC, audit logs, and an SLA. Run it in our cloud with US or EU data residency, or self-host it in yours.",
  },
  primaryCta: {
    label: "Book a demo",
    href: ROUTE.bookADemo,
  },
  secondaryCta: {
    label: "Security at Novu",
    href: ROUTE.security,
  },
  sections: [
    {
      heading: "The agent question your review board will ask",
      body: "Who runs the model, and what sees your data? With Novu the answer is short: you do, and yours does. Novu is the delivery layer, the ACI, Agent Communication Infrastructure, bridge between your agents and your people. The intelligence is your code or a model platform you bring under your own keys. We never run your brain. That's the whole point.",
      variant: "prose",
      bullets: [
        "Your agent logic and models stay under your control",
        "Managed Agents can run Claude through AWS, on the AWS bill you already have",
        "No new model vendor enters your stack through Novu",
      ],
    },
    {
      heading: "Control who does what",
      body: "Enterprise access control from day one, so rolling Novu out across teams does not mean sharing one admin login.",
      variant: "prose",
      bullets: [
        "SSO with SAML",
        "Role-based access control",
        "Audit logs for every change",
        "SLA-backed support",
      ],
    },
    {
      heading: "Deploy it your way",
      body: "Most enterprise teams arrive with an in-house notification system nobody wants to maintain. Migrate incrementally: run both side by side, move one workflow at a time, and keep the old system as a fallback until you switch it off.",
      variant: "prose",
      bullets: [
        "Cloud with US or EU data residency",
        "Self-hosted in your own infrastructure",
        "Incremental migration from in-house notification systems",
        "One platform for product notifications and agent conversations",
      ],
    },
    {
      heading: "Internal agents, staff channels",
      body: "The same platform carries internal AI agents to your staff on Slack, Microsoft Teams, and email. On-call summaries, approval requests, IT helpdesk: agents reach employees where they already work, with the audit trail your compliance team expects.",
    },
  ],
  compliance: {
    title: "Compliance, on paper",
    description:
      "Procurement asks, we answer with documents, not promises. The certifications your review checklist expects are in place.",
    items: [
      {
        question: "Which certifications does Novu hold?",
        answer:
          "SOC 2 Type II, HIPAA, ISO 27001, and GDPR. Documentation is available for your security review; book a call and we walk your team through it.",
      },
      {
        question: "Can we keep data in the EU?",
        answer:
          "Yes. Novu cloud offers US and EU data residency. If residency rules are stricter than that, you can self-host the platform in your own infrastructure.",
      },
      {
        question: "What about the audit trail?",
        answer:
          "Audit logs cover every change, with SSO and role-based access control in front of them, across notifications and agent conversations alike.",
      },
    ],
  },
  faq: [
    {
      question: "Does Novu run models on our conversation data?",
      answer:
        "No. Novu is the delivery layer, the ACI, Agent Communication Infrastructure, bridge. Your agent's intelligence is your own code or a model platform you bring under your own keys, and Novu carries the messages. We never run your brain.",
    },
    {
      question: "Can we keep data in the EU?",
      answer:
        "Yes. Novu cloud offers US and EU data residency. If residency rules are stricter than that, you can self-host the platform in your own infrastructure.",
    },
    {
      question: "How do we migrate off an in-house notification system?",
      answer:
        "Incrementally. Run Novu next to the existing system, move one workflow at a time, and keep the old path as a fallback until every workflow is across. No cutover weekend.",
    },
    {
      question: "Can internal AI agents reach our employees through Novu?",
      answer:
        "Yes. Internal agents talk to staff on Slack, Microsoft Teams, and email through the same platform that sends your product notifications, with SSO, RBAC, and audit logs applied throughout.",
    },
  ],
  finalCta: {
    title: "Bring your security team",
    description:
      "A 30-minute demo covering architecture, compliance, deployment options, and migration. Come with the hard questions.",
  },
}
