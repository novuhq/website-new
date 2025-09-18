import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { Icons } from "@/components/icons"

interface IGithubStarsProps {
  className?: string
  stars: number
}

function GithubStars({ className, stars }: IGithubStarsProps) {
  const Icon = Icons.github

  return (
    <Link
      className={cn("!gap-2 font-medium uppercase", className)}
      href={ROUTE.github}
      size="sm"
      variant="foreground"
    >
      <Icon className="!size-6" size={24} />
      <span>{(stars / 1000).toFixed(1)}k</span>
    </Link>
  )
}

export default GithubStars
