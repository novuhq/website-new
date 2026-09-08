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
