import { rmdirSync, existsSync } from 'node:fs'
import * as v from 'valibot'
import { describe, test, expect } from 'vitest'
import { Size, Tiles, Output, TilesCut } from '../src/types'
import { MAX_DIFFERENCE, MAX_DISTANCE, MODES } from '../src/constants'
import { GridTilesSchema, HorizontalTilesSchema, OutputSchema, SizeSchema, TilesCutSchema, TilesSchema, VerticalTilesSchema } from '../src/schemas'

describe('Size', () => {
  test('test Size', () => {
    const size: Size = {} as Size
    expect(() => v.parse(SizeSchema, size)).toThrowError()
    size.width = -1
    size.height = 5.0
    expect(() => v.parse(SizeSchema, size)).toThrowError()
    size.width = 1.2
    expect(() => v.parse(SizeSchema, size)).toThrowError()
    size.width = 1
    expect(() => v.parse(SizeSchema, size)).not.toThrowError()
    expect(v.parse(SizeSchema, size)).toStrictEqual({ width: 1, height: 5})
  })
})

describe('Tiles', () => {
  const tilesModel: Tiles = {
    mode: 'horizontal',
    rows: 0, columns: 0,
    width: 0, height: 0,
    unique: {
      enable: false,
      distance: MAX_DISTANCE,
      difference: MAX_DIFFERENCE,
      requirement: 'both'
    }
  }
  const sizeModel: Size = { width: 20, height: 30 }

  test('test Tiles', () => {
    const tiles : Tiles = {} as Tiles
    let result = v.safeParse(TilesSchema, tiles)
    expect(result.success).toBeFalsy();
    ['horizontal', 'vertical', 'grid'].forEach(mode => {
      tiles.mode = mode as typeof MODES[number]
      result = v.safeParse(TilesSchema, tiles)
      const expected = { ...tilesModel, mode }
      expect(result.success).toBeTruthy()
      if (result.success)
        expect(expected).toMatchObject(result.output)
    });
  })
  
  test('test Horizontal', ()  => {
    const mode = 'horizontal'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    // const horizontal: HorizontalTiles = {...tiles, size}
    const horizontal = {...tiles, size}
    // Empty columns width
    let result = v.safeParse(HorizontalTilesSchema, horizontal)
    expect(result.success).toBeFalsy()
    // Both columns width
    horizontal.columns = 1
    horizontal.width = 1
    result = v.safeParse(HorizontalTilesSchema, horizontal)
    expect(result.success).toBeFalsy()
    // Just columns
    horizontal.columns = 10
    horizontal.width = 0
    result = v.safeParse(HorizontalTilesSchema, horizontal)
    expect(result.success).toBeTruthy()
    // Just width
    horizontal.columns = 0
    horizontal.width = 5
    result = v.safeParse(HorizontalTilesSchema, horizontal)
    expect(result.success).toBeTruthy()
    // Does not mind rows and height
    horizontal.rows = 1
    horizontal.height = 1
    result = v.safeParse(HorizontalTilesSchema, horizontal)
    expect(result.success).toBeTruthy()    
  })
  
  test('test Vertical', ()  => {
    const mode = 'vertical'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    // const vertical: VerticalTiles = {...tiles, size}
    const vertical = {...tiles, size}
    // Empty rows height
    let result = v.safeParse(VerticalTilesSchema, vertical)
    expect(result.success).toBeFalsy()
    // Both rows height
    vertical.rows = 1
    vertical.height = 1
    result = v.safeParse(VerticalTilesSchema, vertical)
    expect(result.success).toBeFalsy()
    // Just rows
    vertical.rows = 10
    vertical.height = 0
    result = v.safeParse(VerticalTilesSchema, vertical)
    expect(result.success).toBeTruthy()
    // Just height
    vertical.rows = 0
    vertical.height = 5
    result = v.safeParse(VerticalTilesSchema, vertical)
    expect(result.success).toBeTruthy()
    // Does not mind columns and width
    vertical.columns = 1
    vertical.width = 1
    result = v.safeParse(VerticalTilesSchema, vertical)
    expect(result.success).toBeTruthy()    
  })
  
  test('test Grid', ()  => {
    const mode = 'grid'
    const size = {...sizeModel }
    const tiles: Tiles = { mode } as Tiles
    // const grid: GridTiles = {...tiles, size}
    const grid = {...tiles, size}
    // Empty rows+columns + width+height
    let result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy()
    // Both rows+columns + width+height
    grid.rows = 1
    grid.columns = 1
    grid.width = 1
    grid.height = 1
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy()
    // Just rows+columns
    grid.rows = 10
    grid.columns = 5
    grid.width = 0
    grid.height = 0
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeTruthy()
    // Just width+height
    grid.rows = 0
    grid.columns = 0
    grid.width = 10
    grid.height = 5
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeTruthy()
    // Just rows+columns not width or height
    grid.rows = 10
    grid.columns = 5
    grid.width = 1
    grid.height = 0
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy()
    grid.width = 0
    grid.height = 1
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy()
    // Just width+height not rows or columns
    grid.width = 10
    grid.height = 5
    grid.rows = 1
    grid.columns = 0
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy() 
    grid.rows = 0
    grid.columns = 1
    result = v.safeParse(GridTilesSchema, grid)
    expect(result.success).toBeFalsy() 
  })
})

