import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TILE_SIZE, tilesAcross } from '../src/tiles/size.mjs'

test('the tile size is the one every module reads', () => {
  assert.equal(TILE_SIZE, 512)
})

test('a zoom level is a square of tiles', () => {
  assert.equal(tilesAcross(3), 8)
})
