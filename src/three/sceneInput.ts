// Shared between the Hero (DOM events) and the scene (read every frame).
// A plain mutable object avoids React re-renders on pointer/scroll.
export const sceneInput = {
  pointer: { x: 0, y: 0 }, // -1..1, centre = 0
  scroll: 0, // 0 at top of hero → 1 when the hero has scrolled away
  // Drag rotation, in radians, while the visitor is turning the cloud.
  drag: { active: false, yaw: 0, pitch: 0 },
  // Written by the scene: each cluster's centre in hero-relative CSS pixels,
  // and roughly how far a cluster reaches on screen, for hover hit-testing.
  clusters: [] as { x: number; y: number }[],
  clusterRadius: 0,
}

// Scene colours mirror the CSS tokens so tokens.css stays the single source.
export const cssColor = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
