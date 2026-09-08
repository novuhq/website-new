/**
 * Content for the Web Chat hero product UI (Task 6): the mock browser chrome,
 * app sidebar and data table that fill the hero. Verbatim per the task brief —
 * later tests assert these exact strings and row values.
 */

/**
 * The hero shell copy (Task 8): badge, heading, description, meta line and
 * CTAs. Character-for-character against the Task 8 brief and the
 * `typography` Figma node (`45487-111212` desktop, `45487-113230` mobile).
 */
export const HERO_BADGE_LABEL = "Web Chat"

export const HERO_HEADING = "Your agent, live inside your product"

export const HERO_DESCRIPTION_TEXT =
  "Web Chat uses product context, takes action, and continues conversations across channels. Live in two minutes."

export const HERO_META_LINE =
  "~40K GitHub stars · open source · no OAuth to install. Choose the CLI or Copy Prompt (recommended)."

export const HERO_CLI_COMMAND = "npx novu connect --channel web-chat"

export const HERO_COPY_PROMPT_LABEL = "Copy Prompt"

export const HERO_TOOLTIP_TEXT =
  "Paste this prompt into Claude, Cursor, or Codex — your coding agent will set up Web Chat for you."

/**
 * Decorative only: the Figma node (`45487-111197`) styles this as underlined
 * text but carries no hyperlink target in the file data, so it renders as
 * inert text rather than a link to an invented URL.
 */
export const HERO_TOOLTIP_LINK_LABEL = "How agent onboarding works →"

/**
 * The prompt behind every "Copy Prompt" / "Copy the prompt" control on this
 * page (hero included). Single source of truth so the large string literal
 * isn't duplicated across `hero.tsx` and `page.tsx`.
 */
export const HERO_IMPLEMENT_PROMPT = `Add Novu Web Chat to my app so end users can chat with my agent in-product.

Use @novu/react (useAgentChat + NovuProvider) following the docs at https://docs.novu.co/agents/channels/agent-chat. Build a production-quality chat UI with AI Elements (https://elements.ai-sdk.dev): render the message list from message.parts, a composer, reasoning and tool parts, and tool approvals via respondToAction. Match my app's existing styling and design system. Do not dump raw JSON.

Wrap the UI in <NovuProvider> for the signed-in end user: read applicationIdentifier from an environment variable, pass the authenticated user's id as subscriberId from my existing auth, and pass subscriberHash if my app enables Novu subscriber HMAC. Follow my app's framework, routing, styling, and TypeScript conventions, place the chat in a sensible spot, and add no unnecessary wrappers.`

export const HERO_DEFAULT_DOMAIN = "yourdomain.com"
export const HERO_DEFAULT_COMPANY = "Your company"

export const HERO_SIDEBAR_DEFAULT = {
  items: [
    "Overview",
    "Data",
    "Automations",
    "Users",
    "Integrations",
    "Settings",
  ],
  expanded: { under: "Data", items: ["Sources", "Records", "Activity"] },
  activeItem: "Sources",
} as const

export const HERO_TABLE_DEFAULT = {
  title: "Data sources",
  columns: ["Source", "Last updated", "Status"],
  rows: [
    { name: "User profiles", updated: "2 min ago", status: "Synced" },
    { name: "Form submissions", updated: "12 min ago", status: "Needs review" },
    { name: "Content library", updated: "8 min ago", status: "Synced" },
    { name: "Activity events", updated: "1 hr ago", status: "Processing" },
    { name: "Messages", updated: "Yesterday", status: "Paused" },
    { name: "Uploaded files", updated: "Yesterday", status: "Synced" },
  ],
} as const

export const HERO_TABLE_PERSONALIZED = {
  title: "Form submissions",
  columns: ["Submission", "Submitted", "Status"],
  selectedRow: "Contact form #1048",
  rows: [
    {
      name: "Contact form #1048",
      updated: "12 min ago",
      status: "Needs review",
    },
    {
      name: "Newsletter signup #1047",
      updated: "18 min ago",
      status: "Complete",
    },
    {
      name: "Support request #1046",
      updated: "32 min ago",
      status: "Complete",
    },
    { name: "Feedback form #1045", updated: "46 min ago", status: "Complete" },
    { name: "General inquiry #1044", updated: "1 hr ago", status: "Complete" },
    { name: "Callback request #1042", updated: "2 hr ago", status: "Complete" },
    { name: "Summit Works", updated: "Yesterday", status: "Complete" },
  ],
} as const

export const HERO_AGENT_EMPTY_STATE = {
  title: "Ask about your workspace",
  body: "The agent understands what's on screen, finds relevant data, and can take action in your product.",
} as const

export const HERO_COMPOSER_PLACEHOLDER = "Message the agent ..."

export const HERO_PANEL_TITLE = "Your Agent"

/** Which storyboard step each message first appears on. */
export const HERO_MESSAGES = [
  { step: 1, role: "user", text: "Why does this form submission need review?" },
  {
    step: 3,
    role: "agent",
    text: "Should I check the missing fields or review the full submission?",
  },
  { step: 4, role: "user", text: "Missing fields" },
  {
    step: 5,
    role: "agent",
    text: "In this form (#1048), the Email field is not filled out.",
  },
] as const

/** Shown inside the step-5 agent message. */
export const HERO_FIELD_TABLE = {
  rows: [
    { label: "Full name", value: "Jordan Lee", missing: false },
    { label: "Email address", value: "Not provided", missing: true },
    { label: "Phone number", value: "+1 415 555 0148", missing: false },
    { label: "Message", value: "I'd like to learn more", missing: false },
  ],
} as const
