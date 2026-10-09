// Personal projects — reserved for a later version. The nav item is hidden
// while this list is empty.

export type Project = {
  id: string
  title: string
  summary: string
  href?: string
  tags?: string[]
}

export const projects: Project[] = []
