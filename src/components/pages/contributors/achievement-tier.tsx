"use client"

import { useState } from "react"
import Image from "next/image"

import { Link } from "@/components/ui/link"

export interface AchievementProfile {
  github: string
  name?: string
}

interface AchievementTierProps {
  profiles: AchievementProfile[]
}

export default function AchievementTier({ profiles }: AchievementTierProps) {
  const [visibleCount, setVisibleCount] = useState(6)
  const visibleProfiles = profiles.slice(0, visibleCount)

  return (
    <>
      <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:gap-8">
        {visibleProfiles.map(({ github, name }) => (
          <Link
            className="group flex min-w-0 items-center rounded-xl bg-linear-to-b from-gray-2 to-gray-2/70 p-5"
            href={`/contributors/${github.toLowerCase()}`}
            variant="clean"
            size="none"
            key={github.toLowerCase()}
          >
            <Image
              className="mr-3 size-12 shrink-0 rounded-full object-cover grayscale transition-[filter] duration-200 group-hover:grayscale-0"
              width={48}
              height={48}
              src={`https://avatars.githubusercontent.com/${github}?v=4`}
              alt={`${name || github} avatar`}
            />
            <span className="min-w-0">
              <span className="block truncate text-lg leading-tight">
                {name || `@${github}`}
              </span>
              <span className="mt-1.5 block text-sm font-book text-primary transition-colors group-hover:text-white">
                View profile
              </span>
            </span>
          </Link>
        ))}
      </div>

      {profiles.length > visibleProfiles.length && (
        <button
          className="mt-8 rounded-sm border-b border-primary/50 pb-0.5 text-sm text-primary transition-colors hover:text-primary-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          type="button"
          onClick={() => setVisibleCount((count) => count + 24)}
        >
          Show more
        </button>
      )}
    </>
  )
}
