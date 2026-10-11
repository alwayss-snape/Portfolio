import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import PointCloud from './PointCloud'
import { sceneInput } from './sceneInput'

// The hero's 3D element: a transparent canvas over the fog background with a
// slowly turning point cloud beside the name.

const FOV = 35
const CAMERA_Z = 11
const DOLLY = 2 // units toward the cloud across the hero scroll

type Props = {
  active: boolean // render only while the hero is on screen and the tab visible
  mobile: boolean
  still: boolean // reduced motion: draw once, fully formed
  onReady: () => void
}

export default function DataScene({ active, mobile, still, onReady }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={still ? 'demand' : active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
      aria-hidden
    >
      {!still && <CameraRig />}
      <Layout mobile={mobile} still={still} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    const cam = state.camera
    cam.position.z = THREE.MathUtils.damp(cam.position.z, CAMERA_Z - sceneInput.scroll * DOLLY, 4, delta)
  })
  return null
}

// Desktop: right of the name, vertically centred. Phones: above the text.
function Layout({ mobile, still }: { mobile: boolean; still: boolean }) {
  const size = useThree((s) => s.size)
  const aspect = size.width / size.height
  const visibleH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const visibleW = visibleH * aspect
  const portrait = aspect < 1
  const x = portrait ? visibleW * 0.12 : visibleW * 0.23
  const y = portrait ? visibleH * 0.31 : visibleH * 0.08
  const scale = portrait ? Math.min(0.5, visibleW / 9) : Math.min(0.68, visibleW / 17)
  return <PointCloud position={[x, y, 0]} scale={scale} count={mobile ? 1000 : 1600} still={still} />
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    // Frame 1, so it also fires in reduced motion, where only one frame is drawn.
    if (frames.current === 1) onReady()
  })
  return null
}
