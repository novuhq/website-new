const TRIAD = [
  {
    key: "MCP",
    relation: "Agents use tools",
    detail:
      "Give agents access to APIs, tools, and data so they can take action.",
    glow: false,
  },
  {
    key: "A2A",
    relation: "Agents work together",
    detail:
      "Coordinate and collaborate with other agents across systems and workflows.",
    glow: false,
  },
  {
    key: "ACI",
    relation: "Agents talk to people",
    detail:
      "Hold real, two-way conversations across the channels your users already use.",
    glow: true,
  },
]

export function AciFit() {
  return (
    <section id="aci" className="mt-24 scroll-mt-24 md:mt-32 lg:mt-40">
      <div className="mx-auto max-w-272 px-5 md:px-8 2xl:px-0">
        <h2 className="text-[2rem] leading-[1.25] font-normal tracking-plus-tight text-balance text-white md:text-[2.25rem] lg:text-[2.75rem]">
          We never run your brain.{" "}
          <span className="text-gray-50">
            Novu provides Agent Communication Infrastructure (ACI) for real,
            two-way conversations between your agents and users across the
            channels they already use.
          </span>
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-20">
          {TRIAD.map(({ key, relation, detail, glow }) => (
            <li
              key={key}
              className="relative isolate overflow-hidden rounded-lg bg-card-surface px-6 py-5"
            >
              {glow && (
                /* Figma clips a large blurred #DF7AF3 ellipse inside this card,
                   so the wash reads from the bottom-right corner */
                <span
                  className="pointer-events-none absolute top-[24%] left-[17.5%] -z-10 h-[374%] w-[236%] rounded-[50%] bg-[#DF7AF3] opacity-45 blur-[159px]"
                  aria-hidden
                />
              )}
              <div className="text-base leading-none font-medium tracking-normal text-gray-70 uppercase">
                {key}
              </div>
              <h3 className="mt-7 text-xl leading-none font-medium tracking-tighter text-white">
                {relation}
              </h3>
              <p className="mt-2.5 text-base leading-[1.5] tracking-tighter text-gray-60 md:text-lg">
                {detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
