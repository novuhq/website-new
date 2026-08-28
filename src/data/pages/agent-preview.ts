import type { Vertical } from "@/lib/site-brand"

export type PreviewRow = {
  cells: [string, string, string]
  status: { label: string; tone: "good" | "warn" }
  dot: string
}

export type VerticalPreset = {
  /** Left product-UI framing */
  productLabel: string
  subLabel: string
  columns: [string, string, string, string]
  rows: PreviewRow[]
  /** Scripted agent interaction (the docked panel animation) */
  userAsk: string
  reasoning: string
  tool: string
  cardTitle: string
  cardLines: string[]
  answer: string // may contain {name}
}

const DOTS = ["#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"]

export const VERTICAL_PRESETS: Record<Vertical, VerticalPreset> = {
  saas: {
    productLabel: "Accounts",
    subLabel: "Q4 pipeline",
    columns: ["Account", "Owner", "Renewal", "Status"],
    rows: [
      { cells: ["Brightloom Labs", "AR", "Nov 3"], status: { label: "on track", tone: "good" }, dot: DOTS[0] },
      { cells: ["Northwind Retail", "MK", "Dec 12"], status: { label: "on track", tone: "good" }, dot: DOTS[1] },
      { cells: ["Arbor Systems", "JL", "Dec 28"], status: { label: "on track", tone: "good" }, dot: DOTS[2] },
      { cells: ["Juniper Analytics", "SP", "Jan 9"], status: { label: "at risk", tone: "warn" }, dot: DOTS[3] },
    ],
    userAsk: "Which accounts are at risk this quarter?",
    reasoning: "Scanning the pipeline and usage signals",
    tool: "query_accounts()",
    cardTitle: "1 account at risk",
    cardLines: ["Juniper Analytics", "Renewal Jan 9 · usage down 40%", "Owner: SP"],
    answer:
      "Juniper Analytics is the one to watch. I flagged it in {name} and drafted a check-in. Want me to send it?",
  },
  ecommerce: {
    productLabel: "Orders",
    subLabel: "Last 24 hours",
    columns: ["Order", "Customer", "Total", "Status"],
    rows: [
      { cells: ["#10241", "M. Okafor", "$240"], status: { label: "shipped", tone: "good" }, dot: DOTS[2] },
      { cells: ["#10242", "L. Nguyen", "$88"], status: { label: "shipped", tone: "good" }, dot: DOTS[1] },
      { cells: ["#10243", "R. Silva", "$612"], status: { label: "delayed", tone: "warn" }, dot: DOTS[3] },
      { cells: ["#10244", "T. Abbas", "$149"], status: { label: "shipped", tone: "good" }, dot: DOTS[0] },
    ],
    userAsk: "Where is order #10243?",
    reasoning: "Looking up the order and carrier tracking",
    tool: "lookup_order()",
    cardTitle: "Order #10243",
    cardLines: ["R. Silva · $612", "Delayed at carrier hub", "New ETA: Thursday"],
    answer:
      "Order #10243 is delayed at the carrier. I can notify R. Silva with the new ETA from {name}, on the web and by email. Send it?",
  },
  fintech: {
    productLabel: "Transactions",
    subLabel: "Flagged for review",
    columns: ["Ref", "Account", "Amount", "Status"],
    rows: [
      { cells: ["TX-8841", "Meridian Co", "$4,200"], status: { label: "cleared", tone: "good" }, dot: DOTS[2] },
      { cells: ["TX-8842", "Pallas LLC", "$18,900"], status: { label: "review", tone: "warn" }, dot: DOTS[3] },
      { cells: ["TX-8843", "Verity Inc", "$960"], status: { label: "cleared", tone: "good" }, dot: DOTS[1] },
      { cells: ["TX-8844", "Orbit Pay", "$2,410"], status: { label: "cleared", tone: "good" }, dot: DOTS[0] },
    ],
    userAsk: "Why is TX-8842 under review?",
    reasoning: "Checking risk rules and account history",
    tool: "get_transaction()",
    cardTitle: "TX-8842 · $18,900",
    cardLines: ["Pallas LLC", "Amount 6x account average", "Rule: velocity spike"],
    answer:
      "TX-8842 tripped a velocity rule: 6x the account average. I can hold it in {name} and ask Pallas LLC to confirm. Proceed?",
  },
  support: {
    productLabel: "Tickets",
    subLabel: "Open queue",
    columns: ["Ticket", "Customer", "Age", "Status"],
    rows: [
      { cells: ["#4821", "D. Park", "2h"], status: { label: "open", tone: "warn" }, dot: DOTS[3] },
      { cells: ["#4822", "S. Cohen", "1d"], status: { label: "waiting", tone: "warn" }, dot: DOTS[0] },
      { cells: ["#4823", "A. Rossi", "3h"], status: { label: "resolved", tone: "good" }, dot: DOTS[2] },
      { cells: ["#4824", "K. Mbeki", "5h"], status: { label: "open", tone: "warn" }, dot: DOTS[1] },
    ],
    userAsk: "Can you resolve ticket #4821?",
    reasoning: "Reading the thread and the customer's account",
    tool: "resolve_ticket()",
    cardTitle: "Ticket #4821",
    cardLines: ["D. Park · billing question", "Match found in docs", "Draft reply ready"],
    answer:
      "I drafted a fix for #4821 and can resolve it in {name}, then follow up on WhatsApp if D. Park replies. Approve the reply?",
  },
  healthcare: {
    productLabel: "Care queue",
    subLabel: "Today",
    columns: ["Patient", "Care team", "Visit", "Status"],
    rows: [
      { cells: ["J. Alvarez", "Dr. Lee", "9:00"], status: { label: "checked in", tone: "good" }, dot: DOTS[2] },
      { cells: ["P. Novak", "Dr. Kim", "9:30"], status: { label: "waiting", tone: "warn" }, dot: DOTS[3] },
      { cells: ["H. Yusuf", "Dr. Lee", "10:15"], status: { label: "scheduled", tone: "good" }, dot: DOTS[1] },
      { cells: ["M. Devi", "Dr. Ono", "11:00"], status: { label: "scheduled", tone: "good" }, dot: DOTS[0] },
    ],
    userAsk: "Has P. Novak completed intake?",
    reasoning: "Checking the intake form and appointment",
    tool: "get_patient()",
    cardTitle: "P. Novak",
    cardLines: ["9:30 with Dr. Kim", "Intake: incomplete", "Missing: insurance"],
    answer:
      "P. Novak's intake is missing insurance details. I can send a secure reminder from {name} before the 9:30 visit. Send it?",
  },
  developer: {
    productLabel: "Deployments",
    subLabel: "Production",
    columns: ["Service", "Commit", "Region", "Status"],
    rows: [
      { cells: ["api-gateway", "a1b2c3", "us-east"], status: { label: "healthy", tone: "good" }, dot: DOTS[2] },
      { cells: ["billing-svc", "d4e5f6", "eu-west"], status: { label: "degraded", tone: "warn" }, dot: DOTS[3] },
      { cells: ["web-app", "7g8h9i", "us-east"], status: { label: "healthy", tone: "good" }, dot: DOTS[1] },
      { cells: ["workers", "j0k1l2", "us-east"], status: { label: "healthy", tone: "good" }, dot: DOTS[0] },
    ],
    userAsk: "What's wrong with billing-svc?",
    reasoning: "Reading recent deploys and error rates",
    tool: "get_service()",
    cardTitle: "billing-svc · eu-west",
    cardLines: ["Deploy d4e5f6", "Error rate 4.2% (up 3x)", "Since: last release"],
    answer:
      "billing-svc is degraded since deploy d4e5f6, error rate up 3x. I can open an incident in {name} and page the on-call. Do it?",
  },
  generic: {
    productLabel: "Records",
    subLabel: "Recent activity",
    columns: ["Item", "Owner", "Updated", "Status"],
    rows: [
      { cells: ["Record A-19", "AR", "Nov 3"], status: { label: "active", tone: "good" }, dot: DOTS[0] },
      { cells: ["Record A-20", "MK", "Dec 12"], status: { label: "active", tone: "good" }, dot: DOTS[1] },
      { cells: ["Record A-21", "JL", "Dec 28"], status: { label: "review", tone: "warn" }, dot: DOTS[3] },
      { cells: ["Record A-22", "SP", "Jan 9"], status: { label: "active", tone: "good" }, dot: DOTS[2] },
    ],
    userAsk: "What needs my attention today?",
    reasoning: "Scanning records and recent changes",
    tool: "search_records()",
    cardTitle: "1 record needs review",
    cardLines: ["Record A-21", "Flagged 2 days ago", "Owner: JL"],
    answer:
      "Record A-21 needs review. I surfaced it in {name} and can loop in the owner on their channel. Want me to?",
  },
}

