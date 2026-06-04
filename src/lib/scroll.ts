let previousRootScrollBehavior: string | null = null
let restoreRootScrollBehaviorTimer: number | null = null

export function temporarilyDisableSmoothScroll(duration = 2000) {
  if (typeof document === "undefined") {
    return
  }

  const root = document.documentElement

  previousRootScrollBehavior ??= root.style.scrollBehavior
  root.style.scrollBehavior = "auto"

  if (restoreRootScrollBehaviorTimer) {
    window.clearTimeout(restoreRootScrollBehaviorTimer)
  }

  restoreRootScrollBehaviorTimer = window.setTimeout(() => {
    root.style.scrollBehavior = previousRootScrollBehavior ?? ""
    previousRootScrollBehavior = null
    restoreRootScrollBehaviorTimer = null
  }, duration)
}
