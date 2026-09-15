/**
 * Content for §9 "We never run your brain." (Task 16). Figma `section` node
 * `45487-81961` (desktop only — see the task report for why no mobile frame
 * exists for this section in the mobile page, `45487-98982`). Not
 * personalized: no brand-accent tokens here, only the shared design system.
 */

/**
 * Was imported from a shared word-reveal component, since deleted along with
 * the old section that used it (superseded by this section's static tagline
 * render — see `ownership.tsx`). Inlined here as its only remaining consumer.
 */
export interface TaglineWord {
  text: string
  accent: boolean
}

/**
 * The boundary line (`45487:81962`), split into words for a reveal: the first
 * sentence reveals in white, the rest in grey (`#707280`, `text-gray-50`).
 * Figma's raw text run has no space after the em dash inside the accented
 * portion ("agent to the web and carries..."); the run itself has none
 * missing — the apparent run-together in the extracted string
 * (`brain.Novu`) is only the sentence boundary, reproduced correctly below
 * as separate words with a space between them.
 */
export const OWNERSHIP_TAGLINE_WORDS: TaglineWord[] = [
  { text: "We", accent: false },
  { text: "never", accent: false },
  { text: "run", accent: false },
  { text: "your", accent: false },
  { text: "brain.", accent: false },
  { text: "Novu", accent: true },
  { text: "brings", accent: true },
  { text: "your", accent: true },
  { text: "agent", accent: true },
  { text: "to", accent: true },
  { text: "the", accent: true },
  { text: "web", accent: true },
  { text: "and", accent: true },
  { text: "carries", accent: true },
  { text: "every", accent: true },
  { text: "conversation,", accent: true },
  { text: "while", accent: true },
  { text: "your", accent: true },
  { text: "code,", accent: true },
  { text: "model,", accent: true },
  { text: "prompts,", accent: true },
  { text: "tools,", accent: true },
  { text: "and", accent: true },
  { text: "logic", accent: true },
  { text: "remain", accent: true },
  { text: "entirely", accent: true },
  { text: "yours", accent: true },
]

export interface OwnershipCardCopy {
  id: "bring-any-agent" | "change-runtime" | "keep-logic"
  title: string
  body: string
}

/**
 * `row-items` (`45487:81963`), read left to right. Icons are exported from
 * their Figma nodes (`45487:81967`, `45487:81980`, `45487:81991`).
 */
export const OWNERSHIP_CARDS: OwnershipCardCopy[] = [
  {
    id: "bring-any-agent",
    title: "Bring any agent",
    body: "Connect the agent you already use — LangChain, Vercel AI SDK, custom code, or any other runtime.",
  },
  {
    id: "change-runtime",
    title: "Change runtime later",
    body: "Swap models or frameworks without rebuilding Web Chat or losing conversation history.",
  },
  {
    id: "keep-logic",
    title: "Keep your logic yours",
    body: "Your prompts, tools, model calls, and keys stay in your infrastructure. Novu carries conversations — not your agent’s logic.",
  },
]
