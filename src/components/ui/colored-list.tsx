import { cn } from "@/lib/utils"

export enum ColorType {
  RED = "red",
  LAGUNE = "lagune",
}

export type TColoredListProps = {
  className?: string
  items: {
    title: string
    color: ColorType
    items: string[]
  }[]
}

export default function ColoredList({ className, items }: TColoredListProps) {
  if (!items || items.length === 0) return null

  return (
    <div
      className={cn(
        "col-start-1 flex flex-col gap-8 md:flex-row md:gap-4",
        className
      )}
    >
      {items.map(({ title, color, items }, index) => (
        <div key={index} className="flex w-full flex-col gap-3 md:w-1/2">
          <h2 className="mb-1 text-xl leading-snug font-medium tracking-tight md:text-2xl">
            {title}
          </h2>
          <ul className="flex w-full flex-col gap-3">
            {items.map((item) => (
              <li
                key={item}
                className={cn(
                  "relative pl-3.5 text-base font-normal text-gray-9 before:absolute before:top-2.25 before:left-0 before:size-1.5 before:rounded-full",
                  color === ColorType.RED && "before:bg-red-1",
                  color === ColorType.LAGUNE && "before:bg-lagune-3"
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
