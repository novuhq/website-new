/**
 * Content for §4 "Side panel or full screen. Your choice" (Task 11): the
 * tabbed section comparing the two Web Chat surfaces. Every string here is
 * verbatim against the task brief and the Figma frames:
 *  - Side panel, desktop `45487-80419`
 *  - Full screen, desktop `45497-141044`
 *  - Full screen, mobile `45497-139685`
 *  - Side panel, mobile: read from the mobile page frame `45487-98982`
 *    (the "section" at y 3810, node `45497-139684`)
 *
 * Full screen is not a resize of Side panel: it swaps the sidebar's
 * "Data" group for an expanded "Conversations" group, and carries a
 * different conversation (a launch-readiness review with a checklist and a
 * partially typed composer) instead of Side panel's short two-turn script.
 */

export const SURFACE_TABS_HEADING = "Side panel or full screen. Your choice"

export const SURFACE_TABS_DESCRIPTION =
  "Switch layouts and customize the experience with flexible components from AI Elements."

export const SURFACE_TABS_BUTTON_LABEL = "Explore AI elements"
export const SURFACE_TABS_BUTTON_HREF = "https://elements.ai-sdk.dev/"

export const SURFACE_TABS_TAB_LABELS = {
  sidePanel: "Side panel",
  fullScreen: "Full screen",
} as const

/** Chat window header (both tabs render the same mock agent identity). */
export const SURFACE_TABS_AGENT_NAME = "Your Agent"

/** Sidebar chrome shared by both tab states (`SidebarHeader`/`SidebarFooter`). */
export const SURFACE_TABS_SIDEBAR_COMPANY = "Your company"
export const SURFACE_TABS_SIDEBAR_ACCOUNT_NAME = "shadcn"
export const SURFACE_TABS_SIDEBAR_ACCOUNT_EMAIL = "m@example.com"
export const SURFACE_TABS_SIDEBAR_SETTINGS_LABEL = "Settings"

export interface SurfaceTabsSidebarSubItem {
  label: string
  active?: boolean
}

export interface SurfaceTabsSidebarLink {
  kind: "link"
  label: string
}

export interface SurfaceTabsSidebarGroup {
  kind: "group"
  label: string
  items: SurfaceTabsSidebarSubItem[]
}

export type SurfaceTabsSidebarItem =
  | SurfaceTabsSidebarLink
  | SurfaceTabsSidebarGroup

/**
 * Side panel sidebar (Figma `45487-80422`): Overview, then "Data" expanded
 * with "Sources" active, Records and Activity, then Automations, Users,
 * Integrations. Settings renders separately, just above the footer.
 */
export const SIDE_PANEL_SIDEBAR_ITEMS: SurfaceTabsSidebarItem[] = [
  { kind: "link", label: "Overview" },
  {
    kind: "group",
    label: "Data",
    items: [
      { label: "Sources", active: true },
      { label: "Records" },
      { label: "Activity" },
    ],
  },
  { kind: "link", label: "Automations" },
  { kind: "link", label: "Users" },
  { kind: "link", label: "Integrations" },
]

/**
 * Full screen sidebar (Figma `45497-141048`): same shell, but "Data" is
 * replaced by "Conversations" expanded with "Launch readiness review"
 * active, "Q3 usage report" and "Team access review".
 */
export const FULL_SCREEN_SIDEBAR_ITEMS: SurfaceTabsSidebarItem[] = [
  { kind: "link", label: "Overview" },
  {
    kind: "group",
    label: "Conversations",
    items: [
      { label: "Launch readiness review", active: true },
      { label: "Q3 usage report" },
      { label: "Team access review" },
    ],
  },
  { kind: "link", label: "Automations" },
  { kind: "link", label: "Users" },
  { kind: "link", label: "Integrations" },
]

export interface SurfaceTabsMessage {
  role: "user" | "agent"
  /** The small caption above an agent turn, e.g. "Agent" or "Agent responds...". */
  label?: string
  text: string
}

/** Side panel conversation (Figma `45487-81003`…`45487-81027`). */
export const SIDE_PANEL_MESSAGES: SurfaceTabsMessage[] = [
  { role: "user", text: "What changed since my last visit?" },
  {
    role: "agent",
    label: "Agent",
    text: "Should I show everything, or only changes that affect you?",
  },
  { role: "user", text: "Only what affects me." },
  {
    role: "agent",
    label: "Agent responds...",
    text: "Here’s your personalized update...",
  },
]

export const SIDE_PANEL_COMPOSER_PLACEHOLDER = "Message the agent ..."

/** Full screen conversation (Figma `45497-141628`…`45497-141660`). */
export const FULL_SCREEN_MESSAGES: SurfaceTabsMessage[] = [
  {
    role: "user",
    text: "Can you check whether the new workspace is ready to launch on Monday?",
  },
  {
    role: "agent",
    label: "Agent",
    text: "I reviewed the workspace setup, member permissions, notification workflows, and connected integrations. Most of the configuration is ready, but three items still need attention:",
  },
]

/**
 * Rendered in the order the Figma "list" frame stacks its items
 * (`45497-141653`, `45497-141644`, `45497-141638` top to bottom).
 */
export const FULL_SCREEN_CHECKLIST: string[] = [
  "Two team members have not accepted their invitations",
  "The billing workflow has no fallback channel",
  "The production API key has not been verified",
]

export const FULL_SCREEN_COMPOSER_DRAFT =
  "Fix what you can and prepare a summary I can share with"

/**
 * The faded (opacity 0.4), gradient-masked "Data sources" table sitting
 * behind the Side panel chat card (Figma `45487-80519`). Decorative
 * background chrome, not enumerated in the task brief's exact copy, and
 * mostly obscured by the fade + floating chat card in the actual
 * composition — trimmed to 5 of the frame's rows (the frame's own
 * "Last updated" column runs one row longer than its "Source" column, an
 * authoring artifact in the Figma file itself, not something to resolve
 * here) using only unambiguous source/date/status triples.
 */
export const DASHBOARD_TABLE_HEADING = "Data sources"
export const DASHBOARD_TABLE_SEARCH_PLACEHOLDER = "Search"
export const DASHBOARD_TABLE_FILTER_LABEL = "Status"
export const DASHBOARD_TABLE_VIEW_LABEL = "View"
export const DASHBOARD_TABLE_COLUMNS = [
  "Source",
  "Last updated",
  "Status",
] as const

export interface DashboardTableRow {
  source: string
  updated: string
  status: string
}

export const DASHBOARD_TABLE_ROWS: DashboardTableRow[] = [
  { source: "User profiles", updated: "2 min ago", status: "Synced" },
  { source: "Form submissions", updated: "12 min ago", status: "Needs review" },
  { source: "Content library", updated: "8 min ago", status: "Synced" },
  { source: "Activity events", updated: "1 hr ago", status: "Processing" },
  { source: "Messages", updated: "Yesterday", status: "Paused" },
]
