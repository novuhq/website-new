import { GLOBE_CARD_EVENTS } from "@/components/pages/home/globe/globe-data"
import type { IGlobeCardEvent } from "@/components/pages/home/globe/globe-types"

// Agent-only variant of the homepage globe cards, for /solutions/ai-agents.
// We override ONLY the card copy (label, channel, lines, status) and reuse the
// homepage events for everything structural (id, routeId, anchor, timing,
// placement, widthPx). That keeps the globe geometry and the story/ambient
// route split identical to the homepage; only the words on the cards change.
//
// Every card is a two-way agent scenario. At least two are human-in-the-loop
// approvals ("Needs approval", "Human in the loop"), which is Novu Connect's
// differentiator: the agent asks, a person decides, the answer returns.
// Channels stay within Slack, WhatsApp, and Email (approved Connect channels
// that also have a card icon). No customer names, no em dashes.
type TAgentCardOverride = Pick<
  IGlobeCardEvent,
  "label" | "channel" | "channelLabel" | "lines" | "status"
>

const AGENT_CARD_OVERRIDES: Record<string, TAgentCardOverride> = {
  "product-event": {
    label: "Agent reply",
    channel: "slack",
    channelLabel: "Slack",
    lines: [
      { label: "User", value: "where's my sync?" },
      { label: "Agent", value: "found it, fixing now" },
    ],
    status: "Replied in 1.2s",
  },
  "agent-digest": {
    label: "Agent summary",
    channel: "email",
    channelLabel: "Email",
    lines: [
      { label: "Agent", value: "research agent" },
      { label: "Sends", value: "weekly summary" },
      { label: "To", value: "3 stakeholders" },
    ],
    status: "Sent in 96ms",
  },
  "customer-sync": {
    label: "Needs approval",
    channel: "slack",
    channelLabel: "Slack",
    lines: [
      { label: "Agent", value: "refund agent" },
      { label: "Asks", value: "approve $12,000 refund?" },
      { label: "To", value: "finance lead" },
    ],
    status: "Awaiting decision",
  },
  "workflow-run": {
    label: "Agent asks",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    lines: [
      { label: "Agent", value: "onboarding agent" },
      { label: "Asks", value: "ready to go live?" },
    ],
    status: "Replied in 2s",
  },
  "security-event": {
    label: "Human in the loop",
    channel: "slack",
    channelLabel: "Slack",
    lines: [
      { label: "Agent", value: "access agent" },
      { label: "Asks", value: "grant admin for 24h?" },
      { label: "To", value: "security" },
    ],
    status: "Awaiting decision",
  },
  fallback: {
    label: "Channel handoff",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    lines: [
      { label: "No reply on", value: "Slack" },
      { label: "Reached on", value: "WhatsApp" },
    ],
    status: "Same thread kept",
  },
  "pacific-product-event": {
    label: "Agent reply",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    lines: [
      { label: "User", value: "reschedule to Friday" },
      { label: "Agent", value: "done, confirmed" },
    ],
    status: "Replied in 1.4s",
  },
  "india-workflow-run": {
    label: "Agent update",
    channel: "email",
    channelLabel: "Email",
    lines: [
      { label: "Agent", value: "billing agent" },
      { label: "Sends", value: "usage summary" },
    ],
    status: "Sent in 92ms",
  },
}

export const AGENT_GLOBE_CARD_EVENTS: IGlobeCardEvent[] = GLOBE_CARD_EVENTS.map(
  (event) => {
    const override = AGENT_CARD_OVERRIDES[event.id]
    return override ? { ...event, ...override } : event
  }
)
