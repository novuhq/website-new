export interface ContributorHandle {
  /** Lowercase handle, as used in profile URLs. */
  github: string
  /** Handle as the contributors API stores it. */
  sourceGithub: string
  teammate: boolean
  totalPulls: number
}

// Teammate profiles 404, so a community entry beats a teammate one before
// pull requests are compared.
function isPreferredHandle(
  handle: ContributorHandle,
  current: ContributorHandle
) {
  if (handle.teammate !== current.teammate) return !handle.teammate
  return handle.totalPulls > current.totalPulls
}

/**
 * Maps lowercase handles to the casing the contributors API stores, where
 * they differ. The API can list one person under several casings, so the
 * community entry with the most pull requests wins, and the first one on a
 * tie.
 */
export function getSourceGithubs(handles: ContributorHandle[]) {
  const selected = new Map<string, ContributorHandle>()

  for (const handle of handles) {
    const current = selected.get(handle.github)
    if (!current || isPreferredHandle(handle, current)) {
      selected.set(handle.github, handle)
    }
  }

  const sourceGithubs: Record<string, string> = {}

  for (const { github, sourceGithub } of selected.values()) {
    if (sourceGithub !== github) sourceGithubs[github] = sourceGithub
  }

  return sourceGithubs
}

export function resolveSourceGithub(
  sourceGithubs: Record<string, string>,
  github: string
) {
  return Object.hasOwn(sourceGithubs, github) ? sourceGithubs[github] : github
}

/**
 * Resolves profile handles through the contributors list. Without the list it
 * returns null, since a handle stored with capitals would otherwise 404 like
 * a missing profile. After a failed load it skips the list for
 * `retryAfterMs`: failures aren't cached, so otherwise every profile would
 * wait on the list request again.
 */
export function createSourceGithubResolver(
  loadSourceGithubs: () => Promise<Record<string, string>>,
  { retryAfterMs, now = Date.now }: { retryAfterMs: number; now?: () => number }
) {
  let failedAt: number | null = null

  return async (github: string): Promise<string | null> => {
    if (failedAt !== null && now() - failedAt < retryAfterMs) return null

    try {
      const sourceGithubs = await loadSourceGithubs()
      failedAt = null
      return resolveSourceGithub(sourceGithubs, github)
    } catch {
      failedAt = now()
      return null
    }
  }
}
