import "mixpanel-browser"

declare module "mixpanel-browser" {
  interface Config {
    flags: boolean | Record<string, unknown>
  }
}
