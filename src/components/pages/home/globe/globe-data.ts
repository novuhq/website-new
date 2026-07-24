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
export const GLOBE_CARD_CONTENT_READY_MS = 1_200
export const GLOBE_CARD_EXIT_MS = 670

export const GLOBE_ROUTE_REVEAL_MS = GLOBE_ROUTE_CYCLE_MS * 0.35
export const GLOBE_ROUTE_HOLD_MS = GLOBE_ROUTE_CYCLE_MS * 0.2
export const GLOBE_ROUTE_EXIT_MS = GLOBE_ROUTE_CYCLE_MS * 0.35

// The popup is a delivery result, so it starts only once the route reaches
// its destination marker instead of racing ahead of the line reveal.
export const GLOBE_STORY_CARD_DELAY_MS = GLOBE_ROUTE_REVEAL_MS
export const GLOBE_STORY_GAP_MS = 700
export const GLOBE_STORY_SETTLE_MS = 650
export const GLOBE_STORY_REENTRY_DELAY_MS = 400

export const GLOBE_CONNECTION_NODES = {
  centralSahara: {
    id: "central-sahara",
    latitude: 23,
    longitude: 15,
    markerSize: 0.062,
  },
  centralCanada: {
    id: "central-canada",
    latitude: 57.5,
    longitude: -106,
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
    latitude: 26,
    longitude: 113.2644,
    markerSize: 0.064,
  },
  voronezh: {
    id: "voronezh",
    latitude: 51.6608,
    longitude: 39.2003,
    markerSize: 0.064,
  },
  kamchatka: {
    id: "kamchatka",
    latitude: 53.037,
    longitude: 158.6559,
    markerSize: 0.074,
  },
  chicago: {
    id: "chicago",
    latitude: 39.9,
    longitude: -85.6,
    markerSize: 0.064,
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
const GLOBE_GREENLAND_AMBIENT_ROUTE_START_MS =
  9_726.883 - GLOBE_EURASIA_WAVE_ADVANCE_MS
const GLOBE_INITIAL_CENTRAL_AMERICA_ROUTE_LEAD_MS = 1_730

// Route starts follow the continuous Pacific rotation profile. The Eurasian
// wave is additionally advanced by one second so connections are already
// active as the continent enters the visible hemisphere.
export const GLOBE_ROUTES: IGlobeRoute[] = [
  {
    id: "central-canada-chicago",
    from: GLOBE_CONNECTION_NODES.centralCanada,
    to: GLOBE_CONNECTION_NODES.chicago,
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
    tier: "narrative",
    wave: 2,
  },
  {
    id: "dubai-voronezh",
    from: GLOBE_CONNECTION_NODES.dubai,
    to: GLOBE_CONNECTION_NODES.voronezh,
    altitude: 0.3,
    startMs: 8_109.832 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "narrative",
    wave: 2,
  },
  {
    id: "warsaw-central-sahara",
    from: GLOBE_CONNECTION_NODES.warsaw,
    to: GLOBE_CONNECTION_NODES.centralSahara,
    altitude: 0.45,
    startMs: 8_304.232 - GLOBE_EURASIA_WAVE_ADVANCE_MS,
    tier: "narrative",
    wave: 2,
  },
  {
    id: "mali-burkina-border-nuuk",
    from: GLOBE_CONNECTION_NODES.maliBurkinaBorder,
    to: GLOBE_CONNECTION_NODES.nuuk,
    altitude: 0.49,
    startMs: GLOBE_GREENLAND_AMBIENT_ROUTE_START_MS,
    tier: "narrative",
    wave: 2,
  },
]

export const GLOBE_CARD_EVENTS: IGlobeCardEvent[] = [
  {
    id: "product-event",
    routeId: "central-canada-chicago",
    label: "Product event",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    anchor: GLOBE_CONNECTION_NODES.chicago,
    initialRouteLeadMs: GLOBE_INITIAL_CENTRAL_AMERICA_ROUTE_LEAD_MS,
    placement: "right",
    readHoldMs: 2_400,
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
    placement: "below-right",
    readHoldMs: 3_000,
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
    id: "customer-sync",
    routeId: "novosibirsk-guangzhou",
    label: "Customer sync",
    channel: "slack",
    channelLabel: "Slack",
    anchor: GLOBE_CONNECTION_NODES.guangzhou,
    placement: "right",
    readHoldMs: 2_400,
    startMs: 8_600,
    lines: [
      { label: "Event", value: "customer.updated" },
      { label: "Action", value: "sync crm profile" },
    ],
    status: "Delivered in 72ms",
    widthPx: 250,
  },
  {
    id: "workflow-run",
    routeId: "warsaw-central-sahara",
    label: "Workflow run",
    channel: "email",
    channelLabel: "Email",
    anchor: GLOBE_CONNECTION_NODES.centralSahara,
    placement: "above-right",
    readHoldMs: 2_600,
    startMs: 9_400,
    lines: [
      { label: "Agent", value: "support agent" },
      { label: "Task", value: "send renewal reminder" },
      { label: "To", value: "enterprise account" },
    ],
    status: "Delivered in 88ms",
    widthPx: 270,
  },
  {
    id: "security-event",
    routeId: "dubai-voronezh",
    label: "Security event",
    channel: "sms",
    channelLabel: "SMS",
    anchor: GLOBE_CONNECTION_NODES.voronezh,
    placement: "right",
    readHoldMs: 2_400,
    startMs: 9_000,
    lines: [
      { label: "Event", value: "login.suspicious" },
      { label: "Action", value: "send verification code" },
    ],
    status: "Delivered in 112ms",
    widthPx: 260,
  },
  {
    id: "fallback",
    routeId: "mali-burkina-border-nuuk",
    label: "Fallback",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    anchor: GLOBE_CONNECTION_NODES.nuuk,
    placement: "below-right",
    readHoldMs: 2_800,
    startMs: 10_000,
    lines: [
      { label: "Failed", value: "push delivery" },
      { label: "Action", value: "send whatsapp" },
    ],
    status: "Delivered in 203ms",
    widthPx: 260,
  },
]
