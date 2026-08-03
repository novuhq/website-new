"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import {
  GLOBE_POINT_SURFACE_OFFSET,
  GLOBE_RADIUS,
  GLOBE_ROUTE_NODES,
  GLOBE_ROUTES,
} from "./globe-data"
import { createGeodesicRoutePoints, geoPointToVector3 } from "./globe-math"
import { isRouteEnabledForQuality } from "./globe-scheduler"
import {
  MARKER_FRAGMENT_SHADER,
  MARKER_VERTEX_SHADER,
  ROUTE_FRAGMENT_SHADER,
  ROUTE_VERTEX_SHADER,
} from "./globe-shaders"
import { getRouteVisualState } from "./globe-timeline"
import type {
  IRouteVisualState,
  TElapsedTimeRef,
  TGlobeQuality,
  TRoutePlaybackRef,
} from "./globe-types"

interface IGlobeRoutesProps {
  elapsedRef: TElapsedTimeRef
  quality: TGlobeQuality
  routePlaybackRef: TRoutePlaybackRef
}

interface IRouteAsset {
  ambientGeometry: THREE.TubeGeometry
  ambientMaterial: THREE.ShaderMaterial
  ambientMesh: THREE.Mesh | null
  geometry: THREE.TubeGeometry
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh | null
}

interface INodeRouteBinding {
  endpoint: "start" | "end"
  routeIndex: number
}

const ROUTE_MARKER_SIZE_SCALE = 1.3
const ROUTE_LINE_RADIUS = 0.0058
const ROUTE_LINE_GLOW_RADIUS = 0.0135
const ROUTE_LINE_GLOW_OPACITY = 0.2
const ROUTE_TUBULAR_SEGMENTS = 96
const ROUTE_RADIAL_SEGMENTS = 4
const ROUTE_INDICES_PER_SEGMENT = ROUTE_RADIAL_SEGMENTS * 6

