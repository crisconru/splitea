import { describe, test, expect } from 'vitest'
import {
  Size, SizeSchema,
  Tiles, TilesSchema,
  HorizontalTiles, HorizontalTilesSchema,
  VerticalTiles, VerticalTilesSchema,
  GridTiles, GridTilesSchema,
} from '../src/types'
import { MIN_DIFFERENCE, MIN_DISTANCE } from '../src/constants'

describe('Size', () => {
  test('test Size', () => {
    const size: Size = {} as Size
    expect(() => SizeSchema.parse(size)).toThrowError()
    size.width = -1
    size.height = 5.0
    expect(() => SizeSchema.parse(size)).toThrowError()
    size.width = 1.2
    expect(() => SizeSchema.parse(size)).toThrowError()
    size.width = 1
    expect(() => SizeSchema.parse(size)).not.toThrowError()
    expect(SizeSchema.parse(size)).toStrictEqual({ width: 1, height: 5})
  })
})

describe('Tiles', () => {
  const tilesModel: Tiles = {
    mode: 'horizontal',
    rows: 0, columns: 0,
    width: 0, height: 0,
    unique: {
      enable: false,
      distance: MIN_DISTANCE,
      difference: MIN_DIFFERENCE,
      requirement: 'both'
    }
  }
  const sizeModel: Size = { width: 20, height: 30 }

  test('test Tiles', () => {
    const tiles : Tiles = {} as Tiles
    let result = TilesSchema.safeParse(tiles)
    expect(result.success).toBeFalsy();
    ['horizontal', 'vertical', 'grid'].forEach(mode => {
      tiles.mode = mode
      result = TilesSchema.safeParse(tiles)
      const expected = { ...tilesModel, mode }
      expect(result.success).toBeTruthy()
      expect(result?.data).toStrictEqual(expected)
    });
  })
  
  test('test Horizontal', ()  => {
    const mode = 'horizontal'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    const horizontal: HorizontalTiles = {...tiles, size}
    // Empty columns width
    let result = HorizontalTilesSchema.safeParse(horizontal)
    expect(result.success).toBeFalsy()
    // Both columns width
    horizontal.columns = 1
    horizontal.width = 1
    result = HorizontalTilesSchema.safeParse(horizontal)
    expect(result.success).toBeFalsy()
    // Just columns
    horizontal.columns = 10
    horizontal.width = 0
    result = HorizontalTilesSchema.safeParse(horizontal)
    expect(result.success).toBeTruthy()
    // Just width
    horizontal.columns = 0
    horizontal.width = 5
    result = HorizontalTilesSchema.safeParse(horizontal)
    expect(result.success).toBeTruthy()
    // Does not mind rows and height
    horizontal.rows = 1
    horizontal.height = 1
    result = HorizontalTilesSchema.safeParse(horizontal)
    expect(result.success).toBeTruthy()    
  })
  
  test('test Vertical', ()  => {
    const mode = 'vertical'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    const vertical: VerticalTiles = {...tiles, size}
    // Empty rows height
    let result = VerticalTilesSchema.safeParse(vertical)
    expect(result.success).toBeFalsy()
    // Both rows height
    vertical.rows = 1
    vertical.height = 1
    result = VerticalTilesSchema.safeParse(vertical)
    expect(result.success).toBeFalsy()
    // Just rows
    vertical.rows = 10
    vertical.height = 0
    result = VerticalTilesSchema.safeParse(vertical)
    expect(result.success).toBeTruthy()
    // Just height
    vertical.rows = 0
    vertical.height = 5
    result = VerticalTilesSchema.safeParse(vertical)
    expect(result.success).toBeTruthy()
    // Does not mind columns and width
    vertical.columns = 1
    vertical.width = 1
    result = VerticalTilesSchema.safeParse(vertical)
    expect(result.success).toBeTruthy()    
  })
  
  test('test Grid', ()  => {
    const mode = 'grid'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    const grid: GridTiles = {...tiles, size}
    // Empty rows+columns + width+height
    let result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy()
    // Both rows+columns + width+height
    grid.rows = 1
    grid.columns = 1
    grid.width = 1
    grid.height = 1
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy()
    // Just rows+columns
    grid.rows = 10
    grid.columns = 5
    grid.width = 0
    grid.height = 0
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeTruthy()
    // Just width+height
    grid.rows = 0
    grid.columns = 0
    grid.width = 10
    grid.height = 5
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeTruthy()
    // Just rows+columns not width or height
    grid.rows = 10
    grid.columns = 5
    grid.width = 1
    grid.height = 0
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy()
    grid.width = 0
    grid.height = 1
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy()
    // Just width+height not rows or columns
    grid.width = 10
    grid.height = 5
    grid.rows = 1
    grid.columns = 0
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy() 
    grid.rows = 0
    grid.columns = 1
    result = GridTilesSchema.safeParse(grid)
    expect(result.success).toBeFalsy() 
  })
})