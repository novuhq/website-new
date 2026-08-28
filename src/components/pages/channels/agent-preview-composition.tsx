import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"

import type { VerticalPreset } from "@/data/pages/agent-preview"
import { renderAnswer } from "@/data/pages/agent-preview"

export type AgentPreviewProps = {
  accent: string
  name: string
  logo: string | null
  preset: VerticalPreset
}

export const PREVIEW_FPS = 30
export const PREVIEW_DURATION = 300
export const PREVIEW_W = 384
export const PREVIEW_H = 544

// Timeline (frames @ 30fps)
const TYPE_START = 8
const TYPE_END = 38
const SEND = 44
const REASON_IN = 54
const TOOL_IN = 96
const TOOL_DONE = 128
const CARD_IN = 150
const ANSWER_IN = 208

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', Arial, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace"
const PANEL = "#05050b"
const BORDER = "rgba(255,255,255,0.10)"

function fade(frame: number, start: number, len = 8) {
  return interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
}

/**
 * A scripted, branded Web Chat interaction, driven by the Remotion frame so it
 * plays deterministically inside @remotion/player. Not a real agent: it shows
 * the shape of what the visitor would install in their product.
 */
export function AgentPreviewComposition({
  accent,
  name,
  logo,
  preset,
}: AgentPreviewProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const charCount = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, preset.userAsk.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )
  const typed = preset.userAsk.slice(0, charCount)
  const sent = frame >= SEND
  const cursorOn = frame >= TYPE_START && !sent && Math.floor(frame / 9) % 2 === 0

  const userPop = spring({ frame: frame - SEND, fps, config: { damping: 14, stiffness: 220 } })
  const toolDone = frame >= TOOL_DONE
  const cardPop = spring({ frame: frame - CARD_IN, fps, config: { damping: 15, stiffness: 180, mass: 0.9 } })

  return (
    <AbsoluteFill
      style={{
        background: PANEL,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: logo ? "#000" : accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            name.slice(0, 1).toUpperCase()
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Agent</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 11, color: "#9a9aa5" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34C759" }} />
            live in {name}
          </span>
        </div>
      </div>

      {/* Conversation */}
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* User message */}
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "85%",
            borderRadius: 12,
            background: accent,
            color: "#fff",
            padding: "9px 13px",
            fontSize: 14,
            lineHeight: 1.35,
            transform: `scale(${sent ? 0.94 + userPop * 0.06 : 1})`,
            transformOrigin: "100% 100%",
            opacity: frame >= TYPE_START ? 1 : 0,
          }}
        >
          {typed}
          {cursorOn && <span style={{ opacity: 0.9 }}>|</span>}
        </div>

        {/* Reasoning */}
        {frame >= REASON_IN && (
          <div style={{ opacity: fade(frame, REASON_IN), display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7d7d88" }}>
              Thinking
            </span>
            <span style={{ fontSize: 13, color: "#c7c7cf" }}>{preset.reasoning}</span>

            {/* Tool call */}
            {frame >= TOOL_IN && (
              <div
                style={{
                  opacity: fade(frame, TOOL_IN),
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "#c7c7cf",
                  background: "#000",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: `2px solid ${toolDone ? "#34C759" : "rgba(255,255,255,0.25)"}`,
                    borderTopColor: toolDone ? "#34C759" : accent,
                    transform: toolDone ? "none" : `rotate(${frame * 24}deg)`,
                    display: "inline-block",
                  }}
                />
                {preset.tool}
                {toolDone && <span style={{ color: "#34C759" }}>done</span>}
              </div>
            )}
          </div>
        )}

        {/* Result card (branded generative UI) */}
        {frame >= CARD_IN && (
          <div
            style={{
              opacity: Math.min(1, cardPop),
              transform: `translateY(${(1 - Math.min(1, cardPop)) * 10}px)`,
              border: `1px solid ${accent}66`,
              background: `${accent}14`,
              borderRadius: 12,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>{preset.cardTitle}</span>
            {preset.cardLines.map((line, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12.5,
                  color: "#b8b8c2",
                  opacity: fade(frame, CARD_IN + 6 + i * 5),
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* Agent answer */}
        {frame >= ANSWER_IN && (
          <div
            style={{
              opacity: fade(frame, ANSWER_IN),
              alignSelf: "flex-start",
              maxWidth: "90%",
              fontSize: 14,
              lineHeight: 1.4,
              color: "#eaeaf0",
            }}
          >
            {renderAnswer(preset.answer, name)}
          </div>
        )}
      </div>

      {/* Composer (static) */}
      <div style={{ padding: 12, borderTop: `1px solid ${BORDER}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "10px 12px",
            color: "#6f6f7a",
            fontSize: 13,
          }}
        >
          Message the agent...
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
            }}
          >
            ↑
          </span>
        </div>
      </div>
    </AbsoluteFill>
  )
}

export default AgentPreviewComposition
