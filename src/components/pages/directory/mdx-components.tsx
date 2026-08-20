import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react"
import type { MDXComponents } from "mdx/types"
import type { BundledLanguage } from "shiki/langs"

import { getDirectoryImageAsset } from "@/lib/directory"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import CodeBlock from "@/components/content/code-block"
import Picture from "@/components/content/picture"
import {
  Tab as ContentTab,
  Tabs as ContentTabs,
} from "@/components/content/tabs"

interface DirectoryTabProps {
  children: ReactNode
  title: string
}

const directoryCodeLanguages = [
  "bash",
  "javascript",
  "js",
  "json",
  "jsx",
] as const satisfies readonly BundledLanguage[]

function resolveCodeLanguage(language?: string): BundledLanguage {
  return (
    directoryCodeLanguages.find((candidate) => candidate === language) || "bash"
  )
}

function DirectoryTab({ children, title }: DirectoryTabProps) {
  return (
    <ContentTab
      label={title}
      contentProps={{ className: "directory-content mt-6 mb-0" }}
    >
      {children}
    </ContentTab>
  )
}

function DirectoryTabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<DirectoryTabProps> =>
      isValidElement<DirectoryTabProps>(child) &&
      typeof child.props.title === "string"
  )

  if (tabs.length === 0) {
    return <div className="directory-content mt-6">{children}</div>
  }

  return (
    <ContentTabs labels={tabs.map((tab) => tab.props.title)}>
      {tabs}
    </ContentTabs>
  )
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("")
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }

  return ""
}

async function DirectoryPre({ children }: ComponentPropsWithoutRef<"pre">) {
  const codeElement = isValidElement<{
    children?: ReactNode
    className?: string
  }>(children)
    ? children
    : null
  const language = resolveCodeLanguage(
    codeElement?.props.className?.match(/language-([\w-]+)/)?.[1]
  )
  const code = extractText(codeElement?.props.children ?? children).trim()

  return (
    <CodeBlock
      className="show-linenumbers my-4 bg-black"
      code={code}
      language={language}
    />
  )
}

function DirectoryPicture({
  alt = "",
  caption,
  src,
}: {
  alt?: string
  caption?: string
  src: string
}) {
  const asset = getDirectoryImageAsset(src)

  if (!asset) {
    throw new Error(`[directory] Unknown MDX image: ${src}`)
  }

  return (
    <Picture
      className="mt-[34px] mb-4 md:mt-[34px] md:mb-4"
      src={asset.src}
      alt={alt || asset.alt}
      caption={caption}
      width={asset.width}
      height={asset.height}
    />
  )
}

function DirectoryAnchor({
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  if (!href) {
    return <span {...props}>{children}</span>
  }

  return (
    <Link
      className="font-normal break-words underline underline-offset-[3px]"
      href={href}
      size="none"
      variant="default"
      {...props}
    >
      {children}
    </Link>
  )
}

export function getDirectoryMdxComponents(): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-14 mb-4 text-[32px] leading-[1.125] font-medium tracking-tighter">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-14 mb-4 text-2xl leading-[1.125] font-medium tracking-tighter">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-4 text-lg leading-[1.125] font-medium tracking-tighter">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base leading-normal font-medium">{children}</h5>
    ),
    p: ({ children }) => (
      <p className="my-4 text-base leading-normal tracking-tighter text-gray-9">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="rounded-lg border border-gray-2 p-5 pt-4 text-base leading-normal text-gray-9 not-italic max-md:border-l-2 max-md:pl-3">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-3.5 border-gray-2" />,
    pre: DirectoryPre,
    code: ({ children }) => (
      <code className="rounded-lg border border-gray-5 bg-gray-3 px-1 py-0.5 font-mono text-sm leading-snug font-normal tracking-tighter text-white">
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-inherit">{children}</strong>
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "my-4 list-decimal space-y-2.5 pl-5 text-base leading-normal text-gray-9 [&_ol]:mt-2.5 [&_ol]:pl-6",
          className
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "my-4 space-y-2.5 text-base leading-normal text-gray-9 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:top-0 [&_li]:before:left-0 [&_li]:before:text-white [&_li]:before:content-['–'] [&_ul]:my-2.5",
          className
        )}
        {...props}
      />
    ),
    a: DirectoryAnchor,
    Picture: DirectoryPicture,
    Tab: DirectoryTab,
    Tabs: DirectoryTabs,
  }
}
