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
