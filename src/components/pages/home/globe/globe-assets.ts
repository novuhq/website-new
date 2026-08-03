import type { TGlobeQuality } from "./globe-types"

const landPointRequests = new Map<TGlobeQuality, Promise<ArrayBuffer>>()

export function getPreferredGlobeQuality(): TGlobeQuality {
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number
  }
  const memory = navigatorWithMemory.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  const width = window.innerWidth

  if (width < 768 || memory <= 4 || cores <= 4) return "low"
  if (width < 1440 || memory <= 8 || cores <= 8) return "medium"
  return "high"
}

export function loadGlobeLandPoints(quality: TGlobeQuality) {
  const cachedRequest = landPointRequests.get(quality)
  if (cachedRequest) return cachedRequest

  const request = fetch(`/globe/land-points-${quality}.bin`)
    .then((response) => {
      if (!response.ok) throw new Error("Unable to load globe land points")
      return response.arrayBuffer()
    })
    .catch((error) => {
      landPointRequests.delete(quality)
      throw error
    })

  landPointRequests.set(quality, request)
  return request
}
