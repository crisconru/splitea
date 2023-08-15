import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { getImage } from '../../src/image'
import { getTiles } from '../../src/tiles'
import { Tiles } from '../../src/types'
const imgFolder = path.join(__dirname, '..')

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  imgBad: path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224,
  imgSatie: path.join(imgFolder, 'Ericsatie.jpg')
}

const tilesTest: Tiles = {
  mode: 'grid',
  rows: 0, columns: 0,
  width: 0, height: 0,
  unique: false
}
const tilesTestHorizontal: Tiles = { ...tilesTest, mode: 'horizontal' }
const tilesTestVertical: Tiles = { ...tilesTest, mode: 'vertical' }

describe('Get Horizontal Tiles', () => {
  test('Providing width', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTestHorizontal }
    tiles.width = 1
    expect(getTiles(img, size, tiles).length).toBe(size.width)
    tiles.width = size.width
    expect(getTiles(img, size, tiles).length).toBe(1)
    tiles.width = size.width / 2
    expect(getTiles(img, size, tiles).length).toBe(2)
  })

  test('Providing columns', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTestHorizontal }
    tiles.columns = 1
    expect(getTiles(img, size, tiles).length).toBe(tiles.columns)
    tiles.columns = 2
    expect(getTiles(img, size, tiles).length).toBe(tiles.columns)
    tiles.columns = size.width / 2
    expect(getTiles(img, size, tiles).length).toBe(tiles.columns)
  })
})

describe('Get Vertical Tiles', () => {
  test('Providing height', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTestVertical }
    tiles.height = 1
    expect(getTiles(img, size, tiles).length).toBe(size.height)
    tiles.height = size.height
    expect(getTiles(img, size, tiles).length).toBe(1)
    tiles.height = size.height / 2
    expect(getTiles(img, size, tiles).length).toBe(2)
  })

  test('Providing rows', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTestVertical }
    tiles.rows = 1
    expect(getTiles(img, size, tiles).length).toBe(tiles.rows)
    tiles.rows = 2
    expect(getTiles(img, size, tiles).length).toBe(tiles.rows)
    tiles.rows = size.width / 2
    expect(getTiles(img, size, tiles).length).toBe(tiles.rows)
  })
})

describe('Get Grid Tiles', () => {
  test('Providing width-height', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTest }
    tiles.width = size.width
    tiles.height = size.height
    let images = 1
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.width = size.width / 2
    tiles.height = size.height / 2
    images = 4
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.width = size.width
    tiles.height = size.height / 2
    images = 2
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.width = size.width / 2
    tiles.height = size.height
    // images = 2
    expect(getTiles(img, size, tiles).length).toBe(images)
  })

  test('Providing rows-columns', async () => {
    const [img, size] = await getImage(imgTest.img)
    const tiles: Tiles = { ...tilesTest }
    tiles.rows = 1
    tiles.columns = 1
    let images = 1
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.rows = 1
    tiles.columns = 2
    images = 2
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.rows = 2
    tiles.columns = 1
    // images = 2
    expect(getTiles(img, size, tiles).length).toBe(images)
    tiles.rows = 2
    tiles.columns = 2
    images = 4
    expect(getTiles(img, size, tiles).length).toBe(images)
  })
})
