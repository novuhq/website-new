import type { ReactNode } from "react"
import { EMAIL_AGENTS_DELIVERY } from "@/data/pages/email-for-ai-agents"

// The three item icons, inlined from the design so they inherit currentColor.
// Each path set keeps its own coordinate space; the translate places it inside
// the 24x24 frame exactly where the design puts it.
function KeyIcon() {
  return (
    <svg
      className="size-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <g
        transform="translate(0.25 0.25)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.75 0.75L9.516 8.984C8.951 8.836 8.361 8.75 7.75 8.75C3.884 8.75 0.75 11.884 0.75 15.75C0.75 19.616 3.884 22.75 7.75 22.75C11.616 22.75 14.75 19.616 14.75 15.75C14.75 14.859 14.577 14.01 14.274 13.226L16.75 10.75V7.75H19.75L22.75 4.75V0.75H17.75Z" />
        <path d="M7.75 17.75C8.85457 17.75 9.75 16.8546 9.75 15.75C9.75 14.6454 8.85457 13.75 7.75 13.75C6.64543 13.75 5.75 14.6454 5.75 15.75C5.75 16.8546 6.64543 17.75 7.75 17.75Z" />
      </g>
    </svg>
  )
}

function TwoWayIcon() {
  return (
    <svg
      className="size-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <g
        transform="translate(2.25 2.25)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0.75 12.75L12.75 0.75L12.25 1.25" />
        <path d="M18.75 6.75L6.74997 18.75L6.85852 18.6414" />
        <path d="M6.74997 0.75H12.75V6.75" />
        <path d="M12.75 18.75H6.74997V12.75" />
      </g>
    </svg>
  )
}

function ChannelsIcon() {
  return (
    <svg
      className="size-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <g transform="translate(1.75 2.977)">
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="square"
        >
          <path d="M19.25 1.02329L17.25 4.52329L17.472 4.13484" />
          <path d="M2.25 1.02329L4.25001 4.52329L4.02804 4.13484" />
          <path d="M0.75 16.5233H20.75V12.5233C20.75 7.00044 16.2728 2.52329 10.75 2.52329C5.22715 2.52329 0.75 7.00044 0.75 12.5233V16.5233Z" />
        </g>
        <path
          className="fill-current"
          d="M6 12.7733C6.69036 12.7733 7.25 12.2137 7.25 11.5233C7.25 10.8329 6.69036 10.2733 6 10.2733C5.30964 10.2733 4.75 10.8329 4.75 11.5233C4.75 12.2137 5.30964 12.7733 6 12.7733Z"
        />
        <path
          className="fill-current"
          d="M15.5 12.7733C16.1904 12.7733 16.75 12.2137 16.75 11.5233C16.75 10.8329 16.1904 10.2733 15.5 10.2733C14.8096 10.2733 14.25 10.8329 14.25 11.5233C14.25 12.2137 14.8096 12.7733 15.5 12.7733Z"
        />
      </g>
    </svg>
  )
}

const POINT_ICONS: ReactNode[] = [
  <KeyIcon key="keys" />,
  <TwoWayIcon key="two-way" />,
  <ChannelsIcon key="channels" />,
]

// The delivery-layer block for /email-for-ai-agents: one 44px statement whose
// second half drops to gray, then three supporting items.
function EmailAgentsDeliveryLayer() {
  return (
    <section className="mt-24 md:mt-32 lg:mt-60 xl:mt-60">
      <div className="container mx-auto max-w-272 px-5 md:px-8 xl:px-0">
        <h2 className="max-w-261.5 text-xl leading-[1.25] font-normal tracking-plus-tight text-white sm:text-2xl md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem]">
          {EMAIL_AGENTS_DELIVERY.title}{" "}
          <span className="text-gray-50">
            {EMAIL_AGENTS_DELIVERY.description}
          </span>
        </h2>

        <ul className="mt-12 flex flex-col gap-6 lg:mt-20 lg:flex-row">
          {EMAIL_AGENTS_DELIVERY.points.map((point, index) => (
            <li
              className="flex flex-1 flex-col gap-2.5 rounded-[0.5rem] bg-[#101114] px-6 py-5"
              key={point.title}
            >
              <h3 className="flex items-center gap-2.5 text-xl leading-none font-medium tracking-tighter text-white">
                {POINT_ICONS[index]}
                {point.title}
              </h3>
              <p className="text-base leading-normal font-normal tracking-tighter text-gray-60 md:text-lg">
                {point.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default EmailAgentsDeliveryLayer
