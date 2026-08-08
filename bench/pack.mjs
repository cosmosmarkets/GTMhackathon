import { pack } from '../src/vector/pack.ts'

console.time('pack')
for (let i = 0; i < 1e5; i += 1) pack(12, i, i, 256)
console.timeEnd('pack')
