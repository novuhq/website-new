import type { ISolutionPageData } from "@/types/solution"

function SolutionCode({ solution }: { solution: ISolutionPageData }) {
  const snippet = solution.codeSnippet

  if (!snippet) {
    return null
  }

  return (
    <section className="mt-20 font-inter md:mt-24 lg:mt-28">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
          <header>
            <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-foreground md:text-4xl">
              {snippet.heading}
            </h2>
            {snippet.description ? (
              <p className="mt-4 text-base leading-normal font-normal tracking-tighter text-pretty text-gray-60 md:text-lg">
                {snippet.description}
              </p>
            ) : null}
          </header>
          <div className="overflow-hidden rounded-xl border border-gray-20 bg-[#05050b]">
            <div className="border-b border-gray-20 px-4 py-3 font-mono text-xs leading-none text-gray-50">
              {snippet.label}
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-gray-90">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionCode
