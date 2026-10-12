import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPREAD, centres, flows, shapes } from './clusterLayout'

// Extras drawn inside the cloud's rotating group: a soft glow and a centroid
// marker per cluster, a confidence ellipsoid around the active cluster, and
// slow particles flowing between domains. All follow the cloud's per-cluster
// highlight levels, so they brighten and dim together.

export type Levels = { lit: THREE.Vector4; dim: number } // eased each frame by PointCloud

type Props = { colors: THREE.Color[]; levels: RefObject<Levels>; still: boolean; mobile: boolean }

const PICK = /* glsl */ `
  float levelOf(float idx, vec4 level) {
    vec4 pick = vec4(1.0) - step(vec4(0.5), abs(vec4(idx) - vec4(0.0, 1.0, 2.0, 3.0)));
    return dot(level, pick);
  }
`

export default function ClusterExtras(props: Props) {
  return (
    <>
      <Halos {...props} />
      <Centroids {...props} />
      <Ellipsoids {...props} />
      <Flows {...props} />
    </>
  )
}

// One attribute per cluster: its index (for the highlight level) and colour.
function useClusterAttrs(colors: THREE.Color[]) {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(centres.flatMap((c) => c.toArray())), 3))
    geo.setAttribute('aIndex', new THREE.BufferAttribute(new Float32Array([0, 1, 2, 3]), 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(colors.flatMap((c) => c.toArray())), 3))
    return geo
  }, [colors])
}

function useLevelUniforms() {
  return useMemo(() => ({ uLevel: { value: new THREE.Vector4() }, uDim: { value: 0 } }), [])
}

function syncLevels(material: THREE.ShaderMaterial | null, levels: Levels | null) {
  if (!material || !levels) return
  material.uniforms.uLevel.value.copy(levels.lit)
  material.uniforms.uDim.value = levels.dim
}

// A soft, tinted glow at each cluster's core.
function Halos({ colors, levels }: Props) {
  const geo = useClusterAttrs(colors)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useLevelUniforms()
  const size = useMemo(() => ({ uSize: { value: 520 * Math.min(window.devicePixelRatio, 2) } }), [])
  useEffect(() => () => geo.dispose(), [geo])
  useFrame(() => syncLevels(mat.current, levels.current))
  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={{ ...uniforms, ...size }}
        vertexShader={/* glsl */ `
          attribute float aIndex; attribute vec3 aColor;
          uniform vec4 uLevel; uniform float uDim; uniform float uSize;
          varying vec3 vColor; varying float vAlpha;
          ${PICK}
          void main() {
            float lv = levelOf(aIndex, uLevel);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = min(uSize * (1.0 + 0.3 * lv) / -mv.z, 500.0);
            vColor = aColor;
            vAlpha = (0.16 + 0.2 * lv) * (1.0 - uDim * (1.0 - lv) * 0.8);
          }`}
        fragmentShader={/* glsl */ `
          varying vec3 vColor; varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            gl_FragColor = vec4(vColor, pow(1.0 - d, 2.2) * vAlpha);
            #include <colorspace_fragment>
          }`}
      />
    </points>
  )
}

// A k-means-style centroid marker: a ring with a dot, fixed on-screen size.
function Centroids({ colors, levels, mobile }: Props) {
  const geo = useClusterAttrs(colors)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useLevelUniforms()
  const size = useMemo(() => ({ uPx: { value: (mobile ? 16 : 22) * Math.min(window.devicePixelRatio, 2) } }), [mobile])
  useEffect(() => () => geo.dispose(), [geo])
  useFrame(() => syncLevels(mat.current, levels.current))
  return (
    <points geometry={geo} renderOrder={2}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        depthTest={false}
        uniforms={{ ...uniforms, ...size }}
        vertexShader={/* glsl */ `
          attribute float aIndex; attribute vec3 aColor;
          uniform vec4 uLevel; uniform float uDim; uniform float uPx;
          varying vec3 vColor; varying float vAlpha;
          ${PICK}
          void main() {
            float lv = levelOf(aIndex, uLevel);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uPx * (1.0 + 0.25 * lv);
            vColor = aColor;
            vAlpha = 0.95 * (1.0 - uDim * (1.0 - lv) * 0.75);
          }`}
        fragmentShader={/* glsl */ `
          varying vec3 vColor; varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            float ring = smoothstep(0.62, 0.7, d) * (1.0 - smoothstep(0.86, 0.94, d));
            float dot = 1.0 - smoothstep(0.16, 0.24, d);
            float a = max(ring, dot);
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor * 0.85, a * vAlpha);
            #include <colorspace_fragment>
          }`}
      />
    </points>
  )
}

