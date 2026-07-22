import type { MutableRefObject } from "react"

export type TGlobeQuality = "high" | "medium" | "low"
export type TGlobeInteractionMode = "none" | "rotate" | "place-pin"
export type TGlobeChannel = "email" | "slack" | "sms" | "whatsapp"
export type TCardPlacement = "above" | "above-left" | "left" | "right"
export type TGlobeRouteTier = "narrative" | "supporting" | "detail"

export interface IGeoPoint {
  latitude: number
  longitude: number
}

export interface IGlobeRouteNode extends IGeoPoint {
  id: string
  markerSize: number
}

export interface IGlobeRoute {
  id: string
  from: IGlobeRouteNode
  to: IGlobeRouteNode
  altitude: number
  startMs: number
  tier: TGlobeRouteTier
  wave: 1 | 2
}

export interface IGlobeCardLine {
  label: string
  value: string
}

export interface IGlobeCardEvent {
  id: string
  routeId: string
  label: string
  channel: TGlobeChannel
  channelLabel: string
  anchor: IGeoPoint
  placement: TCardPlacement
  startMs: number
  lines: IGlobeCardLine[]
  status: string
  widthPx: number
}

export interface IRouteVisualState {
  endProgress: number
  endMarkerScale: number
  opacity: number
  startProgress: number
  startMarkerScale: number
}

export interface IGlobeCardMotionState {
  backgroundOpacity: number
  headerOpacity: number
  headerScramble: number
  popupOpacity: number
  statusOpacity: number
  textOpacity: number
  textScramble: number
}

export interface IGlobeInteractionState {
  dragging: boolean
  pitch: number
  velocityPitch: number
  velocityYaw: number
  yaw: number
}

export type TElapsedTimeRef = MutableRefObject<number>
export type TInteractionRef = MutableRefObject<IGlobeInteractionState>

export interface IProjectedAnchor {
  visible: boolean
  x: number
  y: number
}
