import type { DirectoryImageAsset } from "./types"

const directoryImageDefinitions = {
  "/images/pages/directory/authors/emil_pearce.jpeg": {
    alt: "Emil Pearce",
    height: 460,
    width: 460,
  },
  "/images/pages/directory/healthcare/Healthcare-cover.png": {
    alt: "Healthcare application inbox overview",
    height: 1080,
    width: 1920,
  },
  "/images/pages/directory/healthcare/Dashboard-widget.png": {
    alt: "Healthcare dashboard notification widget",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/healthcare/notification-page.png": {
    alt: "Healthcare application notification page",
    height: 1080,
    width: 1920,
  },
  "/images/pages/directory/linear/project-management-cover.png": {
    alt: "Project Management application inbox overview",
    height: 1080,
    width: 1920,
  },
  "/images/pages/directory/linear/Inbox-main.png": {
    alt: "Project Management inbox main view",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/Notification-item.png": {
    alt: "Project Management notification item",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/Inbox-Header.png": {
    alt: "Project Management inbox header",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/NotificationContextMenu.png": {
    alt: "Project Management notification context menu",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/Action-Visual-Indicators.png": {
    alt: "Project Management action visual indicators",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/Status-Indicators.png": {
    alt: "Project Management notification status indicators",
    height: 1005,
    width: 1866,
  },
  "/images/pages/directory/linear/Linear-Usecase.jpg": {
    alt: "Linear use case notification mapping diagram",
    height: 7178,
    width: 6825,
  },
} as const satisfies Record<string, Omit<DirectoryImageAsset, "src">>

export function getDirectoryImageAsset(
  src: string
): DirectoryImageAsset | null {
  const definition =
    directoryImageDefinitions[src as keyof typeof directoryImageDefinitions]

  return definition ? { src, ...definition } : null
}
