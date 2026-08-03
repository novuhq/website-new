import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { domAnimation, LazyMotion, m } from "motion/react"

import { IMenuHeaderContent, THeaderMenuVariant } from "@/types/common"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import { Button } from "../ui/button"
import Card from "./card"
import IntegrationMenuIcon from "./integration-menu-icon"
import MenuIcon from "./menu-icon"

interface IMobileProps {
  title: string
  variant?: THeaderMenuVariant
  content: IMenuHeaderContent[]
  onNavigate?: () => void
}

function MobileItem({ title, variant, content, onNavigate }: IMobileProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button
        className="flex w-full items-center gap-2 py-3.25 text-base font-medium text-foreground transition-colors hover:text-primary sm:text-lg [&>span]:justify-between"
        variant="none"
        size="none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </Button>
      <LazyMotion features={domAnimation}>
        <m.div
          className="overflow-hidden"
          initial={false}
          animate={isOpen ? "visible" : "hidden"}
          variants={{
            hidden: {
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.2,
              },
            },
            visible: {
              zIndex: 50,
              height: "auto",
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            },
          }}
        >
          <div className="grid gap-8 pt-2.5 pb-6">
            {content.map(({ subtitle, items, card, type }, index) => (
              <div className="min-w-0" key={index}>
                {subtitle && (
                  <p className="mb-4 text-xs font-medium text-gray-60 uppercase">
                    {subtitle}
                  </p>
                )}
                {items && items.length > 0 && (
                  <ul className="flex flex-col gap-y-5">
                    {items.map(
                      (
                        {
                          label,
                          href,
                          menuIcon,
                          description,
                          children,
                          remainingCount,
                        },
                        itemIndex
                      ) => (
                        <li key={itemIndex}>
                          {children?.length ? (
                            <>
                              <Link
                                className="group flex w-full items-start gap-3 leading-none font-normal text-gray-90"
                                href={href}
                                variant="clean"
                                onClick={onNavigate}
                              >
                                <MenuIcon className="mt-px" icon={menuIcon} />
                                <span>{label}</span>
                              </Link>
                              <ul className="mt-3 flex flex-col gap-y-3">
                                {children.map((child) => (
                                  <li key={child.label}>
                                    <Link
                                      className="flex items-center gap-2.5 text-sm leading-none font-normal text-gray-70 hover:text-white"
                                      href={child.href}
                                      variant="clean"
                                      onClick={onNavigate}
                                    >
                                      <MenuIcon icon={child.menuIcon} />
                                      <IntegrationMenuIcon
                                        icon={child.integrationIcon}
                                      />
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                                {Boolean(remainingCount) && (
                                  <li>
                                    <Link
                                      className="flex items-center gap-1 text-sm leading-none font-normal text-gray-70 hover:text-white"
                                      href={href}
                                      variant="clean"
                                      onClick={onNavigate}
                                    >
                                      +{remainingCount} more
                                      <ChevronRight
                                        className="size-3.5"
                                        aria-hidden="true"
                                      />
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </>
                          ) : (
                            <Link
                              className={cn(
                                "group flex w-full items-start gap-3 !leading-none font-normal",
                                variant === "product"
                                  ? "text-white"
                                  : "text-gray-90"
                              )}
                              href={href}
                              variant="clean"
                              onClick={onNavigate}
                            >
                              <MenuIcon className="mt-px" icon={menuIcon} />
                              <span>
                                <span className="block">{label}</span>
                                {description && (
                                  <span className="mt-1.5 block text-sm leading-4 text-gray-70">
                                    {description}
                                  </span>
                                )}
                              </span>
                            </Link>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}
                {card && <Card type={type} {...card} />}
              </div>
            ))}
          </div>
        </m.div>
      </LazyMotion>
    </div>
  )
}

export default MobileItem
