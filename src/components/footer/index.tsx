import Image from "next/image"
import NextLink from "next/link"
import config from "@/configs/website-config"
import { MENUS } from "@/constants/menus"
import { ROUTE } from "@/constants/routes"

import { IMenuSocialItem } from "@/types/common"
import { Link } from "@/components/ui/link"
import { Icons } from "@/components/icons"

import Nav from "./nav"
import SystemStatus from "./system-status"

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

function Footer() {
  return (
    <footer className="relative border-t border-dashed border-t-accent bg-black px-5 pt-10 pb-6 md:px-8 md:pb-7 lg:pt-12 lg:pb-8">
      <div className="mx-auto w-full max-w-336">
        <div className="flex flex-col xl:flex-row xl:items-start xl:gap-21.5">
          <NextLink className="mr-9 inline-flex rounded" href={ROUTE.index}>
            <Image
              className="block"
              src={config.logo}
              alt={`${config.projectName} logo`}
              width="102"
              height="32"
            />
            <span className="sr-only">{config.projectName}</span>
          </NextLink>
          <Nav className="mt-9 xl:-mt-1" groups={MENUS.footer.main} />
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

export default Footer
