"use server"

import Link from "next/link"

import { getSystemsStatus, SystemStatusType } from "@/lib/get-systems-status"
import { cn } from "@/lib/utils"

const statusThemes = {
  up: {
    text: "All systems operational",
    className: "before:bg-[#22c358]",
    values: ["up"],
  },
  down: {
    text: "Some of the services are down",
    className: "before:bg-[#de5835]",
    values: ["down"],
  },
  maintenance: {
    text: "Ongoing maintenance on some services",
    className: "before:bg-[#f1b64c]",
    values: ["maintenance", "paused", "pending", "validating"],
  },
  fetchFailed: {
    text: "Failed to fetch some services",
    className: "before:bg-[#666666]",
    values: [""],
  },
}

async function SystemStatus() {
  let allStatuses: SystemStatusType[] = []
  try {
    allStatuses = await getSystemsStatus()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to load system status", err)
  }

  let currentStatus = statusThemes.fetchFailed

  if (allStatuses.length > 0) {
    const statuses = allStatuses.map((s) => s.status)

    if (statuses.some((status) => statusThemes.down.values.includes(status))) {
      currentStatus = statusThemes.down
    } else if (
      statuses.some((status) =>
        statusThemes.maintenance.values.includes(status)
      )
    ) {
      currentStatus = statusThemes.maintenance
    } else if (statuses.every((status) => status === "up")) {
      currentStatus = statusThemes.up
    }
  }

  return (
    <Link
      className={cn(
        "relative flex items-center gap-1.5 text-base text-foreground hover:text-foreground/80 focus-visible:text-foreground/80 lg:font-light xl:tracking-tighter",
        "before:size-1.5 before:rounded-full",
        currentStatus.className
      )}
      href="https://novustatus.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      {currentStatus.text}
    </Link>
  )
}

export default SystemStatus
