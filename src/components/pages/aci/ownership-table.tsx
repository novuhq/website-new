import Image from "next/image"
import aciTableBg from "@/images/pages/aci/ownership-table/bg.png"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const ROWS = [
  ["Webhook ingestion", "Your model"],
  ["Cross-channel message normalization", "Your prompts"],
  ["Exact thread delivery", "Your tools"],
  ["Conversation persistence & state", "Your business logic"],
  ["Participants identity resolution", "Your keys"],
  ["Agent communication experience", "Your runtime & your code"],
] as const

function OwnershipTable() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-5 pb-32 text-white md:px-8 md:pb-40">
      <div
        className="pointer-events-none absolute bottom-0 left-[20%] -z-10 h-90 w-90 rounded-full bg-blue-500/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-90 w-90 rounded-full bg-blue-500/5 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-240">
        <div className="mx-auto max-w-240 text-center">
          <h2 className="text-3xl leading-dense font-medium tracking-tighter md:text-4xl lg:text-[2.5rem]">
            Opinionated about communication infrastructure.
            <br />
            Unopinionated about intelligence.
          </h2>
          <p className="mt-3 text-base leading-normal font-book tracking-tighter text-gray-8">
            We solve the delivery problem so you can own the capability problem.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-110 overflow-hidden rounded-3xl border border-[#24303a] bg-[linear-gradient(180deg,#152431,rgba(255,255,255,0))] md:hidden">
          {[
            { title: "ACI Handles:", items: ROWS.map(([aci]) => aci) },
            {
              title: "You Keep:",
              items: ROWS.map(([, customer]) => customer),
            },
          ].map(({ title, items }, groupIndex) => (
            <div
              key={title}
              className={cn(
                "relative z-10",
                groupIndex === 1 && "border-t border-white/6 bg-white/6"
              )}
            >
              <h3 className="border-b border-white/6 px-4 py-3 text-sm font-normal text-[#FFFFFFCC]">
                {title}
              </h3>
              <ul>
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex min-h-11 items-start gap-2 border-b border-white/6 px-4 py-4 text-sm font-medium tracking-tighter last:border-b-0"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-lagune-3"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-14 hidden overflow-hidden md:block">
          <Image
            className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full object-cover md:[mask-image:linear-gradient(to_bottom,#000_0%,#000_90%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_90%,transparent_100%)] lg:[mask-image:none] lg:[-webkit-mask-image:none]"
            src={aciTableBg}
            alt=""
            width={960}
            height={428}
            aria-hidden
          />
          <table className="relative z-10 w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="h-11 border-b border-white/6 text-sm font-normal text-gray-10">
                <th
                  scope="col"
                  className="w-1/2 px-3 text-sm font-normal text-[#FFFFFFCC] sm:px-6 sm:text-[0.9375rem]"
                >
                  ACI Handles:
                </th>
                <th
                  scope="col"
                  className="w-1/2 border-l border-white/6 bg-white/6 px-3 text-sm font-normal text-[#FFFFFFCC] sm:px-6 sm:text-[0.9375rem]"
                >
                  You Keep:
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([aci, customer], index) => (
                <tr
                  key={aci}
                  className="h-16 border-b border-white/6 last:border-b-0"
                >
                  <td className="px-3 py-4 text-sm font-medium tracking-tighter sm:px-6 sm:text-base">
                    <span className="flex items-start gap-2 sm:gap-2.5">
                      <Check
                        className="size-4 shrink-0 text-lagune-3"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {aci}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "border-l border-white/6 px-3 py-4 text-sm font-medium tracking-tighter sm:px-6 sm:text-base",
                      index === ROWS.length - 1
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]"
                        : "bg-white/6"
                    )}
                  >
                    <span className="flex items-start gap-2 sm:gap-2.5">
                      <Check
                        className="size-4 shrink-0 text-lagune-3"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {customer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default OwnershipTable
