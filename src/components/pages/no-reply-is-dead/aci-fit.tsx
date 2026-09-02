"use client"

import { Reveal } from "./how-it-works"

const TRIAD = [
  {
    key: "MCP",
    relation: "Agents ↔ tools",
    detail: "Call APIs and data.",
    me: false,
  },
  {
    key: "A2A",
    relation: "Agents ↔ agents",
    detail: "Coordinate with each other.",
    me: false,
  },
  {
    key: "ACI",
    relation: "Agents ↔ people",
    detail: "Talk with your users, anywhere they already are. The leg Novu owns.",
    me: true,
  },
]

export function AciFit() {
  return (
    <section id="aci" className="mt-24 scroll-mt-24 md:mt-32">
      <div className="container mx-auto max-w-288 px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter text-purple-1">
            Where this fits
          </span>
          <h2 className="mt-3.5 text-[2rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            This is ACI, Agent Communication Infrastructure.
          </h2>
          <p className="mt-4 text-base leading-normal tracking-tighter text-gray-70 md:text-lg">
            The layer that lets your agents hold a real, two-way conversation
            with the people they work for, across the channels those people
            already use. Assigning an agent to a workflow is that in one line.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TRIAD.map((item) => (
              <div
                key={item.key}
                className={
                  item.me
                    ? "rounded-xl border border-purple-3/50 bg-purple-3/[0.12] p-5"
                    : "rounded-xl border border-gray-20 bg-white/[0.02] p-5"
                }
              >
                <div
                  className={
                    item.me
                      ? "font-mono text-sm tracking-[0.08em] text-purple-1"
                      : "font-mono text-sm tracking-[0.08em] text-gray-60"
                  }
                >
                  {item.key}
                </div>
                <div className="mt-2 font-mono text-xl font-normal tracking-[-0.01em] text-white">
                  {item.relation}
                </div>
                <div className="mt-2 text-sm leading-normal tracking-tighter text-gray-70">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 rounded-xl border border-dashed border-gray-20 bg-white/[0.02] px-6 py-6 text-center">
            <p className="font-mono text-lg tracking-tighter text-white md:text-xl">
              We never run your brain.{" "}
              <span className="text-purple-1">That&rsquo;s the whole point.</span>
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-normal tracking-tighter text-gray-60">
              Your model, your logic, your tools. Novu carries the conversation
              between your agent and your users. The reasoning stays yours.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
