export type TItems = {
  items: {
    color: "red" | "lagune"
    text: string
  }[]
  redGroupTitle?: string
  blueGroupTitle?: string
}

export default function ColoredList({
  items,
  redGroupTitle,
  blueGroupTitle,
}: TItems) {
  if (!items) return null

  return (
    <>
      <ul className="flex w-full flex-col gap-3 md:w-1/2">
        {redGroupTitle && (
          <h2 className="mb-1 text-xl leading-snug font-medium tracking-tight md:text-2xl">
            {redGroupTitle}
          </h2>
        )}

        {items
          .filter(({ color }) => color === "red")
          .map((item) => (
            <li
              key={item.text}
              className="relative pl-3.5 text-base font-normal text-gray-9 before:absolute before:top-[9px] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-1 before:content-['']"
            >
              {item.text}
            </li>
          ))}
      </ul>
      <ul className="flex w-full flex-col gap-3 md:w-1/2">
        {blueGroupTitle && (
          <h2 className="mb-1 text-xl leading-snug font-medium tracking-tight md:text-2xl">
            {blueGroupTitle}
          </h2>
        )}
        {items
          .filter(({ color }) => color === "lagune")
          .map((item) => (
            <li
              key={item.text}
              className="relative pl-3.5 text-base font-normal text-gray-9 before:absolute before:top-1/2 before:left-0 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-lagune-3 before:content-['']"
            >
              {item.text}
            </li>
          ))}
      </ul>
    </>
  )
}
