import { Route } from "next"
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "@portabletext/react"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

export interface IKeyTakeaway {
  title: string
  text?: PortableTextBlock[]
}

interface IKeyTakeawaysProps {
  items: IKeyTakeaway[]
  className?: string
}

const textComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-normal tracking-tight text-gray-9">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <Link
        href={value.href as Route<string>}
        target={value.isExternal ? "_blank" : undefined}
        rel={value.isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  },
}

function KeyTakeaways({ items, className }: IKeyTakeawaysProps) {
  return (
    <div
      className={cn(
        "not-prose my-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#101114] py-5 pr-5 pl-6",
        className
      )}
    >
      {items.map(({ title, text }, index) => (
        <div className="flex items-start gap-x-4" key={index}>
          <span
            className="shrink-0 text-lg leading-normal text-purple-2"
            aria-hidden
          >
            –
          </span>
          <div className="flex flex-col">
            <h4 className="text-lg leading-normal font-medium tracking-tight text-foreground">
              {title}
            </h4>
            {text && text.length > 0 && (
              <PortableText value={text} components={textComponents} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default KeyTakeaways
