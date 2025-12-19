import mixpanel from "mixpanel-browser"

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

let isInitialized = false
let initPromise: Promise<void> | null = null

export const initMixpanel = (): Promise<void> => {
  if (!MIXPANEL_TOKEN) {
    console.warn("Mixpanel token is missing")
    return Promise.resolve()
  }

  if (isInitialized) {
    return Promise.resolve()
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async (): Promise<void> => {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === "development",
        track_pageview: false,
      })
      isInitialized = true
      console.info("Mixpanel initialized successfully")
    } catch (error) {
      initPromise = null
      console.error("Failed to initialize Mixpanel:", error)
      throw error
    }
  })()

  return initPromise
}

export const trackEvent = async (
  eventName: string,
  props?: Record<string, unknown>
): Promise<void> => {
  try {
    await initMixpanel()

    if (isInitialized) {
      mixpanel.track(eventName, props)
    }
  } catch (error) {
    console.error("Failed to track event:", eventName, error)
  }
}
