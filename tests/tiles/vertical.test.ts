import { describe, test, expect } from 'vitest'
import { Size, VerticalTiles } from '../../src/types'
import { SpliteaError } from '../../src/errors'
import { checkVerticalTiles } from '../../src/tiles/vertical'

describe('Vertical tiles', () => {
  test('checkVerticalTiles', () => {
    const size: Size = { width: 10, height: 15 }
    const tiles: VerticalTiles = {} as VerticalTiles
    // Not data
    tiles.rows = 0
    tiles.height = 0
    expect(() => checkVerticalTiles(tiles, size)).toThrowError(SpliteaError)
    // Not both data
    tiles.rows = 3
    tiles.height = 5
    expect(() => checkVerticalTiles(tiles, size)).toThrowError(SpliteaError)
    // Invalid rows
    tiles.rows = 2
    tiles.height = 0
    expect(() => checkVerticalTiles(tiles, size)).toThrowError(SpliteaError)
    // Valid rows
    tiles.rows = 3
    tiles.height = 0
    expect(() => checkVerticalTiles(tiles, size)).not.toThrowError(SpliteaError)
    // Invalid height
    tiles.rows = 0
    tiles.height = 4
    expect(() => checkVerticalTiles(tiles, size)).toThrowError(SpliteaError)
    // Valid rows
    tiles.rows = 0
    tiles.height = 5
    expect(() => checkVerticalTiles(tiles, size)).not.toThrowError(SpliteaError)
  })
})