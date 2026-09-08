/**
 * Content for the Web Chat hero product UI (Task 6): the mock browser chrome,
 * app sidebar and data table that fill the hero. Verbatim per the task brief —
 * later tests assert these exact strings and row values.
 */

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
