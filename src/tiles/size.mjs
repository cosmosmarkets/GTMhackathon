export const TILE_SIZE = 512

export function tilesAcross(zoom) {
  return 2 ** zoom
}
