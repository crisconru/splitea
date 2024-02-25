import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as v from 'valibot'
import { describe, test, expect } from 'vitest'
import { SpliteaError } from '../src/errors'
import { TileCoordinates } from '../src/types'
import { areEqualImages, getSplitImages, getUniqueImages, getImage, getBufferImages, writeImages } from '../src/image'
import { UniqueSchema } from '../src/schemas'

const IMG_FOLDER = path.join(__dirname)

const forest = {
  path: path.join(IMG_FOLDER, 'forestmap.png'),
  width: 320,
  height: 224,
  bad: path.join(IMG_FOLDER, 'forestmapp.png'),
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

describe('Test getImage()', () => {
  test('Correct local jpg', async () => {
    Promise.all([forest, satie, chess].map(async(img) => {
      const [_, size] = await getImage(img.path)
      expect(size.width).toBe(img.width)
      expect(size.height).toBe(img.height)
    }))
  })

  test('Incorrect local jpg', async () => {
    await expect(getImage(forest.bad)).rejects.toThrow(SpliteaError)
  })
})

describe('Test getSplitImages()', () => {
  const unique = v.parse(UniqueSchema, {})

  test('Correct splits', async () => {
    const [img, size] = await getImage(chess.path)
    const tile: TileCoordinates = { x: 0, y: 0, width: size.width, height: size.height }
    let tiles = [tile]
    let image = getSplitImages(img, size, tiles, unique)[0]
    expect(image.bitmap.width).toBe(tile.width)
    expect(image.bitmap.height).toBe(tile.height)
    tile.x = size.width / 2
    tile.width = size.width / 2
    tile.y = size.height / 2
    tile.height = size.height / 2
    tiles = [tile]
    image = getSplitImages(img, size, tiles, unique)[0]
    expect(image.bitmap.width).toBe(tile.width)
    expect(image.bitmap.height).toBe(tile.height)
  })

  test.skip('Incorrect splits', async () => {
    const [img, size] = await getImage(chess.path)
    const tile: TileCoordinates = { x: 1, y: 1, width: size.width, height: size.height }
    let tiles = [tile]
    expect(() => getSplitImages(img, size, tiles, unique)).toThrow(SpliteaError)
    tile.x = (size.width / 2) + 1
    tile.width = size.width / 2
    tile.y = size.height / 2
    tile.height = size.height / 2
    tiles = [tile]
    expect(() => getSplitImages(img, size, tiles, unique)).toThrow(SpliteaError)
    tile.x = size.width / 2
    // w = size.width / 2
    tile.y = (size.height / 2) + 1
    // h = size.height / 2
    tiles = [tile]
    expect(() => getSplitImages(img, size, tiles, unique)).toThrow(SpliteaError)
  })
})

describe('Test areEqualImages()', () => {
  const unique = v.parse(UniqueSchema, {})

  test('Checking Equal Images', async () => {
    const [ [img, _], [imgSatie, __] ] = await Promise.all([getImage(forest.path), getImage(satie.path)])
    // const [img, _] = await getImage(forest.path)
    // const [imgSatie, __] = await getImage(satie.path)
    // Equals
    expect(areEqualImages(img, img, unique)).toBeTruthy()
    expect(areEqualImages(imgSatie, imgSatie, unique)).toBeTruthy()
    // Differents
    expect(areEqualImages(img, imgSatie, unique)).toBeFalsy()
    expect(areEqualImages(imgSatie, img, unique)).toBeFalsy()
  })
})

describe('Test getUniqueImages()', () => {
  const unique = v.parse(UniqueSchema, { enable: true })

  test('Unique images', async () => {
    const [ [iforest, _i1], [imgSatie, _is1] ] = await Promise.all([getImage(forest.path), getImage(satie.path)])
    // const [iforest, _i1] = await getImage(forest.path)
    // const [imgSatie, _is1] = await getImage(satie.path)
    const load = [iforest, imgSatie, iforest, imgSatie]
    const images = getUniqueImages(load, unique)
    expect(images.length).toBe(2)
    const [if11, is11] = images
    expect(areEqualImages(if11, iforest, unique)).toBeTruthy()
    expect(areEqualImages(is11, imgSatie, unique)).toBeTruthy()
  })
})

describe('Test writeImages()', () => {
  test('checking writting', async () => {
    const image1 = forest.path
    const image2 = satie.path
    const [[jimp1, _size1], [jimp2, _size2]] = await Promise.all([getImage(image1), getImage(image2)])
    // const [jimp1, _size1] = await getImage(image1)
    // const [jimp2, _size2] = await getImage(image2)

    const data1 = { path: __dirname, name: 'test', extension: jimp1.getExtension() }

    const paths = await writeImages([jimp1, jimp2], data1.path, data1.name, data1.extension)
    paths.forEach(async (path) => {
      expect(() => fs.stat(path)).not.toThrowError()
      await fs.rm(path)
    })
  })
})

describe('Test getBufferImages()', () => {
  test('checking buffers', async () => {
    const image1 = forest.path
    const image2 = satie.path
    const [[jimp1, _size1], [jimp2, _size2]] = await Promise.all([getImage(image1), getImage(image2)])
    // const [jimp1, _size1] = await getImage(image1)
    // const [jimp2, _size2] = await getImage(image2)
    const buffers = await getBufferImages([jimp1, jimp2])
    buffers.forEach(async (buffer) => {
      expect(buffer).toBeInstanceOf(Buffer)
    })
  })
})