import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cssColor, sceneInput } from './sceneInput'

// A 3D scatter plot: points start as uniform noise and settle into eight
// clusters, one per business action. One cluster is lit in the accent.

const CLUSTERS = 8
const HOT = 0 // index of the highlighted cluster
const SPREAD = 0.26 // cluster standard deviation
const RADIUS = 2 // how far cluster centres sit from the origin
const BOX = 2.4 // half-size of the axis box and the noise volume
const MAX_DELAY = 0.35 // points settle at staggered times
const FORM_SECONDS = 2.6 // noise → clusters on first load
const SPIN = 0.05 // idle yaw, radians per second

// Seeded so the cloud looks the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function gauss(rand: () => number) {
  const u = Math.max(rand(), 1e-6)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

function buildCloud(count: number) {
  const rand = rng(42)
  // Cluster centres spread evenly over a sphere (Fibonacci lattice).
  const centres = Array.from({ length: CLUSTERS }, (_, i) => {
    const y = 1 - ((i + 0.5) / CLUSTERS) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = i * Math.PI * (3 - Math.sqrt(5))
    return new THREE.Vector3(Math.cos(theta) * r, y * 0.8, Math.sin(theta) * r).multiplyScalar(RADIUS)
  })
  const target = new Float32Array(count * 3)
  const start = new Float32Array(count * 3)
  const delay = new Float32Array(count)
  const hot = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const k = i % CLUSTERS
    const c = centres[k]
    target.set([c.x + gauss(rand) * SPREAD, c.y + gauss(rand) * SPREAD, c.z + gauss(rand) * SPREAD], i * 3)
    start.set([(rand() * 2 - 1) * BOX, (rand() * 2 - 1) * BOX, (rand() * 2 - 1) * BOX], i * 3)
    delay[i] = rand() * MAX_DELAY
    hot[i] = k === HOT ? 1 : 0
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(target, 3))
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3))
  geo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1))
  geo.setAttribute('aHot', new THREE.BufferAttribute(hot, 1))
  return geo
}

// Three axes meeting at the back-bottom-left corner of the box, with ticks.
function buildAxes() {
  const o = -BOX
  const len = BOX * 2
  const tick = 0.08
  const pts: number[] = []
  const seg = (a: number[], b: number[]) => pts.push(...a, ...b)
  seg([o, o, o], [o + len, o, o])
  seg([o, o, o], [o, o + len, o])
  seg([o, o, o], [o, o, o + len])
  for (let s = 1; s <= 4; s++) {
    const d = (len / 4) * s
    seg([o + d, o, o], [o + d, o - tick, o])
    seg([o, o + d, o], [o - tick, o + d, o])
    seg([o, o, o + d], [o - tick, o, o + d])
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return geo
}

const vertex = /* glsl */ `
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aHot;
  uniform float uForm;
  uniform float uTime;
  uniform float uSize;
  varying float vHot;
  varying float vDepth;
  void main() {
    float m = clamp((uForm - aDelay) / (1.0 - ${MAX_DELAY.toFixed(2)}), 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aStart, position, m);
    // A slow breath so the cloud never looks frozen.
    p += 0.025 * vec3(sin(uTime * 0.6 + aDelay * 40.0), cos(uTime * 0.5 + aDelay * 31.0), sin(uTime * 0.4 + aDelay * 23.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * mix(1.0, 1.4, aHot) / -mv.z;
    vHot = aHot;
    vDepth = -mv.z;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uHot;
  uniform vec3 uFog;
  varying float vHot;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.36, d);
    vec3 col = mix(uInk, uHot, vHot);
    // Far points sink into the fog, which gives the cloud its depth.
    col = mix(col, uFog, smoothstep(10.5, 14.5, vDepth) * 0.6 * (1.0 - vHot * 0.6));
    gl_FragColor = vec4(col, edge * mix(0.75, 0.95, vHot));
    #include <colorspace_fragment>
  }
`

type Props = {
  position: [number, number, number]
  scale: number
  count: number
  still: boolean // reduced motion: fully formed, no spin
}

export default function PointCloud({ position, scale, count, still }: Props) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const cloudGeo = useMemo(() => buildCloud(count), [count])
  const axesGeo = useMemo(() => buildAxes(), [])
  const hairline = useMemo(() => new THREE.Color(cssColor('--muted', '#6b766d')), [])
  const uniforms = useMemo(
    () => ({
      uForm: { value: still ? 1 : 0 },
      uTime: { value: 0 },
      uSize: { value: 46 * Math.min(window.devicePixelRatio, 2) },
      uInk: { value: new THREE.Color(cssColor('--moss', '#4a5a4e')) },
      uHot: { value: new THREE.Color(cssColor('--rust', '#a4492a')) },
      uFog: { value: new THREE.Color(cssColor('--fog', '#d6dad2')) },
    }),
    [still],
  )

  useFrame((state, delta) => {
    const g = group.current
    const m = material.current
    if (!g || !m || still) return
    const t = state.clock.elapsedTime
    m.uniforms.uTime.value = t
    m.uniforms.uForm.value = Math.min(1, t / FORM_SECONDS)
    // Idle spin, plus a gentle tilt toward the pointer and a turn on scroll.
    g.userData.yaw = (g.userData.yaw ?? 0.6) + delta * SPIN
    const yaw = g.userData.yaw + sceneInput.pointer.x * 0.35 + sceneInput.scroll * 1.2
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.28 + sceneInput.pointer.y * 0.18, 3, delta)
  })

  return (
    <group ref={group} position={position} scale={scale} rotation={[0.28, 0.6, 0]}>
      <lineSegments geometry={axesGeo}>
        <lineBasicMaterial color={hairline} transparent opacity={0.55} />
      </lineSegments>
      <points geometry={cloudGeo}>
        <shaderMaterial
          ref={material}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  )
}
