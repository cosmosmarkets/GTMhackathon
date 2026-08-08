import { pack } from '../vector/pack'
import { TILE_SIZE } from './size'

export function renderTile(z: number, x: number, y: number): Uint8Array {
  // TODO: the seam between raster and vector lives here.
  return pack(z, x, y, TILE_SIZE)
}
