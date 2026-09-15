import Image, { type StaticImageData } from "next/image"
import type {
  IWebChatBuilderPrimarySection,
  WebChatBuilderFeatureIcon,
} from "@/data/pages/web-chat-builders"
import backendIcon from "@/images/pages/channels/web-chat-builder/webflow/backend.svg"
import embedIcon from "@/images/pages/channels/web-chat-builder/webflow/embed.svg"
import publicLinkIcon from "@/images/pages/channels/web-chat-builder/webflow/public-link.svg"
import themeIcon from "@/images/pages/channels/web-chat-builder/webflow/theme.svg"
import twoWayIcon from "@/images/pages/channels/web-chat-builder/webflow/two-way.svg"
import workflowIcon from "@/images/pages/channels/web-chat-builder/webflow/workflow.svg"

const FEATURE_ICONS: Record<WebChatBuilderFeatureIcon, StaticImageData> = {
  embed: embedIcon,
  backend: backendIcon,
  theme: themeIcon,
  "two-way": twoWayIcon,
  workflow: workflowIcon,
  "public-link": publicLinkIcon,
}

function WebChatBuilderPrimarySection({
  section,
}: {
  section: IWebChatBuilderPrimarySection
}) {
  return (
    <section
      aria-labelledby={section.id}
      className="mx-auto mt-24 max-w-320 px-5 md:mt-32 md:px-8 xl:mt-50"
    >
      <h2
        id={section.id}
        className="text-center text-[2rem] leading-[1.04] font-normal tracking-plus-tight text-white md:text-5xl"
      >
        {section.title}
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {section.features.map((feature) => (
          <li
            key={feature.title}
            className="flex min-w-0 flex-col gap-8 rounded-xl bg-card-surface p-6"
          >
            <Image
              src={FEATURE_ICONS[feature.icon]}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0"
            />
            <div>
              <h3 className="text-xl leading-none font-medium tracking-tighter text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-base leading-normal tracking-tighter text-gray-60">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WebChatBuilderPrimarySection
