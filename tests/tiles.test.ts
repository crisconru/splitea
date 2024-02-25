import { describe, test, expect } from 'vitest'
import * as v from 'valibot'
import { Size,Tiles } from '../src/types'
import { getTilesCoordinates } from '../src/tiles'
import { TilesSchema } from '../src/schemas'

const forest = { width: 320, height: 224 }

const satie = { width: 2651, height: 3711 }

const chess = { width: 720, height: 720 }

const tilesTest: Tiles = v.parse(TilesSchema, { mode: 'grid' })

describe('Get Horizontal Tiles', () => {
  const tilesHorizontal: Tiles = { ...tilesTest, mode: 'horizontal' }

  test('Providing width', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesHorizontal }
    tiles.width = 360
    expect(getTilesCoordinates(size, tiles).length).toBe(size.width / tiles.width)
    tiles.width = size.width
    expect(getTilesCoordinates(size, tiles).length).toBe(size.width / tiles.width)
  })

  test('Providing columns', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesHorizontal }
    tiles.columns = 2
    expect(getTilesCoordinates(size, tiles).length).toBe(tiles.columns)
    tiles.columns = size.width / 2
    expect(getTilesCoordinates(size, tiles).length).toBe(tiles.columns)
  })
})

describe('Get Vertical Tiles', () => {
  const tilesVertical: Tiles = { ...tilesTest, mode: 'vertical' }

  test('Providing height', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesVertical }
    tiles.height = 360
    expect(getTilesCoordinates(size, tiles).length).toBe(size.height / tiles.height)
    tiles.height = size.height
    expect(getTilesCoordinates(size, tiles).length).toBe(size.height / tiles.height)
  })

  test('Providing rows', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesVertical }
    tiles.rows = 2
    let coordinates = getTilesCoordinates(size, tiles)
    expect(coordinates.length).toBe(tiles.rows)
    tiles.rows = size.height / 2
    expect(getTilesCoordinates(size, tiles).length).toBe(tiles.rows)
  })
})

describe('Get Grid Tiles', () => {
  const tilesGrid: Tiles = { ...tilesTest, mode: 'grid' }

  test('Providing width + height', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesGrid }
    tiles.width = 240
    tiles.height = 360
    let rows = size.height / tiles.height
    let columns = size.width / tiles.width
    expect(getTilesCoordinates(size, tiles).length).toBe(rows * columns)
    tiles.width = 360
    tiles.height = 240
    rows = size.height / tiles.height
    columns = size.width / tiles.width
    expect(getTilesCoordinates(size, tiles).length).toBe(rows * columns)
  })

  test('Providing rows + columns', async () => {
    const size: Size = { width: chess.width, height: chess.height }
    const tiles = { ...tilesGrid }
    tiles.rows = 3
    tiles.columns = 2
    let rows = tiles.rows
    let columns = tiles.columns
    expect(getTilesCoordinates(size, tiles).length).toBe(rows * columns)
    tiles.rows = 2
    tiles.columns = 3
    rows = tiles.rows
    columns = tiles.columns
    expect(getTilesCoordinates(size, tiles).length).toBe(rows * columns)
  })
})
