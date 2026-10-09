// Written by the Hero (DOM events), read every frame by the scene.
// A plain mutable object avoids React re-renders on pointer/scroll.
export const sceneInput = {
  pointer: { x: 0, y: 0 }, // -1..1, centre = 0
  scroll: 0, // 0 at top of hero → 1 when the hero has scrolled away
  autoDrift: false, // phones: no pointer parallax, slow drift instead
}

// Scene colours mirror the CSS tokens so tokens.css stays the single source.
export const cssColor = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
