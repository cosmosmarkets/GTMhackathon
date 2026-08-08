export function etag(z: number, x: number, y: number): string {
  return `W/"${z}-${x}-${y}`
}
