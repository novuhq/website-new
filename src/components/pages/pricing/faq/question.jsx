import React, { useState } from "react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const ANIMATION_DURATION = 0.3

const variantsAnimation = {
  hidden: { height: 0 },
  visible: { height: "auto" },
}

const Question = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleButtonClick = () => {
    setIsOpen((currentState) => !currentState)
    // buttonClick("faq_read", { type: "faq_read" })
    // window?.analytics?.track(
    //   "Pricing Event: Click on an item in the FAQ section",
    //   {
    //     item: question,
    //   }
    // )
  }
  return (
    <li>
      <button
        className="inline-flex w-full items-center justify-between pt-6 pb-5 sm:gap-x-6 sm:pt-5 sm:pb-4"
        type="button"
        onClick={handleButtonClick}
      >
        <span className="tracking-snug text-start text-[20px] leading-snug font-medium sm:text-[18px]">
          {question}
        </span>
        <ChevronDown
          className={clsx(
            "mr-1.5 h-auto w-4 shrink-0 transition-transform duration-200 sm:mr-[5px] md:mr-3",
            isOpen && "-rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overflow-hidden"
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={variantsAnimation}
            exit="hidden"
            transition={{ duration: ANIMATION_DURATION }}
          >
            <div className="font-book tracking-snug max-w-[752px] pt-2 pb-8 text-[18px] leading-relaxed text-gray-8 sm:mr-7 sm:pb-6 sm:text-[16px] sm:leading-normal md:mr-14 [&_br]:mb-3 [&_br]:block">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default Question
