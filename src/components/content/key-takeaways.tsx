import { cn } from "@/lib/utils"

export interface IKeyTakeaway {
  title: string
  text?: string
}

interface IKeyTakeawaysProps {
  items: IKeyTakeaway[]
  className?: string
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
            {text && (
              <p className="text-base leading-normal tracking-tight text-gray-9">
                {text}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default KeyTakeaways
