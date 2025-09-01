import { ROUTE } from "@/constants/routes"
import { gql, GraphQLClient } from "graphql-request"

import { getChangelogPosts } from "@/lib/changelog"

function getChangelogCaptionFromContent(content: unknown[]): string {
  if (!Array.isArray(content)) return ""
  return content
    .map((block: any) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children
          .filter((child: any) => typeof child.text === "string")
          .map((child: any) => child.text)
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

  return {
    title: data.posts.nodes[0]?.title || "Check out our latest blog posts",
    description:
      data.posts.nodes[0]?.pageBlogPost?.description ||
      "Discover new blog posts covering product updates, stories, and more",
    href: data.posts.nodes[0]?.uri || ROUTE.blog,
    image:
      data.posts.nodes[0]?.pageBlogPost?.image?.link ||
      "/images/header/illustration-blog.jpg",
  }
}

export async function getLatestChangelogPost() {
  const changelogs = await getChangelogPosts()
  const latestChangelog = changelogs[0]
  const latestChangelogText = getChangelogCaptionFromContent(
    latestChangelog.content
  )

  return {
    title: latestChangelog?.title || "Check out our latest updates",
    description:
      latestChangelog?.caption ||
      latestChangelogText.slice(0, 300) ||
      "Stay up to date with our latest changes and features",
    href: latestChangelog?.pathname || ROUTE.changelog,
    image:
      latestChangelog?.cover || "/images/header/illustration-changelog.jpg",
  }
}