// A 2σ confidence ellipsoid (three orthogonal rings) around each cluster,
// visible only while that cluster is active.
function Ellipsoids({ colors, levels }: Props) {
  const ring = useMemo(() => {
    const pts = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(a), Math.sin(a), 0)
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  const mats = useMemo(
    () => colors.map((c) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false })),
    [colors],
  )
  useEffect(() => () => {
    ring.dispose()
    mats.forEach((m) => m.dispose())
  }, [ring, mats])
  useFrame(() => {
    const lv = levels.current?.lit
    if (!lv) return
    const vals = [lv.x, lv.y, lv.z, lv.w]
    mats.forEach((m, i) => (m.opacity = vals[i] * 0.7))
  })
  const turns: [number, number, number][] = [
    [0, 0, 0],
    [Math.PI / 2, 0, 0],
    [0, Math.PI / 2, 0],
  ]
  return (
    <>
      {centres.map((c, i) => (
        <group key={i} position={c} scale={shapes[i].map((s) => s * SPREAD * 2) as [number, number, number]}>
          {turns.map((r, j) => (
            <lineLoop key={j} geometry={ring} material={mats[i]} rotation={r} />
          ))}
        </group>
      ))}
    </>
  )
}

// Curved links between domains, with small particles travelling along them.
function Flows({ colors, levels, still, mobile }: Props) {
  const perEdge = mobile ? 3 : 6
  const curves = useMemo(
    () =>
      flows.map(([a, b]) => {
        const mid = centres[a].clone().add(centres[b]).multiplyScalar(0.5)
        // Bow each link outward a little, away from the cloud's centre.
        const bow = mid.clone().normalize().multiplyScalar(0.45)
        return new THREE.QuadraticBezierCurve3(centres[a], mid.add(bow), centres[b])
      }),
    [],
  )
  const lineGeos = useMemo(() => curves.map((c) => new THREE.BufferGeometry().setFromPoints(c.getPoints(48))), [curves])
  const lineMats = useMemo(
    () =>
      flows.map(([a, b]) => {
        const color = colors[a].clone().lerp(colors[b], 0.5)
        return new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false })
      }),
    [colors],
  )
  const lines = useMemo(() => lineGeos.map((g, e) => new THREE.Line(g, lineMats[e])), [lineGeos, lineMats])
  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const n = flows.length * perEdge
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    const col = new Float32Array(n * 3)
    flows.forEach(([a], e) => {
      for (let k = 0; k < perEdge; k++) col.set(colors[a].toArray(), (e * perEdge + k) * 3)
    })
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    return geo
  }, [colors, perEdge])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const pxSize = useMemo(() => ({ uPx: { value: (mobile ? 4 : 5) * Math.min(window.devicePixelRatio, 2) } }), [mobile])

  useEffect(() => () => {
    lineGeos.forEach((g) => g.dispose())
    lineMats.forEach((m) => m.dispose())
    particles.dispose()
  }, [lineGeos, lineMats, particles])

  useFrame((state) => {
    // Links touching the active cluster brighten; the others recede.
    const lv = levels.current?.lit
    if (lv) {
      const vals = [lv.x, lv.y, lv.z, lv.w]
      const active = vals.findIndex((v) => v > 0.5)
      lineMats.forEach((m, e) => {
        const [a, b] = flows[e]
        m.opacity = active < 0 ? 0.3 : a === active || b === active ? 0.55 : 0.1
      })
    }
    // Particles move slowly along each link; in reduced motion they rest evenly spaced.
    const t = still ? 0 : state.clock.elapsedTime
    const pos = particles.attributes.position as THREE.BufferAttribute
    curves.forEach((curve, e) => {
      for (let k = 0; k < perEdge; k++) {
        const u = (t * 0.06 + k / perEdge + e * 0.13) % 1
        curve.getPoint(u, tmp)
        pos.setXYZ(e * perEdge + k, tmp.x, tmp.y, tmp.z)
      }
    })
    pos.needsUpdate = true
  })

  return (
    <>
      {lines.map((l, e) => (
        <primitive key={e} object={l} />
      ))}
      <points geometry={particles} renderOrder={1}>
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={pxSize}
          vertexShader={/* glsl */ `
            attribute vec3 aColor; uniform float uPx; varying vec3 vColor;
            void main() {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = uPx;
              vColor = aColor;
            }`}
          fragmentShader={/* glsl */ `
            varying vec3 vColor;
            void main() {
              float d = length(gl_PointCoord - 0.5) * 2.0;
              if (d > 1.0) discard;
              gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.6, 1.0, d));
              #include <colorspace_fragment>
            }`}
        />
      </points>
    </>
  )
}

