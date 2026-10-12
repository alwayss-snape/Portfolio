import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cssColor, sceneInput } from './sceneInput'
import { BOX, CLUSTERS, SPREAD, centres, shapes, vividColors } from './clusterLayout'
import ClusterExtras, { type Levels } from './ClusterExtras'

// A 3D scatter plot: points start as uniform noise and settle into four
// clusters, one per focus area in the hero, each in its category colour.
// The active cluster grows a little brighter and the rest fade into the fog.

const DIM = 0.55 // how far inactive clusters fade toward the fog
const MAX_DELAY = 0.35 // points settle at staggered times
const FORM_SECONDS = 3 // noise → clusters on first load
const FORM_DELAY = 0.5 // starts once the canvas has begun fading in
const SPIN = 0.05 // idle yaw, radians per second
// Touch screens have no pointer to follow, so the cloud turns faster and
// drifts gently on its own; otherwise it looks frozen on a phone.
const TOUCH_SPIN = 0.2
const touchOnly = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
const BASE_PITCH = 0.28

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
  const target = new Float32Array(count * 3)
  const start = new Float32Array(count * 3)
  const delay = new Float32Array(count)
  const cluster = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const k = i % CLUSTERS
    const c = centres[k]
    const [sx, sy, sz] = shapes[k]
    target.set([c.x + gauss(rand) * SPREAD * sx, c.y + gauss(rand) * SPREAD * sy, c.z + gauss(rand) * SPREAD * sz], i * 3)
    start.set([(rand() * 2 - 1) * BOX, (rand() * 2 - 1) * BOX, (rand() * 2 - 1) * BOX], i * 3)
    delay[i] = rand() * MAX_DELAY
    cluster[i] = k
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(target, 3))
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3))
  geo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1))
  geo.setAttribute('aCluster', new THREE.BufferAttribute(cluster, 1))
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
  attribute float aCluster;
  uniform float uForm;
  uniform float uTime;
  uniform float uSize;
  uniform vec4 uLevel; // per cluster: 0 = plain, 1 = fully lit
  uniform float uDim; // how much unlit clusters fade
  uniform vec3 uCats[4]; // category colours, in cluster order
  varying float vLevel;
  varying float vFade;
  varying vec3 vColor;
  void main() {
    float m = clamp((uForm - aDelay) / (1.0 - ${MAX_DELAY.toFixed(2)}), 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aStart, position, m);
    // A slow breath so the cloud never looks frozen.
    p += 0.025 * vec3(sin(uTime * 0.6 + aDelay * 40.0), cos(uTime * 0.5 + aDelay * 31.0), sin(uTime * 0.4 + aDelay * 23.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vec4 pick = vec4(1.0) - step(vec4(0.5), abs(vec4(aCluster) - vec4(0.0, 1.0, 2.0, 3.0)));
    vLevel = dot(uLevel, pick);
    vColor = uCats[0] * pick.x + uCats[1] * pick.y + uCats[2] * pick.z + uCats[3] * pick.w;
    gl_PointSize = uSize * mix(1.0, 1.35, vLevel) / -mv.z;
    // Far points sink into the fog; unlit clusters sink further while one is active.
    vFade = smoothstep(10.5, 14.5, -mv.z) * 0.6 + uDim * (1.0 - vLevel);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uFog;
  varying float vLevel;
  varying float vFade;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.36, d);
    vec3 col = mix(vColor, uFog, clamp(vFade, 0.0, 0.85) * (1.0 - vLevel * 0.6));
    gl_FragColor = vec4(col, edge * mix(0.8, 0.95, vLevel));
    #include <colorspace_fragment>
  }
`

type Props = {
  position: [number, number, number]
  scale: number
  count: number
  still: boolean // reduced motion: fully formed, no spin, highlight changes snap
  active: number | null // focus area the visitor is pointing at
  mobile: boolean
  pointScale: number // smaller dots when the cloud is drawn small (phones)
}

const levelsFor = (active: number | null) => Array.from({ length: CLUSTERS }, (_, i) => (i === active ? 1 : 0))

export default function PointCloud({ position, scale, count, still, active, mobile, pointScale }: Props) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const invalidate = useThree((s) => s.invalidate)
  const cloudGeo = useMemo(() => buildCloud(count), [count])
  const axesGeo = useMemo(() => buildAxes(), [])
  const hairline = useMemo(() => new THREE.Color(cssColor('--muted', '#6b766d')), [])
  const colors = useMemo(() => vividColors(), [])
  // Eased highlight state, shared with the extras so everything dims together.
  const levels = useRef<Levels>({ lit: new THREE.Vector4(), dim: 0 })
  useEffect(() => () => cloudGeo.dispose(), [cloudGeo])
  useEffect(() => () => axesGeo.dispose(), [axesGeo])
  const uniforms = useMemo(
    () => ({
      uForm: { value: still ? 1 : 0 },
      uTime: { value: 0 },
      uSize: { value: 46 * pointScale * Math.min(window.devicePixelRatio, 2) },
      uLevel: { value: new THREE.Vector4(...levelsFor(null)) },
      uDim: { value: 0 },
      uCats: { value: colors },
      uFog: { value: new THREE.Color(cssColor('--fog', '#d6dad2')) },
    }),
    [still, colors, pointScale],
  )
  const spin = useRef({ yaw: 0.6, amount: 1 })
  // Formation is timed from the first frame actually drawn, not from when the
  // renderer was created: on phones, loading and shader compilation can take
  // a few seconds, and the gathering used to finish before anyone saw it.
  const firstFrame = useRef<number | null>(null)
  const tmp = useMemo(() => new THREE.Vector3(), [])

  // Reduced motion: no easing, so redraw the single frame whenever the highlight changes.
  useEffect(() => {
    const m = material.current
    if (!still || !m) return
    m.uniforms.uLevel.value.set(...levelsFor(active))
    m.uniforms.uDim.value = active === null ? 0 : DIM
    levels.current.lit.copy(m.uniforms.uLevel.value)
    levels.current.dim = m.uniforms.uDim.value
    invalidate()
  }, [active, still, invalidate])

  useFrame((state, delta) => {
    const g = group.current
    const m = material.current
    if (!g || !m) return

    if (!still) {
      const t = state.clock.elapsedTime
      m.uniforms.uTime.value = t
      firstFrame.current ??= t
      const formT = t - firstFrame.current - FORM_DELAY
      m.uniforms.uForm.value = Math.min(1, Math.max(0, formT / FORM_SECONDS))

      // Ease each cluster toward its target level.
      const target = levelsFor(active)
      const lv = m.uniforms.uLevel.value as THREE.Vector4
      lv.set(
        THREE.MathUtils.damp(lv.x, target[0], 6, delta),
        THREE.MathUtils.damp(lv.y, target[1], 6, delta),
        THREE.MathUtils.damp(lv.z, target[2], 6, delta),
        THREE.MathUtils.damp(lv.w, target[3], 6, delta),
      )
      m.uniforms.uDim.value = THREE.MathUtils.damp(m.uniforms.uDim.value, active === null ? 0 : DIM, 6, delta)
      levels.current.lit.copy(lv)
      levels.current.dim = m.uniforms.uDim.value

      // Dragging pauses the idle spin; on release the turn is kept and the spin eases back in.
      const drag = sceneInput.drag
      const s = spin.current
      if (!drag.active && drag.yaw !== 0) {
        s.yaw += drag.yaw
        drag.yaw = 0
      }
      if (!drag.active) drag.pitch = THREE.MathUtils.damp(drag.pitch, 0, 3, delta)
      s.amount = THREE.MathUtils.damp(s.amount, drag.active ? 0 : 1, 1.5, delta)
      s.yaw += delta * (touchOnly ? TOUCH_SPIN : SPIN) * s.amount

      const yaw = s.yaw + drag.yaw + sceneInput.pointer.x * 0.35 * s.amount + sceneInput.scroll * 1.2
      const drift = touchOnly ? Math.sin(t * 0.35) * 0.16 : 0
      const pitch = BASE_PITCH + drag.pitch + drift + sceneInput.pointer.y * 0.18 * s.amount
      const k = drag.active ? 14 : 3
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, k, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, THREE.MathUtils.clamp(pitch, -0.6, 1.1), k, delta)
    }

    // Report where each cluster sits on screen so the DOM can hit-test hovers.
    g.updateMatrixWorld()
    const { width, height } = state.size
    sceneInput.clusters = centres.map((c) => {
      tmp.copy(c)
      g.localToWorld(tmp).project(state.camera)
      return { x: ((tmp.x + 1) / 2) * width, y: ((1 - tmp.y) / 2) * height }
    })
    tmp.set(SPREAD * 2.4 * scale, 0, 0).add(g.position).project(state.camera)
    const edge = ((tmp.x + 1) / 2) * width
    tmp.copy(g.position).project(state.camera)
    sceneInput.clusterRadius = Math.abs(edge - ((tmp.x + 1) / 2) * width)
  })

  return (
    <group ref={group} position={position} scale={scale} rotation={[BASE_PITCH, 0.6, 0]}>
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
      <ClusterExtras colors={colors} levels={levels} still={still} mobile={mobile} sizeScale={pointScale} />
    </group>
  )
}
