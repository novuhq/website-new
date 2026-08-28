"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import type { VerticalPreset } from "@/data/pages/agent-preview"
import AgentPreviewComposition, {
  PREVIEW_DURATION,
  PREVIEW_FPS,
  PREVIEW_H,
  PREVIEW_W,
} from "@/components/pages/channels/agent-preview-composition"

// The Remotion Player is browser-only; never render it on the server. dynamic()
// erases the Player's generics, so cast back to its real type to keep prop typing.
const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
) as typeof import("@remotion/player").Player

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

export default function AgentPreviewPlayer({
  accent,
  name,
  logo,
  preset,
}: {
  accent: string
  name: string
  logo: string | null
  preset: VerticalPreset
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <Player
      component={AgentPreviewComposition}
      inputProps={{ accent, name, logo, preset }}
      durationInFrames={PREVIEW_DURATION}
      fps={PREVIEW_FPS}
      compositionWidth={PREVIEW_W}
      compositionHeight={PREVIEW_H}
      // Reduced motion: hold on the final, fully-resolved frame.
      autoPlay={!reduced}
      loop={!reduced}
      initialFrame={reduced ? PREVIEW_DURATION - 1 : 0}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
