import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cssColor, sceneInput } from './sceneInput'

const RADIUS = 2.2
const TUBE = 0.05
const ARC = THREE.MathUtils.degToRad(25)
const BASE_YAW = THREE.MathUtils.degToRad(52) // seen at an angle, like the poster
const TILT = THREE.MathUtils.degToRad(-12)

type Props = { position: [number, number, number]; scale: number }

export default function Ring({ position, scale }: Props) {
  const group = useRef<THREE.Group>(null)
  const arc = useRef<THREE.Group>(null)
  const rust = useMemo(() => new THREE.Color(cssColor('--rust', '#a4492a')), [])
  const steel = useMemo(() => new THREE.Color(cssColor('--ink-2', '#3c463f')), [])

  const ringGeo = useMemo(() => new THREE.TorusGeometry(RADIUS, TUBE, 24, 256), [])
  const arcGeo = useMemo(() => new THREE.TorusGeometry(RADIUS, TUBE * 1.35, 16, 64, ARC), [])
  const glowGeo = useMemo(() => new THREE.TorusGeometry(RADIUS, TUBE * 2.2, 16, 64, ARC), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = group.current
    const a = arc.current
    if (!g || !a) return
    // Bob ±0.05 over a 6s period; scroll turns the ring a further 90° on Y.
    g.position.y = position[1] + Math.sin((t * Math.PI * 2) / 6) * 0.05
    const yaw = BASE_YAW + sceneInput.scroll * (Math.PI / 2)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 4, delta)
    // The current-cycle arc creeps around the ring, nudged by the pointer.
    a.rotation.z += delta * (0.12 + sceneInput.pointer.x * 0.08)
  })

  return (
    <group ref={group} position={position} scale={scale} rotation={[0, BASE_YAW, TILT]}>
      <mesh geometry={ringGeo}>
        <meshStandardMaterial color={steel} metalness={0.9} roughness={0.35} />
      </mesh>
      <group ref={arc}>
        <mesh geometry={arcGeo}>
          <meshStandardMaterial color={rust} emissive={rust} emissiveIntensity={1.5} metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Soft halo in place of a bloom pass. */}
        <mesh geometry={glowGeo}>
          <meshBasicMaterial
            color={rust}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}
