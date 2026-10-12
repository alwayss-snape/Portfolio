import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import PointCloud from './PointCloud'
import { sceneInput } from './sceneInput'
import { PAGE_MAX, SIDE_BY_SIDE, pagePadding } from '../lib/layout'

// The hero's 3D element: a transparent canvas over the fog background with a
// slowly turning point cloud beside the name.

const FOV = 35
const CAMERA_Z = 11
const DOLLY = 2 // units toward the cloud across the hero scroll

type Props = {
  rendering: boolean // render only while the hero is on screen and the tab visible
  mobile: boolean
  still: boolean // reduced motion: draw once, fully formed
  highlight: number | null // focus area the visitor is pointing at
  onReady: () => void
}

export default function DataScene({ rendering, mobile, still, highlight, onReady }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={still ? 'demand' : rendering ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
      aria-hidden
    >
      {!still && <CameraRig />}
      <Layout mobile={mobile} still={still} highlight={highlight} />
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

// The cloud's on-screen footprint, in CSS pixels, is about this many times
// its scale (the axis box seen at an angle).
const FOOTPRINT = 6.2

// Wide screens: centred in the right half of the page's content column, so it
// balances the text instead of drifting to the window edge. Narrower screens
// (phones, tablets): centred above the text.
function Layout({ mobile, still, highlight }: { mobile: boolean; still: boolean; highlight: number | null }) {
  const { width: w, height: h } = useThree((s) => s.size)
  const visibleH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const pxToWorld = visibleH / h
  // The hero can be taller than the screen on short phones, so place the
  // cloud against the screen height (the text starts at 40svh), not the canvas.
  const vh = Math.min(h, window.innerHeight)
  let cx: number
  let cy: number
  let box: number // target footprint in px
  if (w >= SIDE_BY_SIDE) {
    const column = Math.min(w, PAGE_MAX) - 2 * pagePadding(w)
    const left = (w - Math.min(w, PAGE_MAX)) / 2 + pagePadding(w)
    cx = left + column * 0.75
    cy = vh * 0.44
    box = Math.min(column * 0.46, vh * 0.66)
  } else {
    // Space above the text: from under the nav to where the hero text starts (40% of the height).
    cx = w / 2
    cy = 64 + (vh * 0.4 - 64) / 2 - 8
    box = Math.min(w * 0.68, vh * 0.4 - 110)
  }
  const x = (cx - w / 2) * pxToWorld
  const y = (h / 2 - cy) * pxToWorld
  const scale = (box * pxToWorld) / FOOTPRINT
  return (
    <PointCloud
      position={[x, y, 0]}
      scale={scale}
      count={mobile ? 1100 : 2000}
      still={still}
      active={highlight}
      mobile={mobile}
    />
  )
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
