import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderTile } from '../src/tiles/render'

test('a tile packs its coords', () => {
  assert.equal(renderTile(1, 2, 3).length, 4)
})
