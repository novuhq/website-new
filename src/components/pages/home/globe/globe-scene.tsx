"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  landPointQuality: TGlobeQuality
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
  landPointQuality,
  onAnchorUpdate,
  onLoadError,
  onReady,
  quality,
  routePlaybackRef,
}: IGlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const baseGlobeRef = useRef<THREE.Group>(null)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const size = useThree((state) => state.size)
  const [baseShadersReady, setBaseShadersReady] = useState(false)
  const [landGeometryReady, setLandGeometryReady] = useState(false)
  const [routesMounted, setRoutesMounted] = useState(false)
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
  const handleLandGeometryReady = useCallback(
    () => setLandGeometryReady(true),
    []
  )

  useEffect(
    () => () => {
      depthMaskMaterial.dispose()
    },
    [depthMaskMaterial]
  )

  useEffect(() => {
    const baseGlobe = baseGlobeRef.current
    if (!baseGlobe) return
    const shaderBaseGlobe: THREE.Group = baseGlobe

    let cancelled = false

    // GlobeLandPoints mounts with a zero-instance placeholder, so its shader
    // can compile while the real point coordinates are still in flight.
    void gl
      .compileAsync(shaderBaseGlobe, camera, scene)
      .then(() => {
        if (!cancelled) setBaseShadersReady(true)
      })
      .catch(() => {
        if (!cancelled) onLoadError()
      })

    return () => {
      cancelled = true
    }
  }, [camera, gl, onLoadError, scene])

  useEffect(() => {
    if (!baseShadersReady || !landGeometryReady) return

    let cancelled = false
    let gpuFrame = 0
    let gpuSync: WebGLSync | null = null
    let settleGpuWait: (() => void) | null = null

    function waitForBaseFrame() {
      const context = gl.getContext()

      if (!("fenceSync" in context)) {
        context.finish()
        return Promise.resolve()
      }

      gpuSync = context.fenceSync(context.SYNC_GPU_COMMANDS_COMPLETE, 0)
      if (!gpuSync) {
        context.finish()
        return Promise.resolve()
      }

      context.flush()

      return new Promise<void>((resolve, reject) => {
        let settled = false
        const settle = (error?: Error) => {
          if (settled) return
          settled = true
          settleGpuWait = null
          if (error) reject(error)
          else resolve()
        }
        settleGpuWait = () => settle()

        const poll = () => {
          if (cancelled || !gpuSync) {
            settle()
            return
          }

          const status = context.clientWaitSync(gpuSync, 0, 0)
          if (status === context.WAIT_FAILED) {
            context.deleteSync(gpuSync)
            gpuSync = null
            settle(new Error("Unable to prepare the base globe frame"))
            return
          }

          if (status === context.TIMEOUT_EXPIRED) {
            gpuFrame = requestAnimationFrame(poll)
            return
          }

          context.deleteSync(gpuSync)
          gpuSync = null
          settle()
        }

        gpuFrame = requestAnimationFrame(poll)
      })
    }

    async function prepareBaseGlobe() {
      try {
        // Shader compilation and land-data loading have already completed in
        // parallel. This draw uploads the final attributes before the fence.
        gl.render(scene, camera)
        await waitForBaseFrame()
        if (cancelled) return

        setRoutesMounted(true)
        onReady()
      } catch {
        if (!cancelled) onLoadError()
      }
    }

    void prepareBaseGlobe()

    return () => {
      cancelled = true
      cancelAnimationFrame(gpuFrame)
      settleGpuWait?.()
      settleGpuWait = null

      if (gpuSync) {
        const context = gl.getContext()
        if ("deleteSync" in context) context.deleteSync(gpuSync)
        gpuSync = null
      }
    }
  }, [baseShadersReady, gl, landGeometryReady, onLoadError, onReady])

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
      <group ref={baseGlobeRef}>
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
        <GlobeLandPoints
          onGeometryReady={handleLandGeometryReady}
          onLoadError={onLoadError}
          quality={landPointQuality}
        />
      </group>
      {routesMounted ? (
        <GlobeRoutes
          elapsedRef={elapsedRef}
          quality={quality}
          routePlaybackRef={routePlaybackRef}
        />
      ) : null}
    </group>
  )
}
