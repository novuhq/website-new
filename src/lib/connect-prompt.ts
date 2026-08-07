/**
 * Single source of truth for copy-paste coding-agent prompts that point at
 * https://novu.co/agents.md. Keep prompts short; agents.md owns setup detail.
 */

export const AGENTS_MD_URL = "https://novu.co/agents.md"

type BuildConnectPromptOptions = {
  /**
   * Subject being connected.
   * Defaults to "my agent".
   * Examples: "this project's LangChain agent", "a Claude Managed Agent"
   */
  agent?: string
  /** What the agent connects to. Defaults to "customers". */
  target?: string
}

export function buildConnectPrompt({
  agent = "my agent",
  target = "customers",
}: BuildConnectPromptOptions = {}): string {
  return `Connect ${agent} to ${target} with Novu using instructions from ${AGENTS_MD_URL}`
}

/** Default homepage, /connect, and /aci prompt. */
export const DEFAULT_CONNECT_PROMPT = buildConnectPrompt()

/** Channel-only prompt, e.g. Slack landing page or homepage channel card. */
export function buildChannelConnectPrompt(channelName: string): string {
  return buildConnectPrompt({ target: channelName })
}

type FrameworkConnectPath = "bridge" | "managed"

/**
 * Framework × channel prompt.
 * Bridge: "Connect this project's LangChain agent to Slack with Novu ..."
 * Managed: "Connect a Claude Managed Agent to Slack with Novu ..."
 */
export function buildFrameworkChannelConnectPrompt({
  frameworkName,
  channelName,
  connectPath = "bridge",
}: {
  frameworkName: string
  channelName: string
  connectPath?: FrameworkConnectPath
}): string {
  const agent =
    connectPath === "managed"
      ? `${/^[aeiou]/i.test(frameworkName) ? "an" : "a"} ${frameworkName}`
      : `this project's ${frameworkName} agent`

  return buildConnectPrompt({ agent, target: channelName })
}
