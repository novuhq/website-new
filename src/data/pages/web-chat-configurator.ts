import type { StaticImageData } from "next/image"
import builderBase44 from "@/images/pages/channels/web-chat/builder-base44.webp"
import builderBolt from "@/images/pages/channels/web-chat/builder-bolt.webp"
import builderClaude from "@/images/pages/channels/web-chat/builder-claude.webp"
import builderCursor from "@/images/pages/channels/web-chat/builder-cursor.webp"
import builderLovable from "@/images/pages/channels/web-chat/builder-lovable.webp"
import builderReplit from "@/images/pages/channels/web-chat/builder-replit.webp"
import builderV0 from "@/images/pages/channels/web-chat/builder-v0.webp"
import builderWindsurf from "@/images/pages/channels/web-chat/builder-windsurf.webp"
import configuratorBlob from "@/images/pages/channels/web-chat/configurator-blob.webp"

/**
 * §8 "Build your connection. Ship it from any builder." (Task 15). Figma
 * section `45487-81721` ("left" title+logos node `45516-189696`, card node
 * `45487-81876`/`45487-81877`). Not personalized: no `--wc-accent*` tokens.
 */

export const CONFIGURATOR_BLOB_IMAGE: StaticImageData = configuratorBlob

export const CONFIGURATOR_HEADING =
  "Build your connection. Ship it from any builder."

export const CONFIGURATOR_DESCRIPTION =
  "Choose Web Chat and your framework. Copy the generated prompt or CLI command to connect your agent."

export const CONFIGURATOR_CARD_TITLE = "Configure your agent"
export const CONFIGURATOR_CARD_SUBTITLE = "Pick a channel and framework."

export const CONFIGURATOR_PROMPT_TAB_LABEL = "AI prompt"
export const CONFIGURATOR_CLI_TAB_LABEL = "CLI command"

export const CONFIGURATOR_PROMPT_RESULT_LABEL = "Prompt"
export const CONFIGURATOR_CLI_RESULT_LABEL = "CLI command"

export const CONFIGURATOR_COPY_PROMPT_LABEL = "Copy prompt"
export const CONFIGURATOR_COPY_CLI_LABEL = "Copy CLI command"

export const CONFIGURATOR_CHANNEL_SELECT_LABEL = "Communication channel"
export const CONFIGURATOR_FRAMEWORK_SELECT_LABEL = "AI framework"

/**
 * Builder logo row (Figma `logos-new` `45516-189708`), read row-by-row from
 * the frame: lovable, base-44, bolt, v0, replit, cursor, windsurf, claude, in
 * that exact order. `name` is alt-text only (the logos are wordmark images,
 * not rendered labels) — "bolt.new" and "Claude Code" match the external
 * product names, as the old "Works anywhere" section's builder list already
 * used (`BUILDERS` in the page's previous copy).
 */
export interface IConfiguratorBuilderLogo {
  height: number
  name: string
  src: StaticImageData
  width: number
}

export const CONFIGURATOR_BUILDER_LOGOS: IConfiguratorBuilderLogo[] = [
  { name: "Lovable", src: builderLovable, width: 150, height: 32 },
  { name: "Base44", src: builderBase44, width: 139, height: 32 },
  { name: "bolt.new", src: builderBolt, width: 115, height: 32 },
  { name: "v0", src: builderV0, width: 69, height: 32 },
  { name: "Replit", src: builderReplit, width: 113, height: 32 },
  { name: "Cursor", src: builderCursor, width: 137, height: 32 },
  { name: "Windsurf", src: builderWindsurf, width: 213, height: 32 },
  { name: "Claude Code", src: builderClaude, width: 149, height: 32 },
]
