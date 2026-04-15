import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

interface IAgenticTool {
  name: string
  description: string
}

interface IAgenticToolGroup {
  category: string
  tools: IAgenticTool[]
}

const TOOL_GROUPS: IAgenticToolGroup[] = [
  {
    category: "Workflow",
    tools: [
      {
        name: "trigger_workflow",
        description: "Trigger a notification workflow",
      },
      {
        name: "get_workflow",
        description: "Retrieve a specific workflow",
      },
      {
        name: "get_workflows",
        description: "List all workflows",
      },
      {
        name: "create_workflow",
        description: "Create a new workflow",
      },
      {
        name: "update_workflow",
        description: "Update an existing workflow",
      },
      {
        name: "delete_workflow",
        description: "Delete a workflow",
      },
    ],
  },
  {
    category: "Subscribers",
    tools: [
      {
        name: "update_subscriber_preferences",
        description: "Update preferences",
      },
      {
        name: "get_subscriber_preferences",
        description: "Get subscriber preferences",
      },
      {
        name: "find_subscribers",
        description: "Retrieve a specific workflow",
      },
    ],
  },
  {
    category: "Notifications",
    tools: [
      {
        name: "get_notifications",
        description: "Retrieve notification history",
      },
    ],
  },
  {
    category: "System",
    tools: [
      {
        name: "get_api_key_status",
        description: "Verify API key validity",
      },
      {
        name: "get_environments",
        description: "List available environments",
      },
    ],
  },
]

function getGroupColumnsClassName(toolsCount: number) {
  if (toolsCount >= 3) {
    return "md:grid-cols-2 lg:grid-cols-[18rem_17rem_1fr]"
  }

  if (toolsCount === 2) {
    return "md:grid-cols-2 lg:grid-cols-[18rem_17rem]"
  }

  return "md:grid-cols-1"
}

const DIVIDER_CLASS = "h-px w-full bg-white/12"

function ApiReferenceLink({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTE.docsApis}
      variant="clean"
      animation="arrow-right"
      size="none"
      className={cn(
        "w-fit items-end text-[15px] leading-[1.375] font-book text-lagune-3 hover:text-lagune-2",
        className
      )}
    >
      View full API reference
      <svg
        aria-hidden
        className="h-4 w-1.5"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </Link>
  )
}

function McpAgenticToolsSection() {
  return (
    <section className="mcp-section-container mt-40 md:mt-48 lg:mt-60">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-6 md:gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[46.875rem] flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-lagune-3" />
              <span className="text-sm leading-none tracking-tight text-lagune-1 uppercase">
                Agentic tools
              </span>
            </div>
            <h2 className="text-[1.75rem] leading-[1.125] font-medium tracking-tighter text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
              Every tool your agent needs to control notification infrastructure
            </h2>
          </div>

          <ApiReferenceLink className="hidden md:inline-flex" />
        </div>

        <div className="flex flex-col gap-7">
          <span aria-hidden className={DIVIDER_CLASS} />
          {TOOL_GROUPS.map((group) => (
            <div key={group.category} className="flex flex-col gap-7">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
                <p className="w-full shrink-0 text-sm leading-none text-gray-7 uppercase md:w-40">
                  {group.category}
                </p>

                <div
                  className={cn(
                    "grid w-full gap-x-6 gap-y-8 2xl:w-[50rem]",
                    getGroupColumnsClassName(group.tools.length)
                  )}
                >
                  {group.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex min-w-0 flex-col gap-1.5"
                    >
                      <p className="font-mono text-base leading-none [overflow-wrap:anywhere] text-foreground">
                        {tool.name}
                      </p>
                      <p className="text-sm leading-[1.5] tracking-[-0.02em] text-gray-8">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <span aria-hidden className={DIVIDER_CLASS} />
            </div>
          ))}
        </div>

        <ApiReferenceLink className="md:hidden" />
      </div>
    </section>
  )
}

export default McpAgenticToolsSection
