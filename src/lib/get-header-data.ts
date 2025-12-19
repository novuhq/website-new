import { ROUTE } from "@/constants/routes"
import { PortableTextBlock } from "@portabletext/react"
import { gql, GraphQLClient } from "graphql-request"

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

export async function getLatestWpPost() {
  const { WP_GRAPHQL_URL, WP_HTACCESS_USERNAME, WP_HTACCESS_PASSWORD } =
    process.env

  if (!WP_GRAPHQL_URL || !WP_HTACCESS_USERNAME || !WP_HTACCESS_PASSWORD) {
    throw new Error("Missing required WP GraphQL environment variables.")
  }

  const client = new GraphQLClient(WP_GRAPHQL_URL, {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${WP_HTACCESS_USERNAME}:${WP_HTACCESS_PASSWORD}`).toString(
          "base64"
        ),
    },
  })

  try {
    const query = gql`
      query GetLatestPost {
        posts(first: 1, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            title
            uri
            pageBlogPost {
              description
              image {
                link
              }
            }
          }
        }
      }
    `

    const data = (await client.request(query)) as {
      posts: {
        nodes: Array<{
          title: string
          uri: string
          pageBlogPost?: {
            description?: string
            image?: { link: string }
          }
        }>
      }
    }

    const latestPost = data?.posts?.nodes[0]

    return {
      title: latestPost?.title || DEFAULT_BLOG_POST.title,
      description:
        latestPost?.pageBlogPost?.description || DEFAULT_BLOG_POST.description,
      href: latestPost?.uri || DEFAULT_BLOG_POST.href,
      image: latestPost?.pageBlogPost?.image?.link || DEFAULT_BLOG_POST.image,
    }
  } catch (error) {
    console.warn("getLatestWpPost failed, using defaults:", error)
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
