export interface ContributorHandle {
  /** Lowercase handle, as used in profile URLs. */
  github: string
  /** Handle as the contributors API stores it. */
  sourceGithub: string
  totalPulls: number
}

/**
 * Maps lowercase handles to the casing the contributors API stores, where
 * they differ. The API can list one person under several casings, so the
 * entry with the most pull requests wins, and the first one on a tie.
 */
export function getSourceGithubs(handles: ContributorHandle[]) {
  const selected = new Map<string, ContributorHandle>()

  for (const handle of handles) {
    const current = selected.get(handle.github)
    if (!current || handle.totalPulls > current.totalPulls) {
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
