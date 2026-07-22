import type {
  IGlobeCardEvent,
  IGlobeRoute,
  IGlobeRouteNode,
} from "./globe-types"

export const GLOBE_CYCLE_MS = 16_350
export const GLOBE_ROTATION_MS = GLOBE_CYCLE_MS
export const GLOBE_INITIAL_TIME_MS = 0
export const GLOBE_RADIUS = 2.5536
export const GLOBE_POINT_SURFACE_OFFSET = 0.012
export const GLOBE_CENTER_Y = -2.2536

// Frame.io motion spec. The line starts two frames after its origin square.
export const GLOBE_ROUTE_CYCLE_MS = 7_500
export const GLOBE_ROUTE_DOT_LEAD_MS = 33.333

export const GLOBE_CARD_BACKGROUND_ENTER_MS = 330
export const GLOBE_CARD_HEADER_ENTER_MS = 330
export const GLOBE_CARD_HEADER_SCRAMBLE_MS = 670
export const GLOBE_CARD_TEXT_DELAY_MS = 330
export const GLOBE_CARD_TEXT_ENTER_MS = 670
export const GLOBE_CARD_STATUS_DELAY_MS = 530
export const GLOBE_CARD_STATUS_ENTER_MS = 670
export const GLOBE_CARD_EXIT_START_MS = 1_533.334
export const GLOBE_CARD_EXIT_MS = 670

export const GLOBE_CONNECTION_NODES = {
  arkhangelsk: {
    id: "arkhangelsk",
    latitude: 64.5399,
    longitude: 40.515,
    markerSize: 0.062,
  },
  baghdad: {
    id: "baghdad",
    latitude: 33.3152,
    longitude: 44.3661,
    markerSize: 0.074,
  },
  centralSahara: {
    id: "central-sahara",
    latitude: 23,
    longitude: 15,
    markerSize: 0.062,
  },
  saskatchewan: {
    id: "saskatchewan",
    latitude: 53.2033,
    longitude: -105.7531,
    markerSize: 0.064,
  },
  dubai: {
    id: "dubai",
    latitude: 25.2048,
    longitude: 55.2708,
    markerSize: 0.074,
  },
  guangzhou: {
    id: "guangzhou",
    latitude: 23.1291,
    longitude: 113.2644,
    markerSize: 0.064,
  },
  kamchatka: {
    id: "kamchatka",
    latitude: 53.037,
    longitude: 158.6559,
    markerSize: 0.074,
  },
  highArctic: {
    id: "high-arctic",
    latitude: 82,
    longitude: 30,
    markerSize: 0.06,
  },
  newMexico: {
    id: "new-mexico",
    latitude: 35.687,
    longitude: -105.9378,
    markerSize: 0.06,
  },
  minneapolis: {
    id: "minneapolis",
    latitude: 44.9778,
    longitude: -93.265,
    markerSize: 0.062,
  },
  novosibirsk: {
    id: "novosibirsk",
    latitude: 55.0084,
    longitude: 82.9357,
    markerSize: 0.064,
  },
  nuuk: {
    id: "nuuk",
    latitude: 64.1835,
    longitude: -51.7216,
    markerSize: 0.074,
  },
  qaanaaq: {
    id: "qaanaaq",
    latitude: 77.4667,
    longitude: -69.2306,
    markerSize: 0.06,
  },
  maliBurkinaBorder: {
    id: "mali-burkina-border",
    latitude: 14.55,
    longitude: -2.25,
    markerSize: 0.062,
  },
  vancouver: {
    id: "vancouver",
    latitude: 49.2827,
    longitude: -123.1207,
    markerSize: 0.064,
  },
  warsaw: {
    id: "warsaw",
    latitude: 52.2297,
    longitude: 21.0122,
    markerSize: 0.064,
  },
} as const satisfies Record<string, IGlobeRouteNode>

export const GLOBE_ROUTE_NODES: IGlobeRouteNode[] = Object.values(
  GLOBE_CONNECTION_NODES
)

const GLOBE_EURASIA_WAVE_ADVANCE_MS = 1_000
const GLOBE_GREENLAND_ROUTE_START_MS = 9_726.883 - GLOBE_EURASIA_WAVE_ADVANCE_MS
const GLOBE_FINAL_AMERICA_ROUTE_STAGGER_MS = 750
const GLOBE_FINAL_AMERICA_ROUTE_START_MS =
  GLOBE_GREENLAND_ROUTE_START_MS + GLOBE_FINAL_AMERICA_ROUTE_STAGGER_MS
const GLOBE_FINAL_AMERICA_CARD_DELAY_MS = 12_363.059 - 9_921.283

