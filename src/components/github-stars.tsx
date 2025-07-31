import { ROUTE } from "@/constants/routes"

import { Link } from "@/components/ui/link"
import { Icons } from "@/components/icons"

interface IGithubStarsProps {
  stars: number
}

function GithubStars({ stars }: IGithubStarsProps) {
  const Icon = Icons.github

  return (
    <Link
      className="!gap-2 font-medium uppercase"
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
