/**
 * Content for §3 "Not a chat box on your site. An agent inside your app"
 * (Task 10). Every string here is verbatim against the task brief and the
 * Figma `section` node (`45487-79958`, desktop) / its personalized reference
 * (`45503-149086`). Illustration-only copy that is baked into the exported
 * card images ("Subscriber Profile", "User recognized", "Activity",
 * "Q3 usage report", "Order #4821", "Agent context", "Delivery has been
 * rescheduled.", etc.) is not duplicated here since it is pixels, not DOM
 * text — see the task report for the full per-string trace.
 */

export const PRODUCT_BENTO_HEADING =
  "Not a chat box on your site. An agent inside your app"

export const PRODUCT_BENTO_DESCRIPTION =
  "Embedded in your product, Web Chat understands context, takes action, and responds with your own UI."

export interface ProductBentoCardCopy {
  id: "subscriber" | "activity" | "order" | "actions" | "render"
  title: string
  body: string
}

export const PRODUCT_BENTO_CARDS: ProductBentoCardCopy[] = [
  {
    id: "subscriber",
    title: "Connects users to their profiles",
    body: "When a user is identified, their details and conversation are linked to one subscriber profile.",
  },
  {
    id: "activity",
    title: "Keeps every conversation",
    body: "Review every Web Chat conversation, its messages, activity, and user context in Novu.",
  },
  {
    id: "order",
    title: "Works in your app's context",
    body: "Knows the user and current task, keeping every response relevant.",
  },
  {
    id: "actions",
    title: "Takes real actions",
    body: "Uses your tools to update records and resolve requests with approval.",
  },
  {
    id: "render",
    title: "Renders your components",
    body: "Renders your components, tool calls, and approvals directly in the thread.",
  },
]

/**
 * The two chat bubbles rebuilt as real DOM over the exported illustrations
 * (card 1 `Subscriber Profile`, card 2 `Activity`) — the "bubbles" the shared
 * rules call out as discrete accent elements, per Figma text nodes
 * `45487:79971` and `45487:80133`.
 */
export const PRODUCT_BENTO_BUBBLE_SUBSCRIBER =
  "How many orders were placed on our website yesterday?"

export const PRODUCT_BENTO_BUBBLE_ACTIVITY =
  "Can you prepare the Q3 usage report for finance?"

/**
 * Card 4 "Agent actions" confirm panel, rebuilt as real DOM (Figma
 * `45487:80341`-`45487:80350`) since its fill and border are accent-derived
 * (confirmed against the personalized reference: `fill_55063cc3`/
 * `fill_16012195` become `fill_d6a0b74a`/`fill_d1a4086e`).
 */
export const PRODUCT_BENTO_ACTIONS_STEP = "3"
export const PRODUCT_BENTO_CONFIRM_TITLE = "Confirm change"
export const PRODUCT_BENTO_CONFIRM_BODY = "Review and confirm update"
export const PRODUCT_BENTO_APPROVE_LABEL = "Approve"
export const PRODUCT_BENTO_CANCEL_LABEL = "Cancel"

/**
 * Card 5 "Renders your components" CTA button, rebuilt as real DOM (Figma
 * `45487:80387`/`45487:80388`) since its fill is accent-derived (confirmed:
 * `fill_1b6486b7` `#E18CF2` becomes `fill_9e958814` `#E65006` in the
 * personalized reference). The label is shipped verbatim from Figma,
 * including its apparent typo ("updater" for "updated") — not corrected,
 * per the shared rule against inventing copy.
 */
export const PRODUCT_BENTO_VIEW_ORDER_LABEL = "View updater order"
