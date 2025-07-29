"use client"

import { ComponentType, memo } from "react"
import dynamic from "next/dynamic"
import { LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

export type LucideIconName = keyof typeof dynamicIconImports

const icons_components = {} as Record<
  LucideIconName,
  ComponentType<LucideProps>
>

for (const name of Object.keys(dynamicIconImports) as LucideIconName[]) {
  icons_components[name] = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ComponentType<LucideProps>
}

interface DynamicIconProps extends Omit<LucideProps, "ref"> {
  icon: string
}

const DynamicIcon = memo(({ icon, ...props }: DynamicIconProps) => {
  const Icon = icons_components[icon as LucideIconName]
  if (!Icon) {
    const Fallback = icons_components["alert-circle"]
    return Fallback ? <Fallback {...props} /> : null
  }
  return <Icon {...props} />
})

DynamicIcon.displayName = "DynamicIcon"

export default DynamicIcon
