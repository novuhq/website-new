export const STATIC_MARKETING_MARKDOWN_PATHNAMES = [
  "/",
  "/book-a-demo",
  "/book-a-demo-connect",
  "/mcp",
  "/copilot",
] as const

type MarkdownRouteFamily = {
  name: string
  pathnames?: readonly string[]
  redirectPathnames?: readonly string[]
  dynamicPatterns?: readonly RegExp[]
  unsupportedPatterns?: readonly RegExp[]
}

export const MARKDOWN_ROUTE_FAMILIES: readonly MarkdownRouteFamily[] = [
  {
    name: "static marketing",
    pathnames: STATIC_MARKETING_MARKDOWN_PATHNAMES,
  },
  {
    name: "pricing",
    pathnames: ["/pricing"],
  },
  {
    name: "connect",
    pathnames: ["/connect"],
  },
  {
    name: "aci",
    pathnames: ["/aci"],
  },
  {
    name: "blog",
    pathnames: ["/blog"],
    dynamicPatterns: [/^\/blog\/[^/]+$/, /^\/blog\/category\/[^/]+$/],
    unsupportedPatterns: [
      /^\/blog\/page\/\d+$/,
      /^\/blog\/category\/[^/]+\/page\/\d+$/,
    ],
  },
  {
    name: "changelog",
    pathnames: ["/changelog"],
    dynamicPatterns: [/^\/changelog\/[^/]+$/, /^\/changelog\/category\/[^/]+$/],
  },
  {
    name: "customers",
    pathnames: ["/customers"],
    dynamicPatterns: [/^\/customers\/[^/]+$/],
  },
  {
    name: "integrations",
    pathnames: ["/integrations/channels", "/integrations/sources"],
    redirectPathnames: ["/integrations"],
    dynamicPatterns: [/^\/integrations\/[^/]+$/],
  },
  {
    name: "comparison",
    dynamicPatterns: [/^\/comparison\/[^/]+$/],
  },
] as const

export function isUnsupportedMarkdownPathname(pathname: string) {
  return MARKDOWN_ROUTE_FAMILIES.some((family) =>
    family.unsupportedPatterns?.some((pattern) => pattern.test(pathname))
  )
}