export default function GlobeRoutes({
  elapsedRef,
  quality,
  routePlaybackRef,
}: IGlobeRoutesProps) {
  const routeAssets = useMemo<IRouteAsset[]>(
    () =>
      GLOBE_ROUTES.map((route) => {
        const points = createGeodesicRoutePoints(
          route.from,
          route.to,
          GLOBE_RADIUS + GLOBE_POINT_SURFACE_OFFSET,
          route.altitude
        )
        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.TubeGeometry(
          curve,
          ROUTE_TUBULAR_SEGMENTS,
          ROUTE_LINE_RADIUS,
          ROUTE_RADIAL_SEGMENTS,
          false
        )
        const ambientGeometry = new THREE.TubeGeometry(
          curve,
          ROUTE_TUBULAR_SEGMENTS,
          ROUTE_LINE_GLOW_RADIUS,
          ROUTE_RADIAL_SEGMENTS,
          false
        )
        const ambientMaterial = new THREE.ShaderMaterial({
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          fragmentShader: ROUTE_FRAGMENT_SHADER,
          transparent: true,
          uniforms: {
            uOpacity: { value: 0 },
            uScreenStrength: { value: 0.28 },
          },
          vertexShader: ROUTE_VERTEX_SHADER,
        })
        const material = new THREE.ShaderMaterial({
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          fragmentShader: ROUTE_FRAGMENT_SHADER,
          transparent: true,
          uniforms: {
            uOpacity: { value: 0 },
            uScreenStrength: { value: 0.48 },
          },
          vertexShader: ROUTE_VERTEX_SHADER,
        })

        geometry.setDrawRange(0, 0)
        ambientGeometry.setDrawRange(0, 0)

        return {
          ambientGeometry,
          ambientMaterial,
          ambientMesh: null,
          geometry,
          material,
          mesh: null,
        }
      }),
    []
  )
  const nodeRouteBindings = useMemo<INodeRouteBinding[][]>(
    () =>
      GLOBE_ROUTE_NODES.map((node) =>
        GLOBE_ROUTES.flatMap((route, routeIndex) => [
          ...(route.from.id === node.id
            ? [{ endpoint: "start" as const, routeIndex }]
            : []),
          ...(route.to.id === node.id
            ? [{ endpoint: "end" as const, routeIndex }]
            : []),
        ])
      ),
    []
  )
  const markerGeometry = useMemo(() => {
    const centers = new Float32Array(GLOBE_ROUTE_NODES.length * 3)
    const opacities = new Float32Array(GLOBE_ROUTE_NODES.length)
    const scales = new Float32Array(GLOBE_ROUTE_NODES.length)
    const seeds = new Float32Array(GLOBE_ROUTE_NODES.length)
    const sizes = new Float32Array(GLOBE_ROUTE_NODES.length)

    GLOBE_ROUTE_NODES.forEach((node, nodeIndex) => {
      const center = geoPointToVector3(
        node,
        GLOBE_RADIUS + GLOBE_POINT_SURFACE_OFFSET
      )
      const centerOffset = nodeIndex * 3

      centers[centerOffset] = center.x
      centers[centerOffset + 1] = center.y
      centers[centerOffset + 2] = center.z
      seeds[nodeIndex] = (nodeIndex * 0.61803398875) % 1
      sizes[nodeIndex] = node.markerSize * ROUTE_MARKER_SIZE_SCALE
    })

    const plane = new THREE.PlaneGeometry(1, 1)
    const geometry = new THREE.InstancedBufferGeometry()
    geometry.setIndex(plane.index?.clone() ?? null)
    geometry.setAttribute("position", plane.getAttribute("position").clone())
    geometry.setAttribute("uv", plane.getAttribute("uv").clone())
    geometry.setAttribute(
      "aCenter",
      new THREE.InstancedBufferAttribute(centers, 3)
    )
    geometry.setAttribute(
      "aOpacity",
      new THREE.InstancedBufferAttribute(opacities, 1).setUsage(
        THREE.DynamicDrawUsage
      )
    )
    geometry.setAttribute(
      "aScale",
      new THREE.InstancedBufferAttribute(scales, 1).setUsage(
        THREE.DynamicDrawUsage
      )
    )
    geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1))
    geometry.setAttribute("aSize", new THREE.InstancedBufferAttribute(sizes, 1))
    geometry.instanceCount = GLOBE_ROUTE_NODES.length
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)
    plane.dispose()

    return geometry
  }, [])
  const markerMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        blending: THREE.NormalBlending,
        depthTest: true,
        depthWrite: false,
        fragmentShader: MARKER_FRAGMENT_SHADER,
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: MARKER_VERTEX_SHADER,
      }),
    []
  )
  const markerRef = useRef<THREE.Mesh>(null)
  const routeVisualStatesRef = useRef<IRouteVisualState[]>([])

  useFrame(() => {
    const opacities = markerGeometry.getAttribute(
      "aOpacity"
    ) as THREE.BufferAttribute
    const scales = markerGeometry.getAttribute(
      "aScale"
    ) as THREE.BufferAttribute
    let hasVisibleMarkers = false

    GLOBE_ROUTES.forEach((route, routeIndex) => {
      const asset = routeAssets[routeIndex]
      const isEnabled = isRouteEnabledForQuality(route, quality)
      const startedAtMs = routePlaybackRef.current[route.id]
      const visualState = getRouteVisualState(
        route,
        elapsedRef.current,
        startedAtMs ?? Infinity
      )
      routeVisualStatesRef.current[routeIndex] = visualState
      const startIndex =
        Math.floor(ROUTE_TUBULAR_SEGMENTS * visualState.startProgress) *
        ROUTE_INDICES_PER_SEGMENT
      const endIndex =
        Math.floor(ROUTE_TUBULAR_SEGMENTS * visualState.endProgress) *
        ROUTE_INDICES_PER_SEGMENT
      const visibleIndexCount = Math.max(0, endIndex - startIndex)

      asset.geometry.setDrawRange(startIndex, visibleIndexCount)
      asset.ambientGeometry.setDrawRange(startIndex, visibleIndexCount)
      asset.material.uniforms.uOpacity.value =
        visualState.opacity * (isEnabled ? 0.92 : 0)
      asset.ambientMaterial.uniforms.uOpacity.value =
        visualState.opacity * (isEnabled ? ROUTE_LINE_GLOW_OPACITY : 0)
      if (asset.mesh) {
        asset.mesh.visible = isEnabled && visualState.opacity > 0.002
      }
      if (asset.ambientMesh) {
        asset.ambientMesh.visible = isEnabled && visualState.opacity > 0.002
      }
    })

    GLOBE_ROUTE_NODES.forEach((_, nodeIndex) => {
      let markerOpacity = 0
      let markerScale = 0

      nodeRouteBindings[nodeIndex].forEach(({ endpoint, routeIndex }) => {
        if (!isRouteEnabledForQuality(GLOBE_ROUTES[routeIndex], quality)) {
          return
        }

        const visualState = routeVisualStatesRef.current[routeIndex]
        if (!visualState) return
        const endpointScale =
          endpoint === "start"
            ? visualState.startMarkerScale
            : visualState.endMarkerScale

        markerOpacity = Math.max(markerOpacity, endpointScale)
        markerScale = Math.max(markerScale, endpointScale)
      })

      opacities.array[nodeIndex] = markerOpacity * 0.98
      scales.array[nodeIndex] = markerScale
      hasVisibleMarkers ||= markerOpacity > 0.002
    })

    opacities.needsUpdate = true
    scales.needsUpdate = true
    if (markerRef.current) markerRef.current.visible = hasVisibleMarkers
  })

  useEffect(
    () => () => {
      routeAssets.forEach(
        ({ ambientGeometry, ambientMaterial, geometry, material }) => {
          ambientGeometry.dispose()
          ambientMaterial.dispose()
          geometry.dispose()
          material.dispose()
        }
      )
      markerGeometry.dispose()
      markerMaterial.dispose()
    },
    [markerGeometry, markerMaterial, routeAssets]
  )

  return (
    <>
      {routeAssets.map((asset, index) => (
        <group key={GLOBE_ROUTES[index].id}>
          <mesh
            frustumCulled={false}
            geometry={asset.ambientGeometry}
            material={asset.ambientMaterial}
            ref={(mesh) => {
              asset.ambientMesh = mesh
            }}
            renderOrder={2}
          />
          <mesh
            frustumCulled={false}
            geometry={asset.geometry}
            material={asset.material}
            ref={(mesh) => {
              asset.mesh = mesh
            }}
            renderOrder={4}
          />
        </group>
      ))}
      <mesh
        frustumCulled={false}
        geometry={markerGeometry}
        material={markerMaterial}
        ref={markerRef}
        renderOrder={5}
      />
    </>
  )
}
