import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cssColor } from './sceneInput'

const COUNT = 1500
const BOX = { x: 18, y: 12, zNear: 5, zFar: -6 }
const LENGTH = 0.22
const SLANT = 0.18 // horizontal drift per unit of fall

export default function Rain() {
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 6)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * BOX.x
      const y = (Math.random() - 0.5) * BOX.y
      const z = BOX.zFar + Math.random() * (BOX.zNear - BOX.zFar)
      positions.set([x, y, z, x + LENGTH * SLANT, y - LENGTH, z], i * 6)
      speeds[i] = 4 + Math.random() * 3
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, speeds }
  }, [])

  const color = useMemo(() => new THREE.Color(cssColor('--on-scene', '#f1f3ee')), [])

  useFrame((_, delta) => {
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute
    const p = attr.array as Float32Array
    const dt = Math.min(delta, 0.05)
    for (let i = 0; i < COUNT; i++) {
      const o = i * 6
      const dy = speeds[i] * dt
      p[o + 1] -= dy
      p[o + 4] -= dy
      p[o] += dy * SLANT
      p[o + 3] += dy * SLANT
      if (p[o + 4] < -BOX.y / 2) {
        const x = (Math.random() - 0.5) * BOX.x
        p[o] = x
        p[o + 3] = x + LENGTH * SLANT
        p[o + 1] = BOX.y / 2
        p[o + 4] = BOX.y / 2 - LENGTH
      }
    }
    attr.needsUpdate = true
  })

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
    </lineSegments>
  )
}
