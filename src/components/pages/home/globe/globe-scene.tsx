"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import {
  GLOBE_CENTER_Y,
  GLOBE_POINT_SURFACE_OFFSET,
  GLOBE_RADIUS,
} from "./globe-data"
import GlobeLandPoints from "./globe-land-points"
import { geoPointToVector3 } from "./globe-math"
import GlobeRoutes from "./globe-routes"
import { SURFACE_FRAGMENT_SHADER, SURFACE_VERTEX_SHADER } from "./globe-shaders"
import type {
  IGlobeCardEvent,
  IProjectedAnchor,
  TElapsedTimeRef,
  TGlobeQuality,
  TInteractionRef,
  TRoutePlaybackRef,
} from "./globe-types"

interface IGlobeSceneProps {
  activeCards: IGlobeCardEvent[]
  elapsedRef: TElapsedTimeRef
  interactionRef: TInteractionRef
  onAnchorUpdate: (eventId: string, anchor: IProjectedAnchor) => void
  onLoadError: () => void
  onReady: () => void
  quality: TGlobeQuality
  routePlaybackRef: TRoutePlaybackRef
}

const FIGMA_SURFACE_BLUR_WORLD = GLOBE_RADIUS * (0.9210256338119507 / 511.4805)

export default function GlobeScene({
  activeCards,
  elapsedRef,
  interactionRef,
  onAnchorUpdate,
  onLoadError,
  onReady,
  quality,
  routePlaybackRef,
}: IGlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const anchorPositions = useMemo(
    () =>
      activeCards.map((event) => ({
        eventId: event.id,
        position: geoPointToVector3(
          event.anchor,
          GLOBE_RADIUS + GLOBE_POINT_SURFACE_OFFSET
        ),
      })),
    [activeCards]
  )
  const projectedPosition = useMemo(() => new THREE.Vector3(), [])
  const worldNormal = useMemo(() => new THREE.Vector3(), [])
  const worldQuaternion = useMemo(() => new THREE.Quaternion(), [])
  const cameraDirection = useMemo(() => new THREE.Vector3(), [])
  const depthMaskMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        colorWrite: false,
        depthTest: true,
        depthWrite: true,
      }),
    []
  )
  const handleLandReady = useCallback(onReady, [onReady])

  useEffect(
    () => () => {
      depthMaskMaterial.dispose()
    },
    [depthMaskMaterial]
  )

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    const interaction = interactionRef.current
    group.rotation.set(interaction.pitch, interaction.rotation, 0)
    group.updateMatrixWorld()

    for (const { eventId, position } of anchorPositions) {
      projectedPosition.copy(position)
      group.localToWorld(projectedPosition)
      worldNormal
        .copy(position)
        .normalize()
        .applyQuaternion(group.getWorldQuaternion(worldQuaternion))
      cameraDirection.copy(camera.position).sub(projectedPosition).normalize()
      const isFrontFacing = worldNormal.dot(cameraDirection) > 0.06

      projectedPosition.project(camera)
      onAnchorUpdate(eventId, {
        visible:
          isFrontFacing && projectedPosition.z > -1 && projectedPosition.z < 1,
        x: (projectedPosition.x * 0.5 + 0.5) * size.width,
        y: (-projectedPosition.y * 0.5 + 0.5) * size.height,
      })
    }
  })

  return (
    <group position={[0, GLOBE_CENTER_Y, 0]} ref={groupRef}>
      <mesh material={depthMaskMaterial} renderOrder={0}>
        <sphereGeometry args={[GLOBE_RADIUS - 0.018, 48, 32]} />
      </mesh>
      <mesh renderOrder={1}>
        <sphereGeometry
          args={[GLOBE_RADIUS + FIGMA_SURFACE_BLUR_WORLD, 64, 48]}
        />
        <shaderMaterial
          blending={THREE.NormalBlending}
          depthWrite={false}
          fragmentShader={SURFACE_FRAGMENT_SHADER}
          transparent
          vertexShader={SURFACE_VERTEX_SHADER}
        />
      </mesh>
      <GlobeRoutes
        elapsedRef={elapsedRef}
        quality={quality}
        routePlaybackRef={routePlaybackRef}
      />
      <GlobeLandPoints
        onLoadError={onLoadError}
        onReady={handleLandReady}
        quality={quality}
      />
    </group>
  )
}
