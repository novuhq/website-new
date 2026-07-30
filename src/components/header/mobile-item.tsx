import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { domAnimation, LazyMotion, m } from "motion/react"

import { IMenuHeaderContent } from "@/types/common"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import { Button } from "../ui/button"
import Card from "./card"
import MenuIcon from "./menu-icon"

interface IMobileProps {
  title: string
  content: IMenuHeaderContent[]
  onNavigate?: () => void
}

function MobileItem({ title, content, onNavigate }: IMobileProps) {
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
          <div className="grid gap-8 pb-5">
            {content.map(({ subtitle, items, card, type }, index) => (
              <div className="min-w-0" key={index}>
                {subtitle && (
                  <p className="mb-3 text-xs font-medium text-gray-60 uppercase">
                    {subtitle}
                  </p>
                )}
                {items && items.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-y-3">
                    {items.map(
                      ({ label, href, menuIcon, description }, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            className="flex w-full items-start gap-3 !leading-none font-light"
                            href={href}
                            variant="muted"
                            onClick={onNavigate}
                          >
                            <MenuIcon className="mt-px" icon={menuIcon} />
                            <span>
                              <span className="block">{label}</span>
                              {description && (
                                <span className="mt-1.5 block text-sm leading-4 text-gray-60">
                                  {description}
                                </span>
                              )}
                            </span>
                          </Link>
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
