import type { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import GetStarted from "@/components/pages/get-started"
import OssFriendsHero from "@/components/pages/oss-friends/hero"

export default function OssFriendsPage() {
  return (
    <>
      <OssFriendsHero />
      <GetStarted />
    </>
  )
}

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.ossFriends,
})
