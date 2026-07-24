import * as THREE from "three"

import type { IGeoPoint } from "./globe-types"

const DEGREES_TO_RADIANS = Math.PI / 180

export function geoPointToVector3(point: IGeoPoint, radius: number) {
  const latitude = point.latitude * DEGREES_TO_RADIANS
  const longitude = point.longitude * DEGREES_TO_RADIANS
  const latitudeRadius = Math.cos(latitude)

  return new THREE.Vector3(
    latitudeRadius * Math.sin(longitude) * radius,
    Math.sin(latitude) * radius,
    latitudeRadius * Math.cos(longitude) * radius
  )
}

export function createGeodesicRoutePoints(
  from: IGeoPoint,
  to: IGeoPoint,
  radius: number,
  altitude: number,
  segments = 96
) {
  const start = geoPointToVector3(from, 1)
  const end = geoPointToVector3(to, 1)
  const dot = THREE.MathUtils.clamp(start.dot(end), -1, 1)
  const angle = Math.acos(dot)
  const sinAngle = Math.sin(angle)
  const points: THREE.Vector3[] = []

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments
    let direction: THREE.Vector3

    if (Math.abs(sinAngle) < 0.0001) {
      direction = start.clone().lerp(end, progress).normalize()
    } else {
      const startWeight = Math.sin((1 - progress) * angle) / sinAngle
      const endWeight = Math.sin(progress * angle) / sinAngle
      direction = start
        .clone()
        .multiplyScalar(startWeight)
        .add(end.clone().multiplyScalar(endWeight))
        .normalize()
    }

    const arcHeight = Math.sin(Math.PI * progress) * altitude
    points.push(direction.multiplyScalar(radius + arcHeight))
  }

  return points
}
