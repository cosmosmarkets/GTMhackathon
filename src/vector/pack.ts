export function pack(z: number, x: number, y: number, size: number): Uint8Array {
  return new Uint8Array([z, x, y, size & 0xff])
}
