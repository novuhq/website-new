/**
 * Content for §3 "Not a chat box on your site. An agent inside your app"
 * (Task 10). Every string here is verbatim against the task brief and the
 * Figma `section` node (`45487-79958`, desktop) / its personalized reference
 * (`45503-149086`). Decorative UI copy remains in the Figma image exports.
 * Personalized bubbles and controls use editable SVG text exported from
 * `45839:21901`; their copy stays with those artwork assets instead of being
 * duplicated in the caption data.
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
