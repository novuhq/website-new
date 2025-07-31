interface GithubInfo {
  stars: number
}

const EMPTY_GITHUB_INFO: GithubInfo = {
  stars: 37347,
}

export async function getGithubInfo(): Promise<GithubInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/novuhq/novu`)
    if (!res.ok) return EMPTY_GITHUB_INFO
    const data = await res.json()

    return {
      stars: data.stargazers_count ? data.stargazers_count : null,
    }
  } catch {
    return EMPTY_GITHUB_INFO
  }
}
