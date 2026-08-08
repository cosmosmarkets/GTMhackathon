export interface ObjectStore {
  get(key: string): Promise<Uint8Array | undefined>
  put(key: string, body: Uint8Array): Promise<void>
}
