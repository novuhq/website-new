import Image from "next/image"
import bgGlow from "@/images/pages/mcp/agentic-frameworks/background-glow.svg"
import claudeLogo from "@/images/pages/mcp/agentic-frameworks/claude.svg"
import codexLogo from "@/images/pages/mcp/agentic-frameworks/codex.svg"
import copilotLogo from "@/images/pages/mcp/agentic-frameworks/copilot.svg"
import cursorLogo from "@/images/pages/mcp/agentic-frameworks/cursor.svg"
import vscodeIcon from "@/images/pages/mcp/agentic-frameworks/vscode-icon-fill.svg"
import vscodeWordmark from "@/images/pages/mcp/agentic-frameworks/vscode-wordmark.svg"
import windsurfLogo from "@/images/pages/mcp/agentic-frameworks/windsurf.svg"

const FRAMEWORK_LOGOS = [
  { name: "Claude", src: claudeLogo, width: 149, height: 32 },
  { name: "Cursor", src: cursorLogo, width: 145, height: 36 },
  { name: "Windsurf", src: windsurfLogo, width: 179, height: 36 },
  { name: "Copilot", src: copilotLogo, width: 136, height: 36 },
  { name: "Codex", src: codexLogo, width: 133, height: 36 },
] as const

function McpFrameworksSection() {
  return (
    <section className="relative mx-auto mt-40 max-w-[78rem] overflow-hidden rounded-xl bg-background px-5 pb-40 md:mt-48 md:px-10 md:pb-48 lg:mt-60 lg:pb-60">
      <Image
        src={bgGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-9 left-1/2 h-auto w-[132%] max-w-none -translate-x-1/2 opacity-85"
      />

      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14 lg:gap-[4.125rem]">
        <h2 className="max-w-[48.875rem] text-center text-4xl leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
          Integrates seamlessly with leading agentic frameworks
        </h2>

        <ul className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-7 xl:flex-nowrap xl:gap-x-[3.9375rem]">
          {FRAMEWORK_LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="flex h-9 shrink-0 items-center justify-center"
              style={{ width: logo.width }}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
              />
            </li>
          ))}

          <li
            className="flex h-9 shrink-0 items-center gap-[11px]"
            style={{ width: 156 }}
          >
            <Image src={vscodeIcon} alt="VS Code" width={34} height={34} />
            <Image
              src={vscodeWordmark}
              alt=""
              aria-hidden
              width={106}
              height={20}
            />
          </li>
        </ul>
      </div>
    </section>
  )
}

export default McpFrameworksSection
