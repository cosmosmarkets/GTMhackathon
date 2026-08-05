export function parseCoords(url: string): { z: number; x: number; y: number } {
  const [z, x, y] = new URL(url).pathname.split('/').slice(-3).map(Number)
  return { z: z ?? 0, x: x ?? 0, y: y ?? 0 }
}

export const MAX_ZOOM = 22
