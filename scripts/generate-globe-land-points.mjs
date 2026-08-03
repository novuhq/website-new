/* global fetch */

import { Buffer } from "node:buffer"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const NATURAL_EARTH_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_land.geojson"

const QUALITY_PRESETS = [
  { name: "high", step: 1.15 },
  { name: "medium", step: 1.55 },
  { name: "low", step: 2.1 },
]

const QUANTIZATION = 100
const MIN_LATITUDE = -60
const MAX_LATITUDE = 85

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, "../public/globe")

function ringBounds(ring) {
  let minLongitude = Infinity
  let minLatitude = Infinity
  let maxLongitude = -Infinity
  let maxLatitude = -Infinity

  for (const [longitude, latitude] of ring) {
    minLongitude = Math.min(minLongitude, longitude)
    minLatitude = Math.min(minLatitude, latitude)
    maxLongitude = Math.max(maxLongitude, longitude)
    maxLatitude = Math.max(maxLatitude, latitude)
  }

  return { minLongitude, minLatitude, maxLongitude, maxLatitude }
}

function pointInRing(longitude, latitude, ring) {
  let isInside = false

  for (
    let current = 0, previous = ring.length - 1;
    current < ring.length;
    previous = current++
  ) {
    const [currentLongitude, currentLatitude] = ring[current]
    const [previousLongitude, previousLatitude] = ring[previous]
    const crossesLatitude =
      currentLatitude > latitude !== previousLatitude > latitude

    if (!crossesLatitude) continue

    const intersectionLongitude =
      ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
        (previousLatitude - currentLatitude) +
      currentLongitude

    if (longitude < intersectionLongitude) isInside = !isInside
  }

  return isInside
}

function normalizePolygons(geometry) {
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates

  return polygons.map(([outerRing, ...holes]) => ({
    bounds: ringBounds(outerRing),
    holes,
    outerRing,
  }))
}

function pointInLand(longitude, latitude, polygons) {
  for (const polygon of polygons) {
    const { bounds } = polygon
    const outsideBounds =
      longitude < bounds.minLongitude ||
      longitude > bounds.maxLongitude ||
      latitude < bounds.minLatitude ||
      latitude > bounds.maxLatitude

    if (outsideBounds || !pointInRing(longitude, latitude, polygon.outerRing)) {
      continue
    }

    const isInsideHole = polygon.holes.some((hole) =>
      pointInRing(longitude, latitude, hole)
    )

    if (!isInsideHole) return true
  }

  return false
}

function createPointBuffer(polygons, step) {
  const coordinates = []
  for (
    let latitude = MIN_LATITUDE + step / 2;
    latitude <= MAX_LATITUDE;
    latitude += step
  ) {
    for (let longitude = -180 + step / 2; longitude < 180; longitude += step) {
      const wrappedLongitude = longitude > 180 ? longitude - 360 : longitude

      if (pointInLand(wrappedLongitude, latitude, polygons)) {
        coordinates.push(
          Math.round(latitude * QUANTIZATION),
          Math.round(wrappedLongitude * QUANTIZATION)
        )
      }
    }
  }

  const pointCount = coordinates.length / 2
  const buffer = Buffer.allocUnsafe(
    4 + coordinates.length * Int16Array.BYTES_PER_ELEMENT
  )
  buffer.writeUInt32LE(pointCount, 0)

  for (let index = 0; index < coordinates.length; index += 1) {
    buffer.writeInt16LE(coordinates[index], 4 + index * 2)
  }

  return { buffer, pointCount }
}

async function main() {
  const response = await fetch(NATURAL_EARTH_URL)

  if (!response.ok) {
    throw new Error(`Failed to download Natural Earth data: ${response.status}`)
  }

  const featureCollection = await response.json()
  const polygons = featureCollection.features.flatMap((feature) =>
    normalizePolygons(feature.geometry)
  )

  await mkdir(outputDirectory, { recursive: true })

  for (const preset of QUALITY_PRESETS) {
    const { buffer, pointCount } = createPointBuffer(polygons, preset.step)
    const outputPath = path.join(
      outputDirectory,
      `land-points-${preset.name}.bin`
    )

    await writeFile(outputPath, buffer)
    console.info(
      `${preset.name}: ${pointCount.toLocaleString("en-US")} points, ${buffer.byteLength.toLocaleString("en-US")} bytes`
    )
  }
}

await main()
