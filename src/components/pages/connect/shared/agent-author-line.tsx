import { cn } from "@/lib/utils"

function AgentAuthorLine({
  className,
  company,
  name,
}: {
  className?: string
  company?: string | null
  name?: string | null
}) {
  const authorName = name?.trim()
  const companyName = company?.trim()

  if (!authorName && !companyName) {
    return null
  }

  return (
    <p
      className={cn(
        "max-w-full truncate text-base leading-none tracking-normal whitespace-nowrap",
        className
      )}
    >
      {authorName && (
        <span className="font-normal text-gray-8">{authorName}</span>
      )}
      {companyName && (
        <span className="font-book text-gray-7">
          {authorName ? " — by " : "by "}
          {companyName}
        </span>
      )}
    </p>
  )
}

export default AgentAuthorLine
