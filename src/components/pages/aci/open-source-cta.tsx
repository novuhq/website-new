import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"
import CTA from "@/components/pages/cta"

const GITHUB_REPO_URL = "https://github.com/novuhq/novu"

function OpenSourceCtaActions() {
  return (
    <div className="mt-10 flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-4 2xs:flex-row 2xs:gap-7">
        <Button size="lg" className="w-full !px-5 2xs:w-fit" asChild>
          <NextLink
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="aci_open_source_cta"
            data-click-text="star_us_on_github"
          >
            Star us on GitHub
          </NextLink>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full 2xs:w-fit"
          asChild
        >
          <NextLink
            href={ROUTE.githubIssues}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="aci_open_source_cta"
            data-click-text="contribute"
          >
            Contribute
          </NextLink>
        </Button>
      </div>

      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm leading-[1.375] font-book whitespace-nowrap text-lagune-3 transition-colors hover:text-lagune-2 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-lagune-3/50 focus-visible:outline-none"
        data-click-location="aci_open_source_cta"
        data-click-text="github_repo_link"
      >
        github.com/novuhq/novu
      </a>
    </div>
  )
}

function OpenSourceCta() {
  return (
    <CTA
      title="Built in the open. Send a PR, file an issue, ship a channel."
      description="ACI are open source. Contribute what missing, review the code, run it by yourself. The adapters, the identity resolver, the conversation store — all on GitHub. If there's a channel we don't speak yet, you can teach us."
      actions={[]}
      actionSlot={<OpenSourceCtaActions />}
      className="text-center !pb-0 md:!pb-0 lg:!pb-0 xl:!pb-0"
      containerClassName="max-w-176 lg:!translate-x-0 xl:!translate-x-0"
      titleClassName="max-w-176 !text-[2rem] !leading-[1.25] md:!text-[2.5rem] lg:!text-[2.75rem]"
      descriptionClassName="!mt-4 max-w-[604px] !text-[1.0625rem] !leading-[1.375] !font-book !text-gray-9"
    />
  )
}

export default OpenSourceCta
