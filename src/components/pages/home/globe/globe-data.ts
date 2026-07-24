import type {
  IGlobeCardEvent,
  IGlobeRoute,
  IGlobeRouteNode,
} from "./globe-types"

export const GLOBE_CYCLE_MS = 16_350
export const GLOBE_ROTATION_MS = GLOBE_CYCLE_MS
export const GLOBE_INITIAL_TIME_MS = 0
export const GLOBE_AUTO_ROTATION_TIME_SCALE = 0.6
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
export const GLOBE_STORY_GAP_MS = 2_200
export const GLOBE_STORY_SETTLE_MS = 300
export const GLOBE_STORY_REENTRY_DELAY_MS = 0

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
  sanFrancisco: {
    id: "san-francisco",
    latitude: 37.7749,
    longitude: -122.4194,
    markerSize: 0.058,
  },
  tokyo: {
    id: "tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    markerSize: 0.06,
  },
  saoPaulo: {
    id: "sao-paulo",
    latitude: -23.5505,
    longitude: -46.6333,
    markerSize: 0.058,
  },
  lisbon: {
    id: "lisbon",
    latitude: 38.7223,
    longitude: -9.1393,
    markerSize: 0.058,
  },
  capeTown: {
    id: "cape-town",
    latitude: -33.9249,
    longitude: 18.4241,
    markerSize: 0.058,
  },
  singapore: {
    id: "singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    markerSize: 0.058,
  },
  sydney: {
    id: "sydney",
    latitude: -33.8688,
    longitude: 151.2093,
    markerSize: 0.058,
  },
  jakarta: {
    id: "jakarta",
    latitude: -6.2088,
    longitude: 106.8456,
    markerSize: 0.058,
  },
  mumbai: {
    id: "mumbai",
    latitude: 19.076,
    longitude: 72.8777,
    markerSize: 0.058,
  },
  berlin: {
    id: "berlin",
    latitude: 52.52,
    longitude: 13.405,
    markerSize: 0.058,
  },
  honolulu: {
    id: "honolulu",
    latitude: 21.3069,
    longitude: -157.8583,
    markerSize: 0.058,
  },
  auckland: {
    id: "auckland",
    latitude: -36.8509,
    longitude: 174.7645,
    markerSize: 0.058,
  },
  mexicoCity: {
    id: "mexico-city",
    latitude: 19.4326,
    longitude: -99.1332,
    markerSize: 0.058,
  },
  bogota: {
    id: "bogota",
    latitude: 4.711,
    longitude: -74.0721,
    markerSize: 0.058,
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
    id: "guangzhou-novosibirsk",
    from: GLOBE_CONNECTION_NODES.guangzhou,
    to: GLOBE_CONNECTION_NODES.novosibirsk,
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
  {
    id: "san-francisco-tokyo",
    from: GLOBE_CONNECTION_NODES.sanFrancisco,
    to: GLOBE_CONNECTION_NODES.tokyo,
    altitude: 0.44,
    startMs: 1_200,
    tier: "narrative",
    wave: 1,
  },
  {
    id: "lisbon-sao-paulo",
    from: GLOBE_CONNECTION_NODES.lisbon,
    to: GLOBE_CONNECTION_NODES.saoPaulo,
    altitude: 0.4,
    startMs: 3_800,
    tier: "supporting",
    wave: 1,
  },
  {
    id: "cape-town-singapore",
    from: GLOBE_CONNECTION_NODES.capeTown,
    to: GLOBE_CONNECTION_NODES.singapore,
    altitude: 0.48,
    startMs: 6_200,
    tier: "detail",
    wave: 2,
  },
  {
    id: "sydney-jakarta",
    from: GLOBE_CONNECTION_NODES.sydney,
    to: GLOBE_CONNECTION_NODES.jakarta,
    altitude: 0.31,
    startMs: 8_200,
    tier: "supporting",
    wave: 2,
  },
  {
    id: "berlin-mumbai",
    from: GLOBE_CONNECTION_NODES.berlin,
    to: GLOBE_CONNECTION_NODES.mumbai,
    altitude: 0.36,
    startMs: 10_200,
    tier: "narrative",
    wave: 2,
  },
  {
    id: "honolulu-auckland",
    from: GLOBE_CONNECTION_NODES.honolulu,
    to: GLOBE_CONNECTION_NODES.auckland,
    altitude: 0.41,
    startMs: 12_400,
    tier: "detail",
    wave: 1,
  },
  {
    id: "mexico-city-bogota",
    from: GLOBE_CONNECTION_NODES.mexicoCity,
    to: GLOBE_CONNECTION_NODES.bogota,
    altitude: 0.28,
    startMs: 14_400,
    tier: "detail",
    wave: 1,
  },
]

