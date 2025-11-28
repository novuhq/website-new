import React from "react"

import { cn } from "@/lib/utils"

interface HeadingProps {
  tag: "h2" | "h3"
  children: React.ReactNode
  className?: string
  id?: string
}

function Heading({
  tag: Tag,
  children,
  className,
  id,
  ...rest
}: HeadingProps & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag
      id={id}
      className={cn("w-fit !scroll-mt-20 text-pretty", className)}
      {...rest}
    >
      <a className="!no-underline" href={`#${id}`}>
        {children}
      </a>
    </Tag>
  )
}

export default Heading
