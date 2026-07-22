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
import { getGlobeRotation } from "./globe-timeline"
import type {
  IGlobeCardEvent,
  IProjectedAnchor,
  TElapsedTimeRef,
  TGlobeQuality,
  TInteractionRef,
} from "./globe-types"

interface IGlobeSceneProps {
  active: boolean
  activeCard: IGlobeCardEvent | null
  elapsedRef: TElapsedTimeRef
  interactionRef: TInteractionRef
  onAnchorUpdate: (anchor: IProjectedAnchor) => void
  onLoadError: () => void
  onReady: () => void
  onSlowFrame: () => void
  quality: TGlobeQuality
}

const HIDDEN_ANCHOR: IProjectedAnchor = { visible: false, x: -1000, y: -1000 }
const FIGMA_SURFACE_BLUR_WORLD = GLOBE_RADIUS * (0.9210256338119507 / 511.4805)

export default function GlobeScene({
  active,
  activeCard,
  elapsedRef,
  interactionRef,
  onAnchorUpdate,
  onLoadError,
  onReady,
  onSlowFrame,
  quality,
}: IGlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const slowFrameReportedRef = useRef(false)
  const frameSampleRef = useRef({ count: 0, total: 0 })
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const anchorPosition = useMemo(
    () =>
      activeCard
        ? geoPointToVector3(
            activeCard.anchor,
            GLOBE_RADIUS + GLOBE_POINT_SURFACE_OFFSET
          )
        : null,
    [activeCard]
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

  useEffect(() => {
    slowFrameReportedRef.current = false
    frameSampleRef.current = { count: 0, total: 0 }
  }, [quality])

  useEffect(
    () => () => {
      depthMaskMaterial.dispose()
    },
    [depthMaskMaterial]
  )

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const interaction = interactionRef.current
    if (!interaction.dragging) {
      const frameScale = Math.min(2, delta * 60)
      interaction.yaw += interaction.velocityYaw * frameScale
      interaction.pitch = THREE.MathUtils.clamp(
        interaction.pitch + interaction.velocityPitch * frameScale,
        -0.28,
        0.28
      )
      const damping = Math.pow(0.88, frameScale)
      interaction.velocityYaw *= damping
      interaction.velocityPitch *= damping
    }

    group.rotation.set(
      interaction.pitch,
      getGlobeRotation(elapsedRef.current) + interaction.yaw,
      0
    )
    group.updateMatrixWorld()

    if (!anchorPosition || !activeCard) {
      onAnchorUpdate(HIDDEN_ANCHOR)
    } else {
      projectedPosition.copy(anchorPosition)
      group.localToWorld(projectedPosition)
      worldNormal
        .copy(anchorPosition)
        .normalize()
        .applyQuaternion(group.getWorldQuaternion(worldQuaternion))
      cameraDirection.copy(camera.position).sub(projectedPosition).normalize()
      const isFrontFacing = worldNormal.dot(cameraDirection) > 0.06

      projectedPosition.project(camera)
      onAnchorUpdate({
        visible:
          isFrontFacing && projectedPosition.z > -1 && projectedPosition.z < 1,
        x: (projectedPosition.x * 0.5 + 0.5) * size.width,
        y: (-projectedPosition.y * 0.5 + 0.5) * size.height,
      })
    }

    if (
      active &&
      quality !== "low" &&
      !slowFrameReportedRef.current &&
      delta < 0.1
    ) {
      frameSampleRef.current.count += 1
      frameSampleRef.current.total += delta

      if (frameSampleRef.current.count >= 180) {
        const averageFrameDuration =
          frameSampleRef.current.total / frameSampleRef.current.count
        if (averageFrameDuration > 0.027) {
          slowFrameReportedRef.current = true
          onSlowFrame()
        }
        frameSampleRef.current = { count: 0, total: 0 }
      }
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
      <GlobeRoutes elapsedRef={elapsedRef} quality={quality} />
      <GlobeLandPoints
        onLoadError={onLoadError}
        onReady={handleLandReady}
        quality={quality}
      />
    </group>
  )
}
