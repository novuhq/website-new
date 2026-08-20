import Image from "next/image"
import { Github, Scale, Timer } from "lucide-react"

import type { DirectoryPost } from "@/lib/directory"
import { getDirectoryTimeAgo } from "@/lib/directory"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

interface DirectorySidebarProps {
  post: DirectoryPost
}

function DetailItem({
  children,
  icon: Icon,
}: {
  children: React.ReactNode
  icon: typeof Timer
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-px size-3.5 shrink-0" aria-hidden />
      <span className="text-sm leading-snug tracking-tighter text-gray-8">
        {children}
      </span>
    </li>
  )
}

export default function DirectorySidebar({ post }: DirectorySidebarProps) {
  return (
    <aside className="mt-[34px] flex shrink-0 flex-col gap-[22px] md:mt-12 md:flex-row md:gap-4 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:mt-[126px] lg:flex-col lg:gap-[26px] xl:col-start-3">
      <div>
        <h2 className="text-base leading-[1.125] font-medium tracking-tighter md:min-w-40">
          Contributors
        </h2>
        <ul className="mt-4 flex flex-col gap-3.5">
          {post.authors.map(({ name, avatar }) => (
            <li className="flex items-center gap-2" key={name}>
              <Image
                className="size-6 shrink-0 rounded-full"
                src={avatar.src}
                alt=""
                width={24}
                height={24}
              />
              <span className="text-sm leading-snug tracking-tighter text-gray-8">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-base leading-[1.125] font-medium tracking-tighter">
          Details
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          <DetailItem icon={Timer}>
            Last updated{" "}
            <time dateTime={post.updatedAt}>
              {getDirectoryTimeAgo(post.updatedAt)}
            </time>
          </DetailItem>
          <DetailItem icon={Scale}>{post.license}</DetailItem>
        </ul>
      </div>
      <div className="mt-0.5 md:ml-auto lg:mt-0 lg:ml-0">
        <ul className="flex flex-col gap-2">
          <li>
            <Button
              className="min-h-10 w-full px-4 md:w-36.5 lg:w-full"
              variant="outline-faded"
              size="none"
              asChild
            >
              <Link href={post.ghSourceLink} size="none" variant="clean">
                <Github className="mr-1.5 size-4" aria-hidden />
                View Source
              </Link>
            </Button>
          </li>
          <li>
            <Button
              className="min-h-10 w-full px-4 md:w-36.5 lg:w-full"
              size="none"
              asChild
            >
              <Link href={post.demoLink} size="none" variant="clean">
                View Demo
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
