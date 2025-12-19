import Image from "next/image"
import { cva } from "class-variance-authority"

import { type IAuthorData } from "@/types/changelog"
import { cn, getFormattedAuthorsName } from "@/lib/utils"

import StackedAvatars from "./stacked-avatars"

const defaultAuthorImage = "/images/placeholder-author.svg"

const authorsVariants = cva("flex", {
  variants: {
    variant: {
      compact: "items-center",
      expanded: "flex-col gap-y-5",
    },
  },
  defaultVariants: {
    variant: "compact",
  },
})

const sizes = {
  xs: {
    imageClassName: "size-6",
    width: 24,
    height: 24,
  },
  sm: {
    imageClassName: "size-7",
    width: 28,
    height: 28,
  },
  md: {
    imageClassName: "size-9",
    width: 36,
    height: 36,
  },
  lg: {
    imageClassName: "size-10",
    width: 40,
    height: 40,
  },
} as const

interface IAuthorsProps {
  authors: IAuthorData[]
  className?: string
  variant?: "compact" | "expanded"
  isPriorityLoad?: boolean
  size?: keyof typeof sizes
  showNames?: boolean
  hideNamesOn?: ("sm" | "md" | "lg")[]
}

interface IAuthorsVariantsProps
  extends Omit<IAuthorsProps, "className" | "variant" | "size"> {
  isMultipleAuthors: boolean
  size?: keyof typeof sizes
}

function CompactAuthors({
  authors,
  isPriorityLoad = false,
  isMultipleAuthors = false,
  size = "md",
  showNames = true,
  hideNamesOn = [],
}: IAuthorsVariantsProps) {
  return (
    <>
      <span className="sr-only">Author{isMultipleAuthors ? "s" : ""}:</span>

      <StackedAvatars
        avatars={authors.map(({ photo }) => photo || defaultAuthorImage)}
        names={authors.map(({ name }) => name)}
        size={size}
        priority={isPriorityLoad}
      />

      {showNames && (
        <div
          className={cn(
            "line-clamp-2 leading-none",
            size === "xs" || size === "sm" ? "ml-2" : "ml-3",
            hideNamesOn.includes("sm") &&
              isMultipleAuthors &&
              "sr-only sm:not-sr-only sm:ml-2.5",
            hideNamesOn.includes("md") &&
              isMultipleAuthors &&
              "md:sr-only lg:not-sr-only lg:ml-2.5",
            hideNamesOn.includes("lg") &&
              isMultipleAuthors &&
              "lg:sr-only xl:not-sr-only xl:ml-2.5"
          )}
        >
          {authors.map(({ name }, index) => (
            <span
              className="text-[0.8125rem] leading-tight tracking-tighter"
              key={name + index}
            >
              {isMultipleAuthors ? getFormattedAuthorsName(name) : name}
              {index !== authors.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

function ExpandedAuthors({
  authors,
  isPriorityLoad = false,
  size = "sm",
}: IAuthorsVariantsProps & { size?: keyof typeof sizes }) {
  const styles = sizes[size]

  return (
    <ul className="flex flex-col gap-y-3">
      {authors.map(({ name, position, photo }, index) => (
        <li className="flex items-center gap-x-2" key={index}>
          <Image
            className={cn("shrink-0 rounded-full", styles.imageClassName)}
            src={photo || defaultAuthorImage}
            alt={name || ""}
            width={styles.width}
            height={styles.height}
            priority={isPriorityLoad}
            quality={100}
          />
          <p className="flex flex-col gap-y-0.5">
            <span className="text-sm leading-tight tracking-tight text-secondary-foreground">
              {name}
            </span>
            <span className="text-sm leading-tight tracking-tight text-foreground">
              {position}
            </span>
          </p>
        </li>
      ))}
    </ul>
  )
}

function Authors({
  className,
  authors,
  variant = "compact",
  size = "sm",
  isPriorityLoad = false,
  showNames = true,
  hideNamesOn = [],
}: IAuthorsProps) {
  const isMultipleAuthors = authors.length > 1

  return (
    <div className={cn("authors", authorsVariants({ variant }), className)}>
      {variant === "compact" ? (
        <CompactAuthors
          authors={authors}
          isPriorityLoad={isPriorityLoad}
          isMultipleAuthors={isMultipleAuthors}
          size={size}
          showNames={showNames}
          hideNamesOn={hideNamesOn}
        />
      ) : (
        <ExpandedAuthors
          authors={authors}
          isPriorityLoad={isPriorityLoad}
          isMultipleAuthors={isMultipleAuthors}
          size={size}
        />
      )}
    </div>
  )
}

export default Authors