// Synthetic but pattern-faithful: every event name and story is modeled on real
// Novu workflow patterns (Mixpanel, hero-safe rows only), never a customer name.
// The dialect mix (dot.notation, Title Case, kebab-case) is intentional; uniform
// naming reads as fake. Latencies are illustrative until product supplies real p50s.
// The approval card ("Needs approval") is Novu Connect's differentiator: agents
// ask, a human decides, the answer returns. Keep at least one per loop.
export const GLOBE_CARD_EVENTS: IGlobeCardEvent[] = [
  {
    id: "product-event",
    routeId: "central-canada-chicago",
    label: "Agent event",
    channel: "slack",
    channelLabel: "Slack",
    anchor: GLOBE_CONNECTION_NODES.chicago,
    initialRouteLeadMs: GLOBE_INITIAL_CENTRAL_AMERICA_ROUTE_LEAD_MS,
    placement: "right",
    readHoldMs: 2_400,
    startMs: 1_289.247,
    lines: [
      { label: "Event", value: "deploy.finished" },
      { label: "Action", value: "notify on-call" },
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
      { label: "Task", value: "weekly summary" },
      { label: "To", value: "3 stakeholders" },
    ],
    status: "Delivered in 96ms",
    widthPx: 280,
  },
  {
    id: "customer-sync",
    routeId: "guangzhou-novosibirsk",
    label: "Needs approval",
    channel: "slack",
    channelLabel: "Slack",
    anchor: GLOBE_CONNECTION_NODES.novosibirsk,
    placement: "right",
    readHoldMs: 3_000,
    startMs: 8_600,
    lines: [
      { label: "Agent", value: "refund agent" },
      { label: "Asks", value: "approve $12,000 refund?" },
      { label: "To", value: "CFO" },
    ],
    status: "Awaiting decision",
    widthPx: 280,
  },
  {
    id: "workflow-run",
    routeId: "warsaw-central-sahara",
    label: "Lifecycle",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    anchor: GLOBE_CONNECTION_NODES.centralSahara,
    placement: "above-right",
    readHoldMs: 2_600,
    startMs: 9_400,
    lines: [
      { label: "Event", value: "account.expires_soon" },
      { label: "Action", value: "send renewal nudge" },
    ],
    status: "Delivered in 88ms",
    widthPx: 270,
  },
  {
    id: "security-event",
    routeId: "dubai-voronezh",
    label: "Security alert",
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
  {
    id: "pacific-product-event",
    routeId: "san-francisco-tokyo",
    label: "Product event",
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    anchor: GLOBE_CONNECTION_NODES.tokyo,
    placement: "below-right",
    readHoldMs: 2_600,
    startMs: 3_825,
    lines: [
      { label: "Event", value: "order.shipped" },
      { label: "Action", value: "send tracking link" },
    ],
    status: "Delivered in 84ms",
    widthPx: 270,
  },
  {
    id: "india-workflow-run",
    routeId: "berlin-mumbai",
    label: "Workflow run",
    channel: "email",
    channelLabel: "Email",
    anchor: GLOBE_CONNECTION_NODES.mumbai,
    placement: "above-right",
    readHoldMs: 2_800,
    startMs: 12_825,
    lines: [
      { label: "Event", value: "invoice.paid" },
      { label: "Action", value: "send payment receipt" },
    ],
    status: "Delivered in 92ms",
    widthPx: 270,
  },
]
