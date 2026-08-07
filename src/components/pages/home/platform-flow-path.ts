const TRACK_BASE_WIDTH = 1216
const TRACK_BASE_HEIGHT = 420
const TRACK_BASE_LEFT = 160
const TRACK_BASE_RIGHT = 1056
const TRACK_BASE_TOP = 72
const TRACK_BASE_BOTTOM = 349
const TRACK_COMPACT_SIDE_INSET = 0.0625

export interface ITrackSize {
  width: number
  height: number
  isDesktop: boolean
}

export const TRACK_BASE_SIZE: ITrackSize = {
  width: TRACK_BASE_WIDTH,
  height: TRACK_BASE_HEIGHT,
  isDesktop: true,
}

export interface ITrackPoint {
  x: number
  y: number
}

interface ITrackGeometry {
  left: number
  right: number
  top: number
  bottom: number
  radius: number
  centerX: number
  centerY: number
}

export interface ITrackProgressPath {
  path: string
  endPoint: ITrackPoint
}

function createTrackGeometry({
  width,
  height,
  isDesktop,
}: ITrackSize): ITrackGeometry {
  const scaleX = width / TRACK_BASE_WIDTH
  const scaleY = height / TRACK_BASE_HEIGHT
  const left = isDesktop
    ? TRACK_BASE_LEFT * scaleX
    : width * TRACK_COMPACT_SIDE_INSET
  const right = isDesktop
    ? TRACK_BASE_RIGHT * scaleX
    : width * (1 - TRACK_COMPACT_SIDE_INSET)
  const top = TRACK_BASE_TOP * scaleY
  const bottom = TRACK_BASE_BOTTOM * scaleY
  const radius = Math.min((bottom - top) / 2, (right - left) / 2)
  const centerX = (left + right) / 2
  const centerY = (top + bottom) / 2

  return { left, right, top, bottom, radius, centerX, centerY }
}

function formatTrackCoordinate(value: number) {
  return Math.round(value * 1000) / 1000
}

export function createTrackProgressPath(
  trackSize: ITrackSize,
  progress: number
): ITrackProgressPath {
  const { left, right, top, bottom, radius, centerX, centerY } =
    createTrackGeometry(trackSize)
  const safeProgress = Number.isFinite(progress) ? progress : 0
  const clampedProgress = Math.min(Math.max(safeProgress, 0), 1)
  const straightLength = right - left - radius * 2
  const halfStraightLength = straightLength / 2
  const quarterArcLength = (Math.PI * radius) / 2
  const totalLength = straightLength * 2 + Math.PI * radius * 2
  let remainingLength = totalLength * clampedProgress
  let currentX = centerX
  let currentY = top
  let path = `M${formatTrackCoordinate(currentX)} ${formatTrackCoordinate(currentY)}`

  const result = (): ITrackProgressPath => ({
    path,
    endPoint: {
      x: formatTrackCoordinate(currentX),
      y: formatTrackCoordinate(currentY),
    },
  })

  const appendLine = (targetX: number, targetY: number, length: number) => {
    if (length <= 0) {
      currentX = targetX
      currentY = targetY
      return true
    }

    if (remainingLength <= 0) {
      return false
    }

    const segmentProgress = Math.min(remainingLength / length, 1)
    currentX += (targetX - currentX) * segmentProgress
    currentY += (targetY - currentY) * segmentProgress
    path += `L${formatTrackCoordinate(currentX)} ${formatTrackCoordinate(currentY)}`
    remainingLength -= length * segmentProgress

    return segmentProgress === 1
  }

  const appendArc = (
    arcCenterX: number,
    arcCenterY: number,
    startAngle: number,
    endAngle: number
  ) => {
    if (quarterArcLength <= 0) {
      currentX = arcCenterX
      currentY = arcCenterY
      return true
    }

    if (remainingLength <= 0) {
      return false
    }

    const segmentProgress = Math.min(remainingLength / quarterArcLength, 1)
    const angle = startAngle + (endAngle - startAngle) * segmentProgress
    currentX = arcCenterX + radius * Math.cos(angle)
    currentY = arcCenterY + radius * Math.sin(angle)
    path += `A${formatTrackCoordinate(radius)} ${formatTrackCoordinate(radius)} 0 0 1 ${formatTrackCoordinate(currentX)} ${formatTrackCoordinate(currentY)}`
    remainingLength -= quarterArcLength * segmentProgress

    return segmentProgress === 1
  }

  if (!appendLine(right - radius, top, halfStraightLength)) return result()
  if (!appendArc(right - radius, centerY, -Math.PI / 2, 0)) return result()
  if (!appendArc(right - radius, centerY, 0, Math.PI / 2)) return result()
  if (!appendLine(left + radius, bottom, straightLength)) return result()
  if (!appendArc(left + radius, centerY, Math.PI / 2, Math.PI)) {
    return result()
  }
  if (!appendArc(left + radius, centerY, Math.PI, (Math.PI * 3) / 2)) {
    return result()
  }
  appendLine(centerX, top, halfStraightLength)

  return result()
}

export function createTrackPath(trackSize: ITrackSize) {
  return createTrackProgressPath(trackSize, 1).path
}