describe('Tiles Cut', () => {
  test('test Tiles Cut', () => {
    const tilesCut: TilesCut = {} as TilesCut
    // Empty
    let result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    tilesCut.imageWidth = 20
    tilesCut.imageHeight = 30
    tilesCut.tileWidth = 2
    tilesCut.tileHeight = 3
    // Correct
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeTruthy()
    // Bigger than limits
    tilesCut.tileWidth = tilesCut.imageWidth + 1
    tilesCut.tileHeight = 10
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    tilesCut.tileWidth = 10
    tilesCut.tileHeight = tilesCut.imageHeight + 1
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    // Not submultiples
    tilesCut.tileWidth = 0
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    tilesCut.tileWidth = 3
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    tilesCut.tileWidth = 10
    tilesCut.tileHeight = 0
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
    tilesCut.tileHeight = 9
    result = v.safeParse(TilesCutSchema, tilesCut)
    expect(result.success).toBeFalsy()
  })
})

describe('Output', () => {
  test('Response empty', () => {
    const output: Output = {} as Output
    // Empty => buffer response
    let result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()
    if (result.success)
      expect(result.output.response).toStrictEqual('buffer')
  })

  test('Response buffer', () => {
    const output: Output = { response: 'buffer'} as Output
    let result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()
    if (result.success)
      expect(result.output.response).toStrictEqual('buffer')
    // Add store
    output.store = { path: './', name: 'store' }
    result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()

    output.store.path = 'storeTest'
    result = v.safeParse(OutputSchema, output)
    rmdirSync(output.store.path, { recursive: true })
    expect(result.success).toBeTruthy()
  })

  test('Response path', () => {
    const output: Output = { response: 'path' } as Output
    // Response = path No store
    let result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeFalsy()
    // Response = path + Store
    output.store = { path: './', name: 'store' }
    result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()

    output.store.path = 'storeTest'
    result = v.safeParse(OutputSchema, output)
    rmdirSync(output.store.path)
    expect(result.success).toBeTruthy()
  })

  test('Invalid paths - filenames', () => {
    const response = 'path'
    const store = { path: './', name: 'storeTest' }
    let output = v.parse(OutputSchema, { response, store })
    let result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()
    // Invalid filenames
    const invalidFiles = ['foo/bar', 'foo\u0000bar', 'foo\u001Fbar', 'foo*bar', 'foo:bar', 'AUX', 'com1', 'foo\\bar']
    invalidFiles.forEach(pattern => {
      store.name = pattern
      output = { response, store }
      result = v.safeParse(OutputSchema, output)
      expect(result.success).toBeFalsy()
    })
    // Invalid paths
    const invalidPaths = ['foo/bar', 'foo\u0000bar', 'foo\u001Fbar', 'foo*bar', 'foo:bar', 'AUX', 'com1', 'foo\\bar']
    invalidPaths.forEach(pattern => {
      store.path = pattern
      output = { response, store }
      result = v.safeParse(OutputSchema, output)
      if (existsSync(store.path)) {
        rmdirSync(store.path, {recursive: true})
      }
      expect(result.success).toBeFalsy()
    })
  })

  test('Valid paths - filenames', () => {
    const response = 'path'
    const store = { path: 'storePath', name: 'storeFile' }
    let output = v.parse(OutputSchema, { response, store })
    let result = v.safeParse(OutputSchema, output)
    expect(result.success).toBeTruthy()
    rmdirSync(store.path, { recursive: true })
    // Valid filenames
    const validFiles = ['foo-bar', 'hola.txt']
    validFiles.forEach(pattern => {
      store.name = pattern
      output = { response, store }
      result = v.safeParse(OutputSchema, output)
      expect(result.success).toBeTruthy()
    })
    rmdirSync(store.path)
    // Valid filenames
    const validPaths = ['foo-bar', 'helloWorld']
    validPaths.forEach(pattern => {
      store.path = pattern
      output = { response, store }
      result = v.safeParse(OutputSchema, output)
      expect(result.success).toBeTruthy()
      rmdirSync(store.path, {recursive: true})
    })
  })
})