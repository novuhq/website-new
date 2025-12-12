import Image from "next/image"
import NextLink from "next/link"
import bgIllustration from "@/images/pages/customers/cta/bg-illustration.png"
import shine from "@/svgs/pages/customers/cta/shine.svg"

import { IContentCtaBlock } from "@/types/content"
import { Button } from "@/components/ui/button"

function Cta({ text, buttonText, buttonUrl }: IContentCtaBlock) {
  return (
    <div className="not-prose relative my-6 flex items-center justify-between gap-x-4 rounded-xl px-4 py-6 md:px-5">
      <h2 className="relative z-20 text-[20px] leading-tight font-medium md:text-[22px]">
        {text}
      </h2>
      <Button className="relative z-20 h-9" asChild>
        <NextLink href={buttonUrl}>{buttonText}</NextLink>
      </Button>

      <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
        <Image
          className="pointer-events-none absolute inset-0 min-h-full w-[704px] max-w-none sm:w-auto sm:min-w-full"
          src={bgIllustration}
          width={704}
          height={84}
          quality={100}
          sizes="(max-width: 768px) 100vw, 704px"
          alt=""
        />
        <div
          className="absolute top-0 right-[0px] z-12 h-1 w-45 -translate-y-1/2 rounded-[100%] bg-white blur-[1px]"
          aria-hidden
        />
      </div>
      <span
        className="absolute inset-0 z-11 rounded-[inherit] border-gradient bg-[radial-gradient(163.16%_186.97%_at_101.28%_-17.91%,#ECD1FA_10.74%,rgba(95,82,122,0.3)_49.79%,rgba(168,148,209,0.1)_100%)]"
        aria-hidden
      />
      <Image
        className="pointer-events-none absolute -top-[9px] -right-[11px] z-12"
        src={shine}
        width={276}
        height={87}
        alt=""
      />
    </div>
  )
}

export default Cta
