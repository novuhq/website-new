interface GithubInfo {
  stars: number
}

const EMPTY_GITHUB_INFO: GithubInfo = {
  stars: 37347,
}

export async function getGithubInfo(): Promise<GithubInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/novuhq/novu`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return EMPTY_GITHUB_INFO
    const data = await res.json()
    return {
      stars:
        typeof data.stargazers_count === "number"
          ? data.stargazers_count
          : EMPTY_GITHUB_INFO.stars,
    }
  } catch {
    return EMPTY_GITHUB_INFO
  }
}
