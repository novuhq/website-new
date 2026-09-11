"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import type { BrandProfile } from "@/lib/site-brand"
import {
  brandCssVars,
  buildBrandTheme,
  type BrandTheme,
} from "@/lib/web-chat-theme"

export type BrandStatus = "idle" | "loading" | "personalized" | "fallback"

export interface WebChatBrand {
  status: BrandStatus
  theme: BrandTheme
  domain: string | null
  favicon: string | null
  errorMessage: string | null
}

/** An absent accent uses the default theme; only extraction failures show this. */
const FALLBACK_ERROR_MESSAGE =
  "We couldn’t load your brand styles. Showing the default preview."

const DEFAULT_STATE: WebChatBrand = {
  status: "idle",
  theme: buildBrandTheme(null),
  domain: null,
  favicon: null,
  errorMessage: null,
}

function fallbackState(
  domain: string | null,
  favicon: string | null
): WebChatBrand {
  return {
    status: "fallback",
    theme: buildBrandTheme(null),
    domain,
    favicon,
    errorMessage: FALLBACK_ERROR_MESSAGE,
  }
}

/**
 * The subset of `/api/agent-preview`'s `BrandProfile` this provider actually
 * reads. `Pick`-ed from the real type (final-review "also fix" item) rather
 * than duck-typed independently, so a future rename of any of these three
 * fields on `BrandProfile` is a compile error here instead of silent drift.
 */
type AgentPreviewBrand = Pick<BrandProfile, "accent" | "domain" | "logo">

type WebChatBrandContextValue = WebChatBrand & {
  personalize: (url: string) => Promise<void>
  reset: () => void
}

const WebChatBrandContext = createContext<WebChatBrandContextValue | null>(null)

export function WebChatBrandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WebChatBrand>(DEFAULT_STATE)

  // A visitor can submit the form twice before the first request resolves.
  // Each call to `personalize` stamps a request id; only the call that still
  // owns the latest id is allowed to commit its result, so a slow first
  // response can never clobber a faster second one.
  const latestRequestId = useRef(0)

  const personalize = useCallback(async (url: string) => {
    const requestId = ++latestRequestId.current
    setState((prev) => ({ ...prev, status: "loading" }))

    try {
      const response = await fetch("/api/agent-preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (requestId !== latestRequestId.current) return

      if (!response.ok) {
        setState(fallbackState(null, null))
        return
      }

      let payload: { brand?: AgentPreviewBrand }
      try {
        payload = await response.json()
      } catch {
        if (requestId === latestRequestId.current)
          setState(fallbackState(null, null))
        return
      }

      if (requestId !== latestRequestId.current) return

      const brand = payload?.brand
      const domain = brand?.domain ?? null
      const favicon = brand?.logo ?? null

      if (!brand || !domain) {
        setState(fallbackState(domain, favicon))
        return
      }

      setState({
        status: "personalized",
        theme: buildBrandTheme(brand.accent),
        domain,
        favicon,
        errorMessage: null,
      })
    } catch {
      // Network error, aborted request, etc. `personalize` must never throw.
      if (requestId === latestRequestId.current)
        setState(fallbackState(null, null))
    }
  }, [])

  const reset = useCallback(() => {
    // Invalidate any in-flight request so its response can't land after reset.
    latestRequestId.current += 1
    setState(DEFAULT_STATE)
  }, [])

  const value = useMemo<WebChatBrandContextValue>(
    () => ({ ...state, personalize, reset }),
    [state, personalize, reset]
  )

  return (
    <WebChatBrandContext.Provider value={value}>
      <div
        className="group"
        data-wc-state={state.status}
        style={{ ...brandCssVars(state.theme), isolation: "isolate" }}
      >
        {children}
      </div>
    </WebChatBrandContext.Provider>
  )
}

export function useWebChatBrand(): WebChatBrandContextValue {
  const context = useContext(WebChatBrandContext)

  if (!context) {
    throw new Error(
      "useWebChatBrand must be used within a WebChatBrandProvider"
    )
  }

  return context
}
