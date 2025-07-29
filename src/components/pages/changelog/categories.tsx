import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ICategoriesProps {
  className?: string
  categories: {
    id: string
    title: string
    slug: { current: string }
  }[]
}

function Categories({ className, categories }: ICategoriesProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2.25", className)}>
      {categories.map(({ title, slug }, index) => (
        <li key={index}>
          <Button variant="outline-faded" size="xs" asChild>
            <NextLink href={`${ROUTE.changelog}/category/${slug.current}`}>
              {title}
            </NextLink>
          </Button>
        </li>
      ))}
    </ul>
  )
}

export default Categories
