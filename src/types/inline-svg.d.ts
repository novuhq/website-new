declare module "*.inline.svg" {
  import type { ComponentType, SVGProps } from "react"

  const Icon: ComponentType<SVGProps<SVGSVGElement>>

  export default Icon
}
