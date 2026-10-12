// The page's content column, shared by the DOM (Container, Nav, Hero) and the
// 3D scene, which places the point cloud inside the same column.
// Keep in step with the Tailwind classes in Container.tsx.

export const PAGE_MAX = 1680 // max-w-[1680px]
export const SIDE_BY_SIDE = 1024 // lg: hero text and cloud share a row from here up

// Horizontal padding at each breakpoint: px-4 sm:px-8 lg:px-16 2xl:px-20.
export const pagePadding = (width: number) => (width >= 1536 ? 80 : width >= 1024 ? 64 : width >= 640 ? 32 : 16)
