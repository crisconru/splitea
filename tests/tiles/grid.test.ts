import { describe, test, expect } from 'vitest'
import { GridTiles, Size } from '../../src/types'
import { SpliteaError } from '../../src/errors'
import { checkGridTiles } from '../../src/tiles/grid'

describe('checkGridTiles', () => {
  const size: Size = { width: 10, height: 15 }
  const tiles: GridTiles = {} as GridTiles
  test('No rows nor columns nor width, height', () => {
    tiles.rows = 0
    tiles.columns = 0
    tiles.width = 0
    tiles.height = 0
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Just rows + columns -> width and height must be 0', () => {
    tiles.rows = 1
    tiles.columns = 1
    tiles.width = 0
    tiles.height = 1
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 1
    tiles.columns = 1
    tiles.width = 1
    tiles.height = 0
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Just width + height -> rows and columns must be 0', () => {
    tiles.rows = 1
    tiles.columns = 0
    tiles.width = 1
    tiles.height = 1
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 0
    tiles.columns = 1
    tiles.width = 1
    tiles.height = 1
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Just rows + columns -> must be submultiple of height + width', () => {
    tiles.rows = 3
    tiles.columns = 3
    tiles.width = 0
    tiles.height = 0
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 2
    tiles.columns = 3
    tiles.width = 0
    tiles.height = 0
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 3
    tiles.columns = 2
    tiles.width = 0
    tiles.height = 0
    expect(() => checkGridTiles(tiles, size)).not.toThrowError(SpliteaError)
  })
  test('Just width + height -> must be submultiple of width + height', () => {
    tiles.rows = 0
    tiles.columns = 0
    tiles.width = 3
    tiles.height = 3
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 0
    tiles.columns = 0
    tiles.width = 2
    tiles.height = 2
    expect(() => checkGridTiles(tiles, size)).toThrowError(SpliteaError)
    tiles.rows = 0
    tiles.columns = 0
    tiles.width = 2
    tiles.height = 3
    expect(() => checkGridTiles(tiles, size)).not.toThrowError(SpliteaError)
  })
})
