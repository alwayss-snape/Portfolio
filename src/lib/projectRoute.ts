import { useEffect, useState } from 'react'
import { categories, type Category } from '../content/projects'

// Hash links for the Projects section, without a router:
//   #projects            the section, no filter
//   #projects/<category> the section, filtered (e.g. #projects/ml)
//   #project/<id>        one project open in the detail view

export type ProjectRoute = { filter: Category | null; open: string | null; inProjects: boolean }

const isCategory = (v: string): v is Category => categories.some((c) => c.id === v)

export function parseProjectHash(hash: string): ProjectRoute {
  const [head, arg = ''] = hash.replace(/^#/, '').split('/')
  if (head === 'project' && arg) return { filter: null, open: arg, inProjects: true }
  if (head === 'projects') return { filter: isCategory(arg) ? arg : null, open: null, inProjects: true }
  return { filter: null, open: null, inProjects: false }
}

export const projectsHref = (filter: Category | null) => (filter ? `#projects/${filter}` : '#projects')
export const projectHref = (id: string) => `#project/${id}`

// Setting the same hash fires no event, so re-announce it: a second click on
// the same cluster or focus area still scrolls to the projects.
export function goTo(hash: string) {
  if (window.location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else window.location.hash = hash
}

export function useProjectRoute() {
  const [route, setRoute] = useState(() => parseProjectHash(window.location.hash))
  useEffect(() => {
    const onHash = () => setRoute(parseProjectHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}
