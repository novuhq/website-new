import { ROUTE } from "@/constants/routes"
import { PortableTextBlock } from "@portabletext/react"

import { getLatestPosts } from "@/lib/blog"
import { getLatestChangelogPostData } from "@/lib/changelog"

const DEFAULT_CHANLOGE_POST = {
  title: "Check out our latest updates",
  description: "Stay up to date with our latest changes and features",
  href: ROUTE.changelog,
  image: "/images/header/illustration-changelog.jpg",
}

const DEFAULT_BLOG_POST = {
  title: "Check out our latest blog posts",
  description:
    "Discover new blog posts covering product updates, stories, and more",
  href: ROUTE.blog,
  image: "/images/header/illustration-blog.jpg",
}

function getChangelogCaptionFromContent(content: PortableTextBlock[]): string {
  if (!Array.isArray(content)) return ""
  return content
    .map((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children
          .filter((child) => typeof child.text === "string")
          .map((child) => child.text)
          .join("")
      }
      return ""
    })
    .filter(Boolean)
    .join("\n")
}

export async function getLatestBlogPost() {
  try {
    const posts = await getLatestPosts(1)
    const latestPost = posts[0]

    return {
      title: latestPost?.title || DEFAULT_BLOG_POST.title,
      description:
        latestPost?.caption || DEFAULT_BLOG_POST.description,
      href: latestPost?.url || DEFAULT_BLOG_POST.href,
      image: latestPost?.cover || DEFAULT_BLOG_POST.image,
    }
  } catch (error) {
    console.warn("getLatestBlogPost failed, using defaults:", error)
    return DEFAULT_BLOG_POST
  }
}

export async function getLatestChangelogPost() {
  try {
    const latestChangelog = await getLatestChangelogPostData()
    const latestChangelogText = getChangelogCaptionFromContent(
      latestChangelog?.content || []
    )

    return {
      title: latestChangelog?.title || DEFAULT_CHANLOGE_POST.title,
      description:
        latestChangelog?.caption ||
        latestChangelogText.slice(0, 300) ||
        DEFAULT_CHANLOGE_POST.description,
      href: latestChangelog?.pathname || DEFAULT_CHANLOGE_POST.href,
      image: latestChangelog?.cover || DEFAULT_CHANLOGE_POST.image,
    }
  } catch (error) {
    console.warn("getLatestChangelogPost failed, using defaults:", error)
    return DEFAULT_CHANLOGE_POST
  }
}
