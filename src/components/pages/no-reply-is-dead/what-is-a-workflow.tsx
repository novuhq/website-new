"use client"

import { Reveal } from "./how-it-works"

const FAN_OUT = ["Email", "Slack", "WhatsApp", "Teams", "Telegram", "iMessage"]

function Connector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <span className="font-mono text-sm text-gray-60">↓</span>
    </div>
  )
}

export function WhatIsAWorkflow() {
  return (
    <section id="what-is-a-workflow" className="mt-24 scroll-mt-24 md:mt-32">
      <div className="container mx-auto max-w-288 px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none tracking-tighter text-purple-1">
              New to Novu? Start here
            </span>
            <h2 className="mt-3.5 text-[2rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
              A workflow is how your app sends a message.
            </h2>
            <p className="mt-4 max-w-md text-base leading-normal tracking-tighter text-gray-70 md:text-lg">
              Novu is the open-source notification infrastructure 40,000
              developers trust. A{" "}
              <span className="font-mono text-[0.95em] text-white">
                workflow
              </span>{" "}
              is the piece that sends. You define it once, trigger it by name
              with a payload, and Novu delivers it to the right person on the
              right channel: email, Slack, WhatsApp, and more.
            </p>
            <p className="mt-4 max-w-md text-base leading-normal tracking-tighter text-gray-70 md:text-lg">
              For years that ran one direction: your software talking to people,
              ending at a no-reply address. Assigning an agent to the workflow
              adds the half that was missing. The reply comes back, and the
              agent already knows what was sent.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-xl border border-gray-20 bg-[#08080f] p-5">
              <div className="overflow-x-auto rounded-lg border border-gray-20 bg-black/40 px-3.5 py-3">
                <code className="font-mono text-[13px] whitespace-pre text-gray-80">
                  {"novu."}
                  <span className="text-purple-1">trigger</span>
                  {'("order-shipped", { to, payload })'}
                </code>
              </div>

              <Connector />

              <div className="rounded-lg border border-purple-3/50 bg-purple-3/15 px-4 py-3 text-center">
                <div className="font-mono text-sm text-purple-1">workflow</div>
                <div className="mt-0.5 text-xs tracking-tighter text-gray-60">
                  your send logic, defined once
                </div>
              </div>

              <Connector />

              <div className="flex flex-wrap justify-center gap-2">
                {FAN_OUT.map((channel) => (
                  <span
                    key={channel}
                    className="rounded-md border border-gray-20 bg-white/[0.02] px-2.5 py-1.5 font-mono text-xs tracking-tighter text-gray-70"
                  >
                    {channel}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-center font-mono text-xs tracking-tighter text-gray-60">
                one trigger → the message goes out
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
