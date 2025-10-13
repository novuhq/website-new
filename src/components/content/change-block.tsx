import { COLORS } from "@/constants/colors"
import { ChevronDown } from "lucide-react"

import { type IContentChangeBlock } from "@/types/content"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Content from "@/components/pages/content"

function ChangeBlock({ type, items }: IContentChangeBlock) {
  return (
    <details
      className={cn(
        "change-list group summary-mark-hidden not-prose !my-0 py-5",
        "[&+_.change-list]:border-t [&+_.change-list]:border-gray-3"
      )}
    >
      <summary className="flex justify-between gap-8 text-lg leading-snug font-medium tracking-tighter">
        <span>
          {type.charAt(0).toUpperCase() + type.slice(1)} ({items.length})
        </span>
        <ChevronDown
          className="text-muted-foreground transition-transform duration-300 group-open:rotate-180"
          size={24}
        />
      </summary>
      <ul>
        {items.map(({ tag, text }, index) => (
          <li
            className="relative !pl-5 before:!top-3.5 before:!left-1.75 before:!size-1 before:bg-[#D9D9D9]"
            key={index}
          >
            {tag && (
              <Badge
                className="relative -top-0.5 mr-2 gap-1.5 tracking-tighter"
                variant="outline-muted"
                size="xs"
              >
                <span
                  className="pointer-events-none size-2 rounded-full"
                  style={{ backgroundColor: COLORS[tag.color] }}
                  aria-hidden
                />
                {tag.text}
              </Badge>
            )}
            <Content className="inline [&>*]:inline" content={text} />
          </li>
        ))}
      </ul>
    </details>
  )
}

export default ChangeBlock
