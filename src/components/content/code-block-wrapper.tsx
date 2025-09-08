"use client"

import {
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface ICodeBlockWrapperProps {
  as?: "figure" | "div"
  className?: string
  children?: ReactNode
  fileName?: string
}

type ExpectedProps = {
  children?: ReactNode
  "data-line"?: string
  dangerouslySetInnerHTML?: {
    __html: string
  }
}

function hasExpectedProps(
  element: ReactNode
): element is ReactElement<ExpectedProps> {
  return isValidElement(element) && typeof element.props === "object"
}

function extractTextFromNode(node: ReactNode): string {
  if (typeof node === "string") {
    return node
  }

  if (hasExpectedProps(node)) {
    if (
      typeof window !== "undefined" &&
      node.props.dangerouslySetInnerHTML?.__html
    ) {
      // Extract text from the HTML string
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        node.props.dangerouslySetInnerHTML.__html,
        "text/html"
      )
      let textContent = ""

      // Iterate over each 'span' with 'data-line' attribute
      const lineElements = doc.querySelectorAll("span[data-line]")

      lineElements.forEach((lineElem) => {
        let line = lineElem.textContent

        // add special characters for diff lines
        if (
          lineElem.classList.contains("diff") &&
          lineElem.classList.contains("add")
        ) {
          line = `+ ${line}`
        }
        if (
          lineElem.classList.contains("diff") &&
          lineElem.classList.contains("remove")
        ) {
          line = `- ${line}`
        }

        textContent += line + "\n" // Preserve the newline from the original HTML
      })

      return textContent.trim() // Trim the final string to remove any extra newline at the end
    } else if (node.props.children) {
      let text = ""
      const children = node.props.children

      if (Array.isArray(children)) {
        children.forEach((child) => {
          text += extractTextFromNode(child)

          if (hasExpectedProps(child) && "data-line" in child.props) {
            text += "\n"
          }
        })
      } else {
        text = extractTextFromNode(children)
      }

      return text
    }
  }

  return ""
}

function CodeBlockWrapper({
  as = "figure",
  className = "",
  children,
  fileName,
}: ICodeBlockWrapperProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(3000)
  const blockRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (blockRef.current) {
      setHeight(blockRef.current.offsetHeight)
    }
  }, [children])

  const code = extractTextFromNode(children)
  const Tag = as

  return (
    <Tag
      className={cn(
        "code-block group h-fit w-full rounded-lg border border-gray-2 bg-background",
        className
      )}
    >
      {fileName && (
        <div className="border-b border-gray-2 px-4 py-3.5 text-[0.8125rem] leading-none font-medium tracking-tight text-muted-foreground">
          {fileName}
        </div>
      )}
      <div className="relative pr-8" ref={blockRef}>
        {children}
        <button
          className={cn(
            "absolute top-4 right-4 flex size-7 items-center justify-center rounded border border-gray-2 bg-popover text-muted-foreground",
            "opacity-100 transition-[color,opacity] duration-300 hover:text-foreground/80 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100",
            isCopied && "text-foreground/80",
            height < 50 && "!top-2.5"
          )}
          disabled={isCopied}
          aria-label={cn(isCopied ? "Copied" : "Copy")}
          onClick={() => handleCopy(code)}
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </Tag>
  )
}

export default CodeBlockWrapper
