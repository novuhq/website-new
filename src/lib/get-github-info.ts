interface GithubInfo {
  stars: number
}

const EMPTY_GITHUB_INFO: GithubInfo = {
  stars: 37347,
}

export async function getGithubInfo(): Promise<GithubInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/novuhq/novu`, {
      next: { revalidate: 3600 },
    })

    if (res.status === 429) {
      console.warn("GitHub API rate limit exceeded, using fallback stars count")
      return EMPTY_GITHUB_INFO
    }

    if (!res.ok) {
      console.warn(`GitHub API returned ${res.status}: ${res.statusText}`)
      return EMPTY_GITHUB_INFO
    }

    const data = await res.json()
    return {
      stars:
        typeof data.stargazers_count === "number"
          ? data.stargazers_count
          : EMPTY_GITHUB_INFO.stars,
    }
  } catch (error) {
    console.warn("Failed to fetch GitHub info:", error)
    return EMPTY_GITHUB_INFO
  }
}
