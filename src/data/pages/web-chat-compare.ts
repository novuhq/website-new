/**
 * Content for "You know the old chat widget. This is Web Chat". Figma:
 * desktop `45487-79779`, personalized reference `45503-149553`, mobile
 * `45496-139032`. Every string is verbatim against those frames' text nodes.
 */

export const COMPARE_HEADING = "You know the old chat widget. This is Web Chat"

export const COMPARE_DESCRIPTION =
  "Old widgets follow scripts and create tickets. Web Chat brings your AI agent into the product to understand context, act, and render real UI."

export const COMPARE_OLD_WIDGET_TITLE = "The old chat widget"

export const COMPARE_OLD_WIDGET_POINTS = [
  "Scripted replies that end in a ticket form",
  "Walls of text instead of UI",
  "Loses the thread when the user leaves the page",
] as const

export const COMPARE_OLD_WIDGET_BODY = COMPARE_OLD_WIDGET_POINTS.join(" · ")

export const COMPARE_WEB_CHAT_TITLE = "Web Chat"

export const COMPARE_WEB_CHAT_POINTS = [
  "Your agent, your model, your logic",
  "Acts inside the product, with approval for sensitive tools",
  "Renders your components in the thread",
  "Resumes the conversation and knows the user on every channel you connect",
] as const

export const COMPARE_WEB_CHAT_BODY = COMPARE_WEB_CHAT_POINTS.join(" · ")
