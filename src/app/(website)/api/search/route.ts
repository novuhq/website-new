import { NextRequest, NextResponse } from "next/server"

import { getRecentBlogPosts, searchBlogPosts } from "@/lib/search"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type")

  try {
    if (!query) {
      // No query provided, return recent blog posts
      const recentPosts = await getRecentBlogPosts(5)
      return NextResponse.json({ results: recentPosts })
    }

    // Search blog posts
    const blogResults = await searchBlogPosts(query, 15)
    return NextResponse.json({ results: blogResults })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
