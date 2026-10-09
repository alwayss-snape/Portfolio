// Resolves a public/ path against the deploy base (VITE_BASE).
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
