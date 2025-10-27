import Image from "next/image"
import NextLink from "next/link"
import bgIllustration from "@/images/pages/customers/cta/bg-illustration.png"
import shine from "@/svgs/pages/customers/cta/shine.svg"

import { IContentCtaBlock } from "@/types/content"
import { Button } from "@/components/ui/button"

function Cta({ text, buttonText, buttonUrl }: IContentCtaBlock) {
  return (
    <div className="not-prose relative my-6 flex items-center justify-between gap-x-4 overflow-hidden rounded-xl px-4 py-6 pb-5 md:px-5">
      <h2 className="relative z-20 text-[20px] leading-tight font-medium md:text-[22px]">
        {text}
      </h2>
      <Button className="relative z-20 h-9" asChild>
        <NextLink href={buttonUrl}>{buttonText}</NextLink>
      </Button>

      <span
        className="absolute inset-0 z-[11] rounded-xl border-gradient bg-[radial-gradient(circle_at_top_right,rgba(236,209,250,0.3)_11%,rgba(95,82,122,0.3)_50%,rgba(168,148,209,0.1)_100%)]"
        aria-hidden
      />
      <Image
        className="pointer-events-none absolute inset-0 z-10 min-h-full w-auto min-w-full"
        src={bgIllustration}
        width={704}
        height={84}
        quality={100}
        sizes="(max-width: 768px) 100vw, 704px"
        alt=""
      />
      <Image
        className="pointer-events-none absolute -top-[9px] -right-[11px] z-[12]"
        src={shine}
        width={276}
        height={87}
        alt=""
      />
    </div>
  )
}

export default Cta
