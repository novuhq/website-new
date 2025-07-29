"use client"

import { ReactNode, useEffect, useState } from "react"
import { useCodeLanguage } from "@/contexts/code-language-context"
import { BundledLanguage } from "shiki/langs"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ICodeTabsWrapperProps {
  labels?: BundledLanguage[]
  className?: string
  children: ReactNode
}

const labelsMap: Partial<Record<BundledLanguage, string>> = {
  js: "JavaScript",
  ts: "TypeScript",
  go: "Go",
  python: "Python",
  java: "Java",
  csharp: "C#",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  bash: "Bash",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
}

function CodeTabsWrapper({
  labels = [],
  className,
  children,
}: ICodeTabsWrapperProps) {
  const { defaultCodeLanguage, setDefaultCodeLanguage } = useCodeLanguage()
  const [activeTab, setActiveTab] = useState<BundledLanguage>(
    labels.includes(defaultCodeLanguage) ? defaultCodeLanguage : labels[0]
  )

  useEffect(() => {
    if (labels.length) {
      setActiveTab(
        labels.includes(defaultCodeLanguage) ? defaultCodeLanguage : labels[0]
      )
    }
  }, [defaultCodeLanguage, labels])

  const handleTabChange = (value: string) => {
    const language = value as BundledLanguage
    setActiveTab(language)
    setDefaultCodeLanguage(language)
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-md border border-gray-2",
        className
      )}
    >
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="h-9 w-full rounded-none border-b border-gray-2 bg-muted/50 p-0">
          <ScrollArea className="w-full">
            <div className="flex w-fit">
              {labels.map((label) => (
                <TabsTrigger
                  key={label}
                  value={label}
                  className={cn(
                    "group relative h-9 rounded-2xl bg-gray-1 px-3.5 py-3 text-xs leading-none font-medium tracking-tight text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:transition-none",
                    "hover:text-foreground hover:after:opacity-20",
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 after:transition-opacity after:duration-300 after:ease-in-out after:content-['']",
                    "data-[state=active]:!text-primary data-[state=active]:after:opacity-100"
                  )}
                >
                  <span className="rounded group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background">
                    {labelsMap[label] || label}
                  </span>
                </TabsTrigger>
              ))}
            </div>
            <ScrollBar className="invisible" orientation="horizontal" />
          </ScrollArea>
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}

export default CodeTabsWrapper