export function renderAnswer(answer: string, name: string): string {
  return answer.replace(/\{name\}/g, name)
}

/** A tailored prompt the visitor pastes into Claude Code / Codex to build it. */
export function buildInstallPrompt(opts: {
  name: string
  domain: string
  vertical: Vertical
}): string {
  const { name, domain, vertical } = opts
  const preset = VERTICAL_PRESETS[vertical]
  return `Add Novu Web Chat to ${name} (${domain}) so our users can chat with our agent inside the product.

Use @novu/react (useAgentChat + NovuProvider) following the docs at https://docs.novu.co/agents/channels/agent-chat. Build a production-quality chat UI with AI Elements (https://elements.ai-sdk.dev): render the message list from message.parts, a composer, reasoning and tool parts, and tool approvals via respondToAction. Match ${name}'s existing styling and design system. Do not dump raw JSON.

This is a ${vertical} product, so wire a tool like ${preset.tool} that reads our live app state and returns a result our components render inline (for example a "${preset.cardTitle}" style card), the way an agent would answer "${preset.userAsk}". Add a human approval gate before any write action.

Wrap the UI in <NovuProvider> for the signed-in end user: read applicationIdentifier from an environment variable, pass the authenticated user's id as subscriberId from our existing auth, and pass subscriberHash if we enable Novu subscriber HMAC. Follow our framework, routing, styling, and TypeScript conventions, place the chat in a sensible spot, and add no unnecessary wrappers.`
}
