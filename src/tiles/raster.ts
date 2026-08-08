export function rasterize(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height * 4)
}
