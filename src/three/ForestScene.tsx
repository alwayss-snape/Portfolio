import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import Ring from './Ring'
import Rain from './Rain'
import { cssColor, sceneInput } from './sceneInput'

// Hybrid hero: the forest is the photo behind this transparent canvas; the
// scene adds the live ring and rain, lit and fogged to sit inside the photo.

const FOV = 35
const CAMERA_Z = 11
const DOLLY = 3 // units toward the ring across the hero scroll
const PARALLAX = 0.55 // camera travel at full pointer deflection (~2.8° at the ring)

type Props = {
  active: boolean // render only while the hero is on screen and the tab visible
  mobile: boolean
  onReady: () => void
}

export default function ForestScene({ active, mobile, onReady }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? 1 : [1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
      aria-hidden
    >
      <Atmosphere />
      <CameraRig mobile={mobile} />
      <Layout />
      {!mobile && <Rain />}
      <FirstFrame onReady={onReady} />
    </Canvas>
  )
}

function Atmosphere() {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)
  const colors = useMemo(
    () => ({
      fog: new THREE.Color(cssColor('--fog', '#d6dad2')),
      moss: new THREE.Color(cssColor('--moss', '#4a5a4e')),
    }),
    [],
  )

  useEffect(() => {
    // Light haze so the ring sits in the same air as the photographed trees.
    scene.fog = new THREE.FogExp2(colors.fog, 0.03)
    // Neutral studio reflections for the brushed steel, generated locally (no HDR download).
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.55
    return () => {
      scene.environment = null
      scene.fog = null
      env.dispose()
      pmrem.dispose()
    }
  }, [scene, gl, colors])

  return (
    <>
      <hemisphereLight args={[colors.fog, colors.moss, 0.7]} />
      <directionalLight position={[-4, 6, 5]} intensity={0.9} color={colors.fog} />
    </>
  )
}

function CameraRig({ mobile }: { mobile: boolean }) {
  useFrame((state, delta) => {
    const cam = state.camera
    let { x, y } = sceneInput.pointer
    if (mobile) {
      const t = state.clock.elapsedTime
      x = Math.sin(t * 0.12) * 0.5
      y = Math.cos(t * 0.09) * 0.3
    }
    cam.position.x = THREE.MathUtils.damp(cam.position.x, x * PARALLAX, 2.5, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, -y * PARALLAX * 0.6, 2.5, delta)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, CAMERA_Z - sceneInput.scroll * DOLLY, 4, delta)
    // "Walking into the fog": haze thickens as the hero scrolls away.
    const fog = state.scene.fog as THREE.FogExp2 | null
    if (fog) fog.density = 0.03 + sceneInput.scroll * 0.05
  })
  return null
}

// Places the ring where the poster painted it: right of centre, a little high.
function Layout() {
  const size = useThree((s) => s.size)
  const aspect = size.width / size.height
  const visibleH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const visibleW = visibleH * aspect
  const portrait = aspect < 1
  const x = visibleW * (portrait ? 0.2 : 0.235)
  // Phones: smaller and higher so it clears the headline block.
  const y = visibleH * (portrait ? 0.2 : 0.1)
  const scale = portrait ? 0.6 : 1
  return <Ring position={[x, y, 0]} scale={scale} />
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 2) onReady()
  })
  return null
}
