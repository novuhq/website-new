import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import {
  LinkInlineArrow,
  linkInlineArrowLaguneClassName,
} from "@/components/ui/link-inline-arrow"

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
    category: "Subscriber management",
    tools: [
      {
        name: "create_subscriber",
        description:
          "Create a new subscriber with attributes like name, email, phone, and custom data",
      },
      {
        name: "get_subscriber",
        description: "Retrieve a single subscriber by their subscriberId",
      },
      {
        name: "update_subscriber",
        description: "Update an existing subscriber's attributes",
      },
      {
        name: "delete_subscriber",
        description: "Delete a subscriber by their subscriberId",
      },
      {
        name: "find_subscribers",
        description: "Search for subscribers using various query parameters",
      },
    ],
  },
  {
    category: "Preferences",
    tools: [
      {
        name: "get_subscriber_preferences",
        description: "Get subscriber notification preferences for all channels",
      },
      {
        name: "update_subscriber_preferences",
        description:
          "Update subscriber notification preferences for specific channels",
      },
    ],
  },
  {
    category: "Workflow management",
    tools: [
      {
        name: "create_workflow",
        description:
          "Create a new workflow with comprehensive configuration including steps",
      },
      {
        name: "get_workflow",
        description: "Get detailed information about a specific workflow",
      },
      {
        name: "get_workflows",
        description: "Get all available workflows",
      },
      {
        name: "update_workflow",
        description: "Update an existing workflow",
      },
      {
        name: "delete_workflow",
        description: "Delete a workflow by its unique identifier",
      },
    ],
  },
  {
    category: "Triggering & events",
    tools: [
      {
        name: "trigger_workflow",
        description: "Trigger a workflow to send notifications to a subscriber",
      },
      {
        name: "bulk_trigger_workflow",
        description: "Trigger multiple workflows in a single API call",
      },
      {
        name: "cancel_triggered_event",
        description: "Cancel a pending triggered event",
      },
    ],
  },
  {
    category: "Notifications",
    tools: [
      {
        name: "get_notification",
        description:
          "Get a specific notification by ID with detailed execution logs",
      },
      {
        name: "get_notifications",
        description: "Get notifications/events with advanced filtering options",
      },
    ],
  },
  {
    category: "Integrations",
    tools: [
      {
        name: "get_integrations",
        description:
          "List all channel integrations (email, SMS, push, chat, in-app)",
      },
      {
        name: "get_active_integrations",
        description: "List only the active integrations",
      },
      {
        name: "delete_integration",
        description: "Delete an integration by its integrationId",
      },
      {
        name: "set_primary_integration",
        description: "Mark an integration as the primary for its channel",
      },
    ],
  },
  {
    category: "Other",
    tools: [
      {
        name: "get_environments",
        description: "Get all environments with their details and API keys",
      },
      {
        name: "get_api_key_status",
        description:
          "Check the current API key status and server region configuration",
      },
    ],
  },
]

function getGroupColumnsClassName(toolsCount: number) {
  if (toolsCount >= 3) {
    return "md:grid-cols-2 xl:grid-cols-[18rem_18rem_1fr]"
  }

  if (toolsCount === 2) {
    return "md:grid-cols-2 xl:grid-cols-[18rem_18rem]"
  }

  return "md:grid-cols-1"
}

const DIVIDER_CLASS = "h-px w-full bg-white/12"

function ApiReferenceLink({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTE.docsApis}
      variant="clean"
      size="none"
      className={cn("w-fit", linkInlineArrowLaguneClassName, className)}
    >
      View full API reference
      <LinkInlineArrow lineClassName="bg-lagune-2" />
    </Link>
  )
}

function AgenticTools() {
  return (
    <section className="section-container mt-26 md:mt-48 lg:mt-60">
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

          <ApiReferenceLink />
        </div>

        <div className="flex flex-col gap-7">
          <span className={DIVIDER_CLASS} aria-hidden />
          {TOOL_GROUPS.map((group) => (
            <div className="flex flex-col gap-7" key={group.category}>
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
                <p className="w-full shrink-0 text-sm leading-none text-gray-7 uppercase md:w-40">
                  {group.category}
                </p>

                <div
                  className={cn(
                    "grid w-full gap-x-6 gap-y-8 2xl:w-[53rem]",
                    getGroupColumnsClassName(group.tools.length)
                  )}
                >
                  {group.tools.map((tool) => (
                    <div
                      className="flex min-w-0 flex-col gap-1.5"
                      key={tool.name}
                    >
                      <p className="font-mono text-base leading-none [overflow-wrap:anywhere] text-foreground">
                        {tool.name}
                      </p>
                      <p className="text-sm leading-normal tracking-tighter text-gray-8">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <span className={DIVIDER_CLASS} aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AgenticTools