// Route starts follow the continuous Pacific rotation profile. The Eurasian
// wave is additionally advanced by one second so connections are already
// active as the continent enters the visible hemisphere.
export const GLOBE_ROUTES: IGlobeRoute[] = [
  {
    id: "saskatchewan-new-mexico",
    from: GLOBE_CONNECTION_NODES.saskatchewan,
    to: GLOBE_CONNECTION_NODES.newMexico,
    altitude: 0.24,
    startMs: 383.844,
    tier: "narrative",
    wave: 1,
  },
  {
    id: "kamchatka-vancouver",
    from: GLOBE_CONNECTION_NODES.kamchatka,
    to: GLOBE_CONNECTION_NODES.vancouver,
    altitude: 0.48,
    startMs: 577.231,
    tier: "narrative",
    wave: 1,
  },
  {
    id: "novosibirsk-guangzhou",
    from: GLOBE_CONNECTION_NODES.novosibirsk,
    to: GLOBE_CONNECTION_NODES.guangzhou,
    altitude: 0.31,
    startMs: 7_915.432 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "supporting",
    wave: 2,
  },
  {
    id: "arkhangelsk-dubai",
    from: GLOBE_CONNECTION_NODES.arkhangelsk,
    to: GLOBE_CONNECTION_NODES.dubai,
    altitude: 0.34,
    startMs: 8_109.832 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "supporting",
    wave: 2,
  },
  {
    id: "warsaw-central-sahara",
    from: GLOBE_CONNECTION_NODES.warsaw,
    to: GLOBE_CONNECTION_NODES.centralSahara,
    altitude: 0.45,
    startMs: 8_304.232 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "detail",
    wave: 2,
  },
  {
    id: "arctic-baghdad",
    from: GLOBE_CONNECTION_NODES.highArctic,
    to: GLOBE_CONNECTION_NODES.baghdad,
    altitude: 0.43,
    startMs: 8_498.631 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "narrative",
    wave: 2,
  },
  {
    id: "mali-burkina-border-nuuk",
    from: GLOBE_CONNECTION_NODES.maliBurkinaBorder,
    to: GLOBE_CONNECTION_NODES.nuuk,
    altitude: 0.49,
    startMs: GLOBE_GREENLAND_ROUTE_START_MS,
    tier: "supporting",
    wave: 2,
  },
  {
    id: "qaanaaq-minneapolis",
    from: GLOBE_CONNECTION_NODES.qaanaaq,
    to: GLOBE_CONNECTION_NODES.minneapolis,
    altitude: 0.31,
    startMs: GLOBE_FINAL_AMERICA_ROUTE_START_MS,
    tier: "narrative",
    wave: 2,
  },
]

export const GLOBE_CARD_EVENTS: IGlobeCardEvent[] = [
  {
    id: "product-event",
    routeId: "saskatchewan-new-mexico",
    label: "Product event",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    anchor: GLOBE_CONNECTION_NODES.newMexico,
    placement: "right",
    startMs: 1_289.247,
    lines: [
      { label: "Event", value: "order.shipped" },
      { label: "Action", value: "send tracking link" },
    ],
    status: "Delivered in 84ms",
    widthPx: 250,
  },
  {
    id: "agent-digest",
    routeId: "kamchatka-vancouver",
    label: "Agent digest",
    channel: "email",
    channelLabel: "Email",
    anchor: GLOBE_CONNECTION_NODES.vancouver,
    placement: "right",
    startMs: 2_300.134,
    lines: [
      { label: "Agent", value: "research agent" },
      { label: "Task", value: "weekly competitor report" },
      { label: "To", value: "3 stakeholders" },
    ],
    status: "Delivered in 96ms",
    widthPx: 280,
  },
  {
    id: "fallback",
    routeId: "arctic-baghdad",
    label: "Fallback",
    channel: "sms",
    channelLabel: "SMS",
    anchor: GLOBE_CONNECTION_NODES.baghdad,
    placement: "left",
    startMs: 9_800.519 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    lines: [
      { label: "Event", value: "login.suspicious" },
      { label: "Failed", value: "push delivery" },
      { label: "Action", value: "send sms" },
    ],
    status: "Delivered in 203ms",
    widthPx: 260,
  },
  {
    id: "agent-event",
    routeId: "qaanaaq-minneapolis",
    label: "Agent event",
    channel: "slack",
    channelLabel: "Slack",
    anchor: GLOBE_CONNECTION_NODES.minneapolis,
    placement: "above",
    startMs:
      GLOBE_FINAL_AMERICA_ROUTE_START_MS + GLOBE_FINAL_AMERICA_CARD_DELAY_MS,
    lines: [
      { label: "Agent", value: "claude code" },
      { label: "Event", value: "deploy.finished" },
      { label: "To", value: "on-call engineer" },
    ],
    status: "Delivered in 90ms",
    widthPx: 260,
  },
]
