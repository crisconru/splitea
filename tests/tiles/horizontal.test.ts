import { describe, test, expect } from 'vitest'
import { HorizontalTiles, Size } from '../../src/types'
import { SpliteaError } from '../../src/errors'
import { checkHorizontalTiles } from '../../src/tiles/horizontal'

describe('checkHorizontalTiles', () => {
  const size: Size = { width: 10, height: 15 }
  const tiles: HorizontalTiles = {} as HorizontalTiles
  test('No columns nor width', () => {
    tiles.columns = 0
    tiles.width = 0
    expect(() => checkHorizontalTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('No columns and width', () => {
    tiles.columns = 3
    tiles.width = 4
    expect(() => checkHorizontalTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Invalid columns', () => {
    tiles.columns = 3
    tiles.width = 0
    expect(() => checkHorizontalTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Valid columns', () => {
    tiles.columns = 2
    tiles.width = 0
    expect(() => checkHorizontalTiles(tiles, size)).not.toThrowError(SpliteaError)
  })
  test('Invalid width', () => {
    tiles.columns = 0
    tiles.width = 4
    expect(() => checkHorizontalTiles(tiles, size)).toThrowError(SpliteaError)
  })
  test('Valid width', () => {
    tiles.columns = 0
    tiles.width = 5
    expect(() => checkHorizontalTiles(tiles, size)).not.toThrowError(SpliteaError)
  })
})
