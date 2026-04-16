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
    <section className="relative mx-auto mt-26 max-w-[78rem] overflow-hidden rounded-xl bg-background px-5 pb-26 md:mt-48 md:px-10 md:pb-48 lg:mt-60 lg:pb-60">
      <Image
        src={bgGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-9 left-1/2 h-auto w-[132%] max-w-none -translate-x-1/2 opacity-85"
      />

      <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14 lg:gap-[4.125rem]">
        <h2 className="max-w-[48.875rem] text-center text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
          Integrates seamlessly with leading agentic frameworks
        </h2>

        <ul className="flex w-full max-w-[20rem] flex-wrap items-center justify-center gap-x-12 gap-y-10 md:max-w-none md:gap-x-10 md:gap-y-7 xl:flex-nowrap xl:gap-x-[3.9375rem]">
          {FRAMEWORK_LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="flex shrink-0 items-center justify-center md:h-9"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className="max-h-[25px] w-auto object-contain md:max-h-9"
              />
            </li>
          ))}

          <li className="flex shrink-0 items-center justify-center gap-2 md:h-9 md:gap-[0.6875rem]">
            <Image
              src={vscodeIcon}
              alt="VS Code"
              width={34}
              height={34}
              className="h-[24px] w-[24px] shrink-0 object-contain md:h-[34px] md:w-[34px]"
            />
            <Image
              src={vscodeWordmark}
              alt=""
              aria-hidden
              width={106}
              height={20}
              className="max-h-[14px] w-auto object-contain md:h-5 md:max-h-none"
            />
          </li>
        </ul>
      </div>
    </section>
  )
}

export default McpFrameworksSection
