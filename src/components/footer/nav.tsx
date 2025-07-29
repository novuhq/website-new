import { IMenuFooterItem } from "@/types/common"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"

interface IFooterNavProps {
  className?: string
  groups: IMenuFooterItem[]
}

function Nav({ className, groups }: IFooterNavProps) {
  return (
    <nav className={cn("flex flex-wrap gap-5 text-sm", className)}>
      <ul className="flex flex-col gap-9.75 md:flex-row md:gap-23 lg:gap-15 xl:gap-39">
        {groups.map(({ title, items }, index) => (
          <li key={index}>
            <p className="text-lg tracking-tighter">{title}</p>
            <ul className="mt-2.75 flex flex-col gap-3 md:mt-3.75 md:gap-4">
              {items.map(({ label, href, isNew }, index) => (
                <li className="flex items-center gap-1.25" key={index}>
                  <Link href={href} variant="ghost">
                    {label}
                  </Link>
                  {isNew && (
                    <Badge
                      className="-translate-y-px"
                      variant="filled"
                      size="sm"
                    >
                      New
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
