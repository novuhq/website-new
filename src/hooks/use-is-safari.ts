import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getServerSnapshot = () => false
const getSnapshot = () =>
  /safari/i.test(navigator.userAgent) &&
  !/(android|chrome|chromium|crios|edg|edgios|fxios|opr|opios)/i.test(
    navigator.userAgent
  )

export function useIsSafari() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
