import * as THREE from 'three'
import { cssColor } from './sceneInput'

// Shared geometry for the hero's point cloud and its extras (centroids,
// confidence ellipsoids, flows between domains). Cluster order matches the
// hero's focus areas: ml, agentic, data, mlops.

export const CLUSTERS = 4
export const SPREAD = 0.32 // base standard deviation of a cluster
export const RADIUS = 1.9 // how far cluster centres sit from the origin
export const BOX = 2.4 // half-size of the axis box and the noise volume

// Cluster centres spread evenly over a sphere (Fibonacci lattice).
export const centres = Array.from({ length: CLUSTERS }, (_, i) => {
  const y = 1 - ((i + 0.5) / CLUSTERS) * 2
  const r = Math.sqrt(1 - y * y)
  const theta = i * Math.PI * (3 - Math.sqrt(5))
  return new THREE.Vector3(Math.cos(theta) * r, y * 0.85, Math.sin(theta) * r).multiplyScalar(RADIUS)
})

// Each cluster is stretched differently, so its confidence ellipsoid is a
// real ellipsoid rather than a sphere.
export const shapes: [number, number, number][] = [
  [1.3, 0.8, 1.0],
  [0.85, 1.25, 0.9],
  [1.1, 0.85, 1.3],
  [0.9, 1.1, 0.8],
]

// How work flows between the domains: data feeds models, models ship
// through MLOps, and agents build on models. Pairs of cluster indices.
export const flows: [number, number][] = [
  [2, 0], // data engineering → machine learning
  [0, 3], // machine learning → MLOps
  [0, 1], // machine learning → agentic AI
  [1, 3], // agentic AI → MLOps
]

const CAT_TOKENS: [string, string][] = [
  ['--cat-ml', '#a4492a'],
  ['--cat-agentic', '#a8782a'],
  ['--cat-data', '#4f6b84'],
  ['--cat-mlops', '#3f6b4f'],
]

// The category colours from tokens.css, lifted a touch for the cloud so it
// reads as vivid while the page UI keeps the muted originals.
export const vividColors = () =>
  CAT_TOKENS.map(([name, fallback]) => new THREE.Color(cssColor(name, fallback)).offsetHSL(0, 0.12, 0.04))
