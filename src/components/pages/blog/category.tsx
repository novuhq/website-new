import { ROUTE } from "@/constants/routes"
import { StarIcon } from "lucide-react"

import { type ICategory } from "@/types/blog"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

interface ICategoryProps {
  className?: string
  category: ICategory
  isFeatured?: boolean
}

function Category({ className, category, isFeatured = false }: ICategoryProps) {
  return (
    <Link
      className={cn(
        "tracking-dense flex w-fit gap-x-1 text-sm leading-none font-medium text-lagune-3 hover:text-lagune-2",
        isFeatured && "h-5 rounded-full pr-2 pl-1.5 md:h-6 [&_svg]:size-3",
        className
      )}
      variant="clean"
      href={
        category ? `${ROUTE.blogCategory}/${category.slug.current}` : ROUTE.blog
      }
    >
      {isFeatured && <StarIcon fill="currentColor" size={12} />}
      {category ? category.title : "General"}
    </Link>
  )
}

export default Category
