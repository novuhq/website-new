import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import Rss from "rss"

import { getAllPosts } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL!

export async function GET() {
  try {
    const blogPosts = await getAllPosts(false)

    const feed = new Rss({
      language: "en",
      title: `Blog — ${config.projectName}`,
      description: "Latest blog posts",
      feed_url: `${SITE_URL}${ROUTE.blogRss}`,
      site_url: SITE_URL,
      custom_namespaces: {
        media: "http://search.yahoo.com/mrss/",
      },
    })

    blogPosts.forEach(
      ({ title, slug, publishedAt, category, authors, caption }) => {
        const url = `${SITE_URL}${ROUTE.blog}/${slug.current}`
        feed.item({
          guid: slug.current,
          title,
          description: caption || "",
          url,
          date: new Date(publishedAt),
          author: authors
            ? authors.map((author) => author.name).join(", ")
            : "",
          categories: category ? [category.title] : [],
        })
      }
    )

    return new Response(feed.xml(), {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return new Response("Error generating RSS feed", { status: 500 })
  }
}
