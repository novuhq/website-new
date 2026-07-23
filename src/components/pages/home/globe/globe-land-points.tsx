"use client"

import { useEffect, useMemo, useState } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

import { GLOBE_POINT_SURFACE_OFFSET, GLOBE_RADIUS } from "./globe-data"
import { geoPointToVector3 } from "./globe-math"
import { LAND_FRAGMENT_SHADER, LAND_VERTEX_SHADER } from "./globe-shaders"
import type { TGlobeQuality } from "./globe-types"

interface IGlobeLandPointsProps {
  onLoadError: () => void
  onReady: () => void
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
  onLoadError,
  onReady,
  quality,
}: IGlobeLandPointsProps) {
  const [resource, setResource] = useState<ILandPointsGeometryResource | null>(
    null
  )
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const pointScale = quality === "high" ? 1 : quality === "medium" ? 0.9 : 0.78
  const geometry = resource?.quality === quality ? resource.geometry : null
  const uniforms = useMemo(
    () => ({ uPointScale: { value: pointScale } }),
    [pointScale]
  )

  useEffect(() => {
    const abortController = new AbortController()
    let active = true
    let pendingGeometry: THREE.InstancedBufferGeometry | null = null

    async function loadPoints() {
      try {
        const response = await fetch(`/globe/land-points-${quality}.bin`, {
          signal: abortController.signal,
        })

        if (!response.ok) throw new Error("Unable to load globe land points")

        pendingGeometry = parseLandPoints(await response.arrayBuffer())

        if (!active) {
          pendingGeometry.dispose()
          pendingGeometry = null
          return
        }

        setResource({ geometry: pendingGeometry, quality })
        pendingGeometry = null
      } catch (error) {
        if (!active || abortController.signal.aborted) return
        if (error instanceof DOMException && error.name === "AbortError") return
        onLoadError()
      }
    }

    void loadPoints()

    return () => {
      active = false
      abortController.abort()
      pendingGeometry?.dispose()
    }
  }, [onLoadError, quality])

  useEffect(() => {
    const resourceGeometry = resource?.geometry
    return () => resourceGeometry?.dispose()
  }, [resource])

  useEffect(() => {
    if (!geometry) return

    let cancelled = false
    let firstFrame = 0
    let secondFrame = 0

    async function prepareScene() {
      try {
        // Loading the binary only prepares CPU-side buffers. On a cold reload,
        // Safari can still be compiling the instanced shader when React reveals
        // the canvas. Compile the complete scene first, then leave two frames for
        // the uploaded buffers to be drawn before starting the DOM cross-fade.
        await gl.compileAsync(scene, camera)
        if (cancelled) return

        firstFrame = requestAnimationFrame(() => {
          secondFrame = requestAnimationFrame(() => {
            if (!cancelled) onReady()
          })
        })
      } catch {
        if (!cancelled) onLoadError()
      }
    }

    void prepareScene()

    return () => {
      cancelled = true
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [camera, geometry, gl, onLoadError, onReady, scene])

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
