import Image from "next/image"
import NextLink from "next/link"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"

import type { IMenuFooterItem, IMenuSocialItem } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import SystemStatus from "@/components/footer/system-status"
import { Icons } from "@/components/icons"

const CONNECT_FOOTER_GROUPS: IMenuFooterItem[] = MENUS.footer.main.map(
  (group) => {
    if (group.title === "Product") {
      return {
        ...group,
        items: group.items
          .filter(({ label }) => label !== "Novu Copilot")
          .map((item) =>
            item.label === "Novu MCP" ? { ...item, isNew: true } : item
          ),
      }
    }

    if (group.title === "Resources") {
      return {
        ...group,
        items: group.items.filter(({ label }) => label !== "Pricing"),
      }
    }

    return group
  }
)

interface ConnectFooterNavProps {
  className?: string
  groups: IMenuFooterItem[]
}

const ConnectFooterNav = ({ className, groups }: ConnectFooterNavProps) => (
  <nav className={cn(className)} aria-label="Footer navigation">
    <ul className="grid grid-cols-1 gap-9.75 md:grid-cols-2 md:gap-x-14 md:gap-y-10 xl:grid-cols-[192px_192px_192px_160px] xl:gap-8">
      {groups.map(({ title, items }, index) => (
        <li key={index}>
          <p className="overflow-visible text-lg leading-none font-normal tracking-tighter text-white">
            {title}
          </p>
          <ul className="mt-6 flex flex-col gap-6">
            {items.map(({ label, href, isNew }, index) => (
              <li className="flex items-center gap-1.25" key={index}>
                <Link
                  className="overflow-visible text-base leading-none font-normal tracking-tighter text-white/50 transition-colors duration-300 hover:text-white focus-visible:text-white"
                  href={href}
                  size="none"
                  variant="clean"
                >
                  {label}
                </Link>
                {isNew && (
                  <span className="inline-flex h-5 w-10 shrink-0 items-center justify-center overflow-visible rounded-full bg-lagune-3 px-2.5 pt-0.5 pb-1 text-sm leading-none font-normal tracking-tighter text-gray-4">
                    New
                  </span>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </nav>
)

const SocialLink = ({ href, icon, label }: IMenuSocialItem) => {
  const Icon = Icons[icon]

  return (
    <Link
      className="text-gray-7 transition-colors duration-300 hover:text-foreground"
      href={href as string}
      variant="muted"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="!size-5" size={20} />
      <span className="sr-only">{label}</span>
    </Link>
  )
}

function ConnectFooter() {
  return (
    <footer className="relative overflow-hidden bg-connect-footer px-5 pt-10 pb-6 md:px-8 md:pb-7 lg:pt-12 lg:pb-8">
      <div
        className="pointer-events-none absolute top-0 left-1/2 aspect-1920/614 h-auto w-full max-w-480 -translate-x-1/2 connect-footer-background"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-full max-w-none -translate-x-1/2 connect-footer-top-border"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-336">
        <div className="relative flex flex-col xl:flex-row xl:items-start xl:gap-22.5">
          <NextLink className="inline-flex rounded" href={ROUTE.index}>
            <Image
              className="block"
              src={config.logo}
              alt={`${config.projectName} logo`}
              width="102"
              height="32"
            />
            <span className="sr-only">{config.projectName}</span>
          </NextLink>
          <ConnectFooterNav
            className="mt-9 xl:mt-0"
            groups={CONNECT_FOOTER_GROUPS}
          />

          <div className="mt-10 flex flex-col items-start gap-5 md:mt-12 md:flex-row md:items-center md:justify-between xl:absolute xl:top-0 xl:right-0 xl:mt-0 xl:w-62.25 xl:flex-col xl:items-end xl:gap-5.5">
            <p className="w-62.25 max-w-full text-base leading-snug font-normal tracking-tighter text-gray-13/50 md:text-right">
              Built for Claude agents.
              <br />
              Not affiliated with Anthropic.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="w-36 overflow-visible px-6"
              asChild
            >
              <NextLink
                href="/connect/#pricing"
                data-click-location="connect_footer"
                data-click-text="see_pricing"
              >
                See pricing
              </NextLink>
            </Button>
          </div>
        </div>

        <div className="mt-18 lg:mt-16 xl:pt-px">
          <div className="pb-4.25 md:flex md:justify-between md:pb-5.25 lg:pb-6.5">
            <SystemStatus />
            <ul className="absolute top-11.5 right-5 flex gap-8 md:static xl:mr-0.75">
              {MENUS.footer.social.map((link, index) => (
                <SocialLink key={index} {...link} />
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-y-5 border-t border-t-gray-3 pt-5.25 md:flex-row md:justify-between lg:pt-6">
            <ul className="flex flex-col gap-3 md:flex-row md:gap-4 lg:gap-8">
              {MENUS.footer.legal.map(({ label, href }, index) => (
                <li key={index}>
                  <Link
                    className="md:tracking-normal xl:tracking-tighter"
                    href={href}
                    variant="ghost"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3.25 md:gap-6.75 lg:gap-8.5">
              <p className="text-base leading-none text-gray-5">
                <span className="mr-2 ml-px">©</span>
                {new Date().getFullYear()} Novu
              </p>
              <p className="relative text-base leading-none text-gray-5 before:absolute before:-left-1.5 before:h-full before:w-px before:bg-gray-5 md:before:-left-3.5 lg:before:-left-4.5 xl:tracking-tighter">
                Design made by Pixel Point
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ConnectFooter
