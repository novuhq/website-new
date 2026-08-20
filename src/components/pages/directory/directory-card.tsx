import Image from "next/image"

import type { DirectoryPost } from "@/lib/directory"
import { Link } from "@/components/ui/link"

interface DirectoryCardProps {
  headingLevel?: 2 | 3
  post: DirectoryPost
  priority?: boolean
}

export default function DirectoryCard({
  headingLevel = 2,
  post,
  priority = false,
}: DirectoryCardProps) {
  const cover = post.images[0]
  const Heading = `h${headingLevel}` as const

  return (
    <li className="group/item relative flex overflow-hidden rounded-xl bg-[linear-gradient(246.73deg,rgba(60,60,83,0.576)_15.63%,rgba(52,52,71,0.432)_84.63%)] p-px">
      <Link
        className="z-10 block h-full w-full rounded-[11px] text-inherit outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={post.pathname}
        size="none"
        variant="clean"
      >
        <div className="flex h-full flex-col gap-y-3.5 rounded-[11px] bg-[#111018] p-1 transition-colors duration-200 group-focus-within/item:bg-[#16151e] group-hover/item:bg-[#16151e] lg:p-1.5">
          <div className="relative aspect-[332/186] shrink-0 overflow-hidden rounded-lg lg:aspect-[294/168]">
            <Image
              className="object-cover object-center"
              src={cover.src}
              alt=""
              fill
              priority={priority}
              quality={90}
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 332px, 294px"
            />
          </div>
          <div className="overflow-hidden px-3 pb-3 lg:px-2.5 lg:pb-2.5">
            <Heading className="line-clamp-2 text-lg leading-snug font-medium text-[#e6e6e6]">
              {post.title}
            </Heading>
            <p className="mt-2 line-clamp-3 text-[15px] leading-snug font-book tracking-tighter text-gray-8">
              {post.description}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}
