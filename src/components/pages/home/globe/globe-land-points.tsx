"use client"

import { useEffect, useMemo, useState } from "react"
import * as THREE from "three"

import { loadGlobeLandPoints } from "./globe-assets"
import { GLOBE_POINT_SURFACE_OFFSET, GLOBE_RADIUS } from "./globe-data"
import { geoPointToVector3 } from "./globe-math"
import { LAND_FRAGMENT_SHADER, LAND_VERTEX_SHADER } from "./globe-shaders"
import type { TGlobeQuality } from "./globe-types"

interface IGlobeLandPointsProps {
  onGeometryReady: () => void
  onLoadError: () => void
  quality: TGlobeQuality
}

interface ILandPointsGeometryResource {
  geometry: THREE.InstancedBufferGeometry
  quality: TGlobeQuality
}

function parseLandPoints(buffer: ArrayBuffer) {
  if (buffer.byteLength < 4) {
    throw new Error("Invalid globe land-points file")
  }

  const view = new DataView(buffer)
  const pointCount = view.getUint32(0, true)
  const expectedByteLength = 4 + pointCount * 4

  if (buffer.byteLength !== expectedByteLength) {
    throw new Error("Invalid globe land-points file")
  }

  const centers = new Float32Array(pointCount * 3)
  const seeds = new Float32Array(pointCount)

  for (let index = 0; index < pointCount; index += 1) {
    const byteOffset = 4 + index * 4
    const latitude = view.getInt16(byteOffset, true) / 100
    const longitude = view.getInt16(byteOffset + 2, true) / 100
    const position = geoPointToVector3(
      { latitude, longitude },
      GLOBE_RADIUS + GLOBE_POINT_SURFACE_OFFSET
    )
    const positionOffset = index * 3

    centers[positionOffset] = position.x
    centers[positionOffset + 1] = position.y
    centers[positionOffset + 2] = position.z
    seeds[index] = ((index * 16807) % 2147483647) / 2147483647
  }

  const plane = new THREE.PlaneGeometry(1, 1)
  const geometry = new THREE.InstancedBufferGeometry()
  geometry.setIndex(plane.index?.clone() ?? null)
  geometry.setAttribute("position", plane.getAttribute("position").clone())
  geometry.setAttribute("uv", plane.getAttribute("uv").clone())
  geometry.setAttribute(
    "aCenter",
    new THREE.InstancedBufferAttribute(centers, 3)
  )
  geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1))
  geometry.instanceCount = pointCount
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(),
    GLOBE_RADIUS + 0.1
  )
  plane.dispose()

  return geometry
}

export default function GlobeLandPoints({
  onGeometryReady,
  onLoadError,
  quality,
}: IGlobeLandPointsProps) {
  const [resource, setResource] = useState<ILandPointsGeometryResource | null>(
    null
  )
  const pointScale = quality === "high" ? 1 : quality === "medium" ? 0.9 : 0.78
  const geometry = resource?.quality === quality ? resource.geometry : null
  const uniforms = useMemo(
    () => ({ uPointScale: { value: pointScale } }),
    [pointScale]
  )

  useEffect(() => {
    let active = true
    let pendingGeometry: THREE.InstancedBufferGeometry | null = null

    async function loadPoints() {
      try {
        pendingGeometry = parseLandPoints(await loadGlobeLandPoints(quality))

        if (!active) {
          pendingGeometry.dispose()
          pendingGeometry = null
          return
        }

        setResource({ geometry: pendingGeometry, quality })
        pendingGeometry = null
      } catch {
        if (!active) return
        onLoadError()
      }
    }

    void loadPoints()

    return () => {
      active = false
      pendingGeometry?.dispose()
    }
  }, [onLoadError, quality])

  useEffect(() => {
    const resourceGeometry = resource?.geometry
    return () => resourceGeometry?.dispose()
  }, [resource])

  useEffect(() => {
    if (!geometry) return
    onGeometryReady()
  }, [geometry, onGeometryReady])

  if (!geometry) return null

  return (
    <mesh frustumCulled={false} geometry={geometry} renderOrder={3}>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthTest
        depthWrite={false}
        fragmentShader={LAND_FRAGMENT_SHADER}
        side={THREE.FrontSide}
        transparent
        uniforms={uniforms}
        vertexShader={LAND_VERTEX_SHADER}
      />
    </mesh>
  )
}
