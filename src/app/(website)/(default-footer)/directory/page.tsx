import type { Metadata } from "next"
import { directoryIndexContent } from "@/content/directory"

import { getDirectoryPosts } from "@/lib/directory"
import { getMetadata } from "@/lib/get-metadata"
import DirectoryIndex from "@/components/pages/directory/directory-index"

export default async function DirectoryPage() {
  const posts = await getDirectoryPosts()

  return <DirectoryIndex posts={posts} />
}

export const metadata: Metadata = getMetadata({
  title: directoryIndexContent.title,
  description: directoryIndexContent.description,
  pathname: "/directory",
  imagePath: "/images/pages/directory/healthcare/Healthcare-cover.png",
  imageAlt: "Healthcare application inbox overview",
})
