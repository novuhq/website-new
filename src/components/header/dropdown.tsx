import { AnimatePresence, motion } from "motion/react"

import { IMenuHeaderContent } from "@/types/common"
import { cn } from "@/lib/utils"

interface IDropdownProps {
  isOpen: boolean
  title: string
  content: IMenuHeaderContent[]
}

function Dropdown({ isOpen, title, content }: IDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          layoutId="navigation-dropdown"
          className={cn(
            "absolute top-10.5 -left-5 rounded-[14px] border-gray-2 bg-gray-1 shadow-header-dropdown transition-[left,min-width] ease-in-out will-change-transform",
            "before:absolute before:-top-1.5 before:z-10 before:h-3.5 before:w-3.5 before:rotate-45 before:rounded-[1px] before:border before:border-gray-2 before:bg-gray-1",
            title === "Product" &&
              "min-w-[515px] before:left-[59px] lg:-left-[22px] lg:before:left-[60px]",
            title === "Resources" &&
              "min-w-[515px] before:left-[53px] lg:-left-1.5 lg:before:left-[54px]",
            title === "Docs" && "min-w-[434px] before:left-[50px]"
          )}
          exit={{
            opacity: 1,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div className="relative z-10 flex gap-x-3.5 rounded-[14px] bg-gray-1 px-8 pt-6 pb-7">
            {content.map(({ subtitle }, index) => (
              <div
                className={cn(
                  "min-w-0",
                  index === 0 && "-ml-px grow",
                  index === 1 && "w-[220px]"
                )}
                key={index}
              >
                <p
                  className={cn(
                    "mb-4 text-sm leading-none -tracking-[0.01em] text-[#909090]",
                    title === "Product" && "mb-5"
                  )}
                >
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dropdown
