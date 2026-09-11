import assert from "node:assert/strict"
import Module from "node:module"
import { before, describe, it } from "node:test"

import {
  buildConnectCommand,
  buildFrameworkChannelConnectPrompt,
} from "@/lib/connect-prompt"

/**
 * `connect-stack-options.ts` imports channel/framework icons as `*.svg`
 * assets, which only resolve through Next's build pipeline (the
 * webpack/turbopack static-image loader that turns them into
 * `StaticImageData`). Under the plain `node:test` runner there is no such
 * loader, so a static import of the module throws
 * `SyntaxError: Unexpected token '<'` on the raw SVG markup.
 *
 * Register a minimal `StaticImageData`-shaped stub for the `.svg`
 * extension before dynamically importing the module under test, so this
 * test can exercise the real, shipped option lists rather than a
 * hand-copied stand-in.
 */
type ExtensionHandler = (module: NodeJS.Module, filename: string) => void
type ModuleWithExtensions = typeof Module & {
  _extensions: Record<string, ExtensionHandler>
}
;(Module as ModuleWithExtensions)._extensions[".svg"] = (module, filename) => {
  ;(module as unknown as { exports: unknown }).exports = {
    src: filename,
    width: 1,
    height: 1,
  }
}

type ConnectStackOptionsModule =
  typeof import("@/data/pages/connect-stack-options")
type IStackOption = ConnectStackOptionsModule["DEFAULT_CHANNELS"][number]

// `before` (rather than top-level `await import(...)`) because tsx compiles
// this file to CommonJS, which does not support top-level await.
let DEFAULT_CHANNELS: ConnectStackOptionsModule["DEFAULT_CHANNELS"]
let DEFAULT_FRAMEWORKS: ConnectStackOptionsModule["DEFAULT_FRAMEWORKS"]
let WEB_CHAT_CHANNEL: ConnectStackOptionsModule["WEB_CHAT_CHANNEL"]

before(async () => {
  const optionsModule: ConnectStackOptionsModule = await import(
    "@/data/pages/connect-stack-options"
  )
  DEFAULT_CHANNELS = optionsModule.DEFAULT_CHANNELS
  DEFAULT_FRAMEWORKS = optionsModule.DEFAULT_FRAMEWORKS
  WEB_CHAT_CHANNEL = optionsModule.WEB_CHAT_CHANNEL
})

/**
 * Delegates to the same `buildConnectCommand` that `connect-stack.tsx` and
 * `web-chat/configurator.tsx` call, so this test guards the shipped command
 * construction rather than a parallel copy of it. Only the slug derivation
 * (`cliSlug ?? value`, mirroring both components) lives here.
 */
function buildCommand(channel: IStackOption, framework: IStackOption): string {
  return buildConnectCommand({
    channelSlug: channel.cliSlug ?? channel.value,
    frameworkSlug: framework.cliSlug ?? framework.value,
  })
}

function buildPrompt(channel: IStackOption, framework: IStackOption): string {
  return buildFrameworkChannelConnectPrompt({
    frameworkName: framework.promptLabel ?? framework.label,
    channelName: channel.promptLabel ?? channel.label,
    connectPath: framework.connectPath,
  })
}

function findOption(options: IStackOption[], value: string): IStackOption {
  const option = options.find((candidate) => candidate.value === value)
  assert.ok(option, `expected an option with value "${value}"`)
  return option
}

describe("connect-stack-options derived outputs", () => {
  it("MS Teams + LangChain matches the homepage's TC-HOME-003 contract", () => {
    const channel = findOption(DEFAULT_CHANNELS, "teams")
    const framework = findOption(DEFAULT_FRAMEWORKS, "langchain")

    assert.equal(
      buildCommand(channel, framework),
      "npx novu connect --channel teams --runtime langchain"
    )
    assert.equal(
      buildPrompt(channel, framework),
      "Connect this project's LangChain agent to MS Teams with Novu using instructions from https://novu.co/agents.md"
    )
  })

  it("Web Chat + Vercel AI SDK produces the web-chat CLI slug", () => {
    const framework = findOption(DEFAULT_FRAMEWORKS, "ai-sdk")

    assert.equal(
      buildCommand(WEB_CHAT_CHANNEL, framework),
      "npx novu connect --channel web-chat --runtime ai-sdk"
    )
    assert.equal(
      buildPrompt(WEB_CHAT_CHANNEL, framework),
      "Connect this project's Vercel AI SDK agent to Web Chat with Novu using instructions from https://novu.co/agents.md"
    )
  })

  it("a managed-path framework (Claude Managed Agent) uses its cliSlug and managed phrasing", () => {
    const channel = findOption(DEFAULT_CHANNELS, "slack")
    const framework = findOption(DEFAULT_FRAMEWORKS, "claude-managed-agent")

    assert.equal(framework.connectPath, "managed")
    assert.equal(
      buildCommand(channel, framework),
      "npx novu connect --channel slack --runtime claude"
    )
    assert.equal(
      buildPrompt(channel, framework),
      "Connect a Claude Managed Agent to Slack with Novu using instructions from https://novu.co/agents.md"
    )
  })

  it("keeps the expected channel option values, in order", () => {
    assert.deepEqual(
      DEFAULT_CHANNELS.map((option) => option.value),
      ["email", "telegram", "slack", "teams", "whatsapp", "sendblue"]
    )
  })

  it("keeps the expected framework option values, in order", () => {
    assert.deepEqual(
      DEFAULT_FRAMEWORKS.map((option) => option.value),
      [
        "ai-sdk",
        "langchain",
        "custom-code",
        "chat-sdk",
        "claude-managed-agent",
        "aws-claude-managed-agent",
      ]
    )
  })

  it("keeps the Web Chat channel's cliSlug stable for the hero CLI pill", () => {
    assert.equal(WEB_CHAT_CHANNEL.value, "web-chat")
    assert.equal(WEB_CHAT_CHANNEL.cliSlug, "web-chat")
  })
})
