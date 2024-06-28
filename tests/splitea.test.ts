import fs from 'node:fs'
import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { HorizontalOptions, VerticalOptions, verticalTiles, horizontalTiles, GridOptions, gridTiles } from '../src'
import { SpliteaError } from '../src/errors'

const IMG_FOLDER = path.join(__dirname)

const forest = {
  path: path.join(IMG_FOLDER, 'forestmap.png'),
  width: 320,
  height: 224,
  bad: path.join(IMG_FOLDER, 'forestmapp.png'),
}

const bad = {
  path: path.join(IMG_FOLDER, 'forestmapp.png'),
  width: 320,
  height: 224,
}

const satie = {
  path: path.join(IMG_FOLDER, 'Ericsatie.jpg'),
  width: 2651,
  height: 3711,
}

const chess = {
  path: path.join(IMG_FOLDER, 'chess.png'),
  width: 720,
  height: 720,
}

const horizontal = {
  path: path.join(IMG_FOLDER, 'chess_horizontal.png'),
  width: 720,
  height: 90,
}

const vertical = {
  path: path.join(IMG_FOLDER, 'chess_vertical.png'),
  width: 90,
  height: 720,
}

describe.concurrent('Horizontal', () => {

  test('Not unique tiles', async () => {
    const image = horizontal.path
    const options: HorizontalOptions = { columns: 8 }
    await expect(horizontalTiles(image, options)).resolves.toHaveLength(8)
    delete options.columns
    options.width = horizontal.width / 8
    await expect(horizontalTiles(image, options)).resolves.toHaveLength(8)
  })

  test('Unique tiles', async () => {
    const image = horizontal.path
    const options: HorizontalOptions = { columns: 8, unique: true }
    await expect(horizontalTiles(image, options)).resolves.toHaveLength(2)
    delete options.columns
    options.width = horizontal.width / 8
    await expect(horizontalTiles(image, options)).resolves.toHaveLength(2)
  })

  test('columns or width are not submultiple of image.width', async () => {
    const image = horizontal.path
    const options: HorizontalOptions = { columns: 7 }
    await expect(horizontalTiles(image, options)).rejects.toThrow(SpliteaError)
    delete options.columns
    options.width = 111
    await expect(horizontalTiles(image, options)).rejects.toThrow(SpliteaError)
  })

  test('store and return buffer', async () => {
    const image = horizontal.path
    const directory = path.join(__dirname, 'horizontal-test-buffer')
    // const filename = 'horizontalTest'
    const options: HorizontalOptions = { columns: 8, path: directory }
    const tiles = await horizontalTiles(image, options)
    expect(tiles).toHaveLength(8)
    expect(tiles[1]).toBeInstanceOf(Buffer)
    fs.rmSync(directory, { recursive: true })
  })

  test('store and return file', async () => {
    const image = horizontal.path
    const directory = path.join(__dirname, 'horizontal-test-file')
    const options: HorizontalOptions = { columns: 8, response: 'file', path: directory }
    const tiles = await horizontalTiles(image, options)
    expect(tiles).toHaveLength(8)
    tiles.forEach(tile => expect(fs.existsSync(tile)).toBeTruthy())
    fs.rmSync(directory, { recursive: true })
  })
})

describe.concurrent('Vertical', () => {

  test('Not unique tiles', async () => {
    const image = vertical.path
    const options: VerticalOptions = { rows: 8 }
    await expect(verticalTiles(image, options)).resolves.toHaveLength(8)
    delete options.rows
    options.height = vertical.height / 8
    await expect(verticalTiles(image, options)).resolves.toHaveLength(8)
  })

  test('Unique tiles', async () => {
    const image = vertical.path
    const options: VerticalOptions = { rows: 8, unique: true }
    await expect(verticalTiles(image, options)).resolves.toHaveLength(6)
    delete options.rows
    options.height = vertical.height / 8
    await expect(verticalTiles(image, options)).resolves.toHaveLength(6)
  })

  test('columns or width are not submultiple of image.width', async () => {
    const image = vertical.path
    const options: VerticalOptions = { rows: 7 }
    await expect(verticalTiles(image, options)).rejects.toThrow(SpliteaError)
    delete options.rows
    options.height = 111
    await expect(verticalTiles(image, options)).rejects.toThrow(SpliteaError)
  })

  test('store and return buffer', async () => {
    const image = vertical.path
    const directory = path.join(__dirname, 'vertical-test-buffer')
    // const filename = 'horizontalTest'
    const options: VerticalOptions = { rows: 8, path: directory }
    const tiles = await verticalTiles(image, options)
    expect(tiles).toHaveLength(8)
    expect(tiles[1]).toBeInstanceOf(Buffer)
    fs.rmSync(directory, { recursive: true })
  })

  test('store and return file', async () => {
    const image = vertical.path
    const directory = path.join(__dirname, 'vertical-test-file')
    const options: VerticalOptions = { rows: 8, response: 'file', path: directory }
    const tiles = await verticalTiles(image, options)
    expect(tiles).toHaveLength(8)
    tiles.forEach(tile => expect(fs.existsSync(tile)).toBeTruthy())
    fs.rmSync(directory, { recursive: true })
  })
})

describe.concurrent('Grid', { timeout: 50000 }, () => {

  test('Not unique tiles', async () => {
    const image = chess.path
    const options: GridOptions = { rows: 8, columns: 8 }
    await expect(gridTiles(image, options)).resolves.toHaveLength(8 * 8)
    delete options.rows
    delete options.columns
    options.width = horizontal.width / 8
    options.height = vertical.height / 8
    await expect(gridTiles(image, options)).resolves.toHaveLength(8 * 8)
  })

  test('Unique tiles', async () => {
    const image = chess.path
    const options: GridOptions = { rows: 8, columns: 8, unique: true }
    await expect(gridTiles(image, options)).resolves.toHaveLength(22)
    delete options.rows
    delete options.columns
    options.width = horizontal.width / 8
    options.height = vertical.height / 8
    await expect(gridTiles(image, options)).resolves.toHaveLength(22)
  })

  test('rows-columns or width-height are not submultiple of image.width-image.size', async () => {
    const image = chess.path
    const options: GridOptions = { rows: 7, columns: 8 }
    await expect(gridTiles(image, options)).rejects.toThrow(SpliteaError)
    options.rows = 8
    options.columns = 7
    await expect(gridTiles(image, options)).rejects.toThrow(SpliteaError)
    delete options.rows
    delete options.columns
    options.width = 21
    options.height = 20
    await expect(gridTiles(image, options)).rejects.toThrow(SpliteaError)
    options.width = 20
    options.height = 21
    await expect(gridTiles(image, options)).rejects.toThrow(SpliteaError)
  })

  test('store and return buffer', async () => {
    const image = chess.path
    const directory = path.join(__dirname, 'grid-test-buffer')
    // const filename = 'gridTest'
    const options: GridOptions = { rows: 8, columns: 8, path: directory }
    const tiles = await gridTiles(image, options)
    expect(tiles).toHaveLength(8 * 8)
    expect(tiles[1]).toBeInstanceOf(Buffer)
    fs.rmSync(directory, { recursive: true })
  })

  test('store and return file', async () => {
    const image = chess.path
    const directory = path.join(__dirname, 'grid-test-file')
    const options: GridOptions = { rows: 8, columns: 8, response: 'file', path: directory }
    const tiles = await gridTiles(image, options)
    expect(tiles).toHaveLength(8 * 8)
    tiles.forEach(tile => expect(fs.existsSync(tile)).toBeTruthy())
    fs.rmSync(directory, { recursive: true })
  })
})

