import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react"

import { IMenuHeaderContent } from "@/types/common"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import { Button } from "../ui/button"
import Card from "./card"

interface IMobileProps {
  title: string
  content: IMenuHeaderContent[]
}

function MobileItem({ title, content }: IMobileProps) {
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
            {content.map(({ items, card, type }, index) => (
              <div
                className="w-3xs min-w-0 first:-mt-1.5 sm:first:-mt-2.5"
                key={index}
              >
                {items && items.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-y-3">
                    {items.map(({ label, href }, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          className="!leading-none font-light"
                          href={href}
                          variant="muted"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
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
