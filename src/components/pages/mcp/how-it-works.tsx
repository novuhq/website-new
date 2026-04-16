import Image from "next/image"
import circleNumberIcon from "@/images/pages/mcp/icons/circle-number.svg"
import Shine from "@/images/pages/mcp/shine.svg"

import CodeBlock from "@/components/content/code-block"

import McpConfigSelect, { type IMcpConfigSnippet } from "./mcp-config-select"

interface IMcpHowItWorksStep {
  title: string
  description: string
}

interface IMcpClientSnippet {
  label: string
  language: "json" | "toml"
  code: string
}

const STEPS: IMcpHowItWorksStep[] = [
  {
    title: "Connect your AI client",
    description:
      "Point any MCP client — Claude, Cursor, or your app — to the Novu MCP Server.",
  },
  {
    title: "Discover available tools",
    description:
      "Your agent finds 12 tools: trigger workflows, manage subscribers, query notifications.",
  },
  {
    title: "Novu delivers everywhere",
    description:
      "Novu delivers across channels — in-app, email, SMS, push — with full observability.",
  },
]

const BASE_JSON_SNIPPET = `{
  "mcpServers": {
    "novu": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.novu.co/",
        "--header",
        "Authorization: Bearer \${NOVU_API_KEY}"
      ],
      "env": {
        "NOVU_API_KEY": "your-novu-api-key-here"
      }
    }
  }
}`

const VSCODE_JSON_SNIPPET = `{
  "servers": {
    "novu": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.novu.co/",
        "--header",
        "Authorization: Bearer \${input:novu-api-key}"
      ]
    }
  },
  "inputs": [
    {
      "id": "novu-api-key",
      "type": "promptString",
      "description": "Novu API key",
      "password": true
    }
  ]
}`

const CODEX_TOML_SNIPPET = `[mcp_servers.novu]
command = "npx"
args = [
  "mcp-remote",
  "https://mcp.novu.co/",
  "--header",
  "Authorization: Bearer \${NOVU_API_KEY}",
]

[mcp_servers.novu.env]
NOVU_API_KEY = "your-novu-api-key-here"`

const CLIENT_SNIPPETS: IMcpClientSnippet[] = [
  { label: "Cursor", language: "json", code: BASE_JSON_SNIPPET },
  { label: "Codex", language: "toml", code: CODEX_TOML_SNIPPET },
  { label: "Claude Desktop", language: "json", code: BASE_JSON_SNIPPET },
  { label: "VS Code", language: "json", code: VSCODE_JSON_SNIPPET },
  { label: "Windsurf", language: "json", code: BASE_JSON_SNIPPET },
  { label: "GitHub Copilot", language: "json", code: VSCODE_JSON_SNIPPET },
]

function HowItWorks() {
  const snippets: IMcpConfigSnippet[] = CLIENT_SNIPPETS.map((snippet) => ({
    label: snippet.label,
    raw: snippet.code,
    node: (
      <CodeBlock
        language={snippet.language}
        code={snippet.code}
        themeVariant="mcp-snippet"
        showCopyButton={false}
        className="border-none bg-transparent"
      />
    ),
  }))

  return (
    <section
      className="section-container mt-26 scroll-mt-[calc(var(--sticky-header-height)+5rem)] md:mt-48 lg:mt-62"
      id="how-it-works"
    >
      <div className="flex flex-col gap-12 md:gap-14 lg:gap-16">
        <div className="flex max-w-208 flex-col gap-4 md:gap-5">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-purple-3" />
            <span className="text-sm leading-none tracking-tight text-purple-1 uppercase">
              How it works
            </span>
          </div>
          <h2 className="text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-5xl">
            Trigger a workflow with your agent, and let Novu do the rest
          </h2>
        </div>

        <div className="relative grid min-w-0 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:items-start md:gap-8 lg:grid-cols-[40rem_minmax(0,22.5rem)] xl:gap-22">
          <div
            className="pointer-events-none absolute top-0 left-[min(2.375rem,8%)] z-0 h-[17.8rem] w-[min(15.81rem,calc(100%-1rem))] max-w-full -translate-y-14 rounded-full bg-[radial-gradient(130.5%_66.3%_at_74.3%_61.6%,_#FFB7E2_27.2%,_#FF96FB_80.5%,_#F047FF_100%)] opacity-[0.21] blur-[8.38rem]"
            aria-hidden
          />
          <Image
            src={Shine}
            alt=""
            width={448}
            height={32}
            sizes="(max-width: 448px) 100vw, 448px"
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-auto w-full max-w-full -translate-y-1/2 md:w-[50%] md:max-w-[50%]"
          />
          <McpConfigSelect snippets={snippets} defaultLabel="Claude Desktop" />

          <div className="relative pl-12">
            <ol className="flex flex-col gap-10 md:gap-15">
              {STEPS.map((step, index) => (
                <li
                  className="relative before:pointer-events-none before:absolute before:top-7 before:-bottom-10 before:left-[-2.125rem] before:w-px before:bg-[#262626] before:content-[''] last:before:hidden md:before:-bottom-15"
                  key={step.title}
                >
                  <span className="absolute top-0 -left-12 inline-flex size-7 items-center justify-center font-inter text-base leading-snug font-normal tracking-tighter text-white">
                    <Image
                      src={circleNumberIcon}
                      alt=""
                      width={28}
                      height={28}
                      className="absolute inset-0 size-full"
                      aria-hidden
                    />
                    <span className="relative">{index + 1}</span>
                  </span>
                  <h3 className="max-w-[19.4375rem] text-xl leading-snug font-medium tracking-tighter text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[19.4375rem] text-base leading-snug font-light text-gray-9">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
