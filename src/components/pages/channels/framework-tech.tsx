import type { IChannelFrameworkCombo } from "@/data/pages/channel-frameworks"
import { fillTemplate } from "@/data/pages/channel-frameworks"

function FrameworkTech({ combo }: { combo: IChannelFrameworkCombo }) {
  const { channel, framework } = combo

  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            What is {framework.name}
          </h2>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            {framework.whatItIs}
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-4">
          {framework.strengths.map((strength) => (
            <li
              key={strength}
              className="flex items-start gap-2 text-base leading-normal font-normal tracking-tighter text-gray-80"
            >
              <span
                className="mt-2.25 size-1.5 shrink-0 rounded-xs bg-purple-3"
                aria-hidden
              />
              {strength}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-4">
          <h3 className="text-xl leading-[1.2] font-normal tracking-[-0.03em] text-white">
            {framework.name} in {channel.channelName}
          </h3>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            {fillTemplate(framework.connectIntro, combo)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default FrameworkTech
