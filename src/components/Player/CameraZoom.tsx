import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'

const FOV_NORMAL = 90
const FOV_ZOOMED = 40
const LERP_SPEED = 12

export default function CameraZoom() {
  const { camera } = useThree()
  const keys = useKeyboard()

  useFrame((_, delta) => {
    const target = keys.current.has('Space') ? FOV_ZOOMED : FOV_NORMAL
    const current = (camera as THREE.PerspectiveCamera).fov
    const next = current + (target - current) * Math.min(1, delta * LERP_SPEED)

    if (Math.abs(next - current) > 0.01) {
      ;(camera as THREE.PerspectiveCamera).fov = next
      camera.updateProjectionMatrix()
    }
  })

  return null
}
