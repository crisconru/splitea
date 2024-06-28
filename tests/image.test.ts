import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { SpliteaError } from '../src/errors'
import { getBufferImages, getGridTiles, getHorizontalTiles, getImage, getSize, getUniqueGridTiles, getUniqueHorizontalTiles, getUniqueVerticalTiles, getVerticalTiles, writeImages } from '../src/image'
import { StoreOptions, UniqueImagesOptions } from '../src/types'
import { MAX_DIFFERENCE, MAX_DISTANCE } from '../src/constants'

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

describe.concurrent('Test getImage + getSize', () => {
  test('Correct local jpg', async () => {
    Promise.all([forest, satie, chess].map(async(img) => {
      const image = await getImage(img.path)
      const size = getSize(image)
      expect(size.width).toBe(img.width)
      expect(size.height).toBe(img.height)
    }))
  })

  test('Incorrect local jpg', async () => {
    await expect(getImage(bad.path)).rejects.toThrowError()
  })
})

test.concurrent('getHorizontalTiles', async () => {
  const img = await getImage(horizontal.path)
  const size = getSize(img)
  const width = size.width / 8
  const tiles = getHorizontalTiles(img, size, width)
  expect(tiles).toHaveLength(8)
})

test.concurrent('getUniqueHorizontalTiles', async () => {
  const img = await getImage(horizontal.path)
  const size = getSize(img)
  const width = size.width / 8
  const options: UniqueImagesOptions = {
    requirement: 'all',
    distance: MAX_DISTANCE,
    difference: MAX_DIFFERENCE
  }
  const tiles = getUniqueHorizontalTiles(img, size, width, options)
  // Promise.all(tiles.map(async (tile, idx) => {
  //   const extension = tile.getExtension()
  //   const filename = path.join(__dirname, `horizontal_${idx}.${extension}`)
  //   const buffer = await tile.getBufferAsync(tile.getMIME())
  //   fs.writeFileSync(filename, buffer)
  // }))
  expect(tiles).toHaveLength(2)
})

test.concurrent('getVerticalTiles', async () => {
  const img = await getImage(vertical.path)
  const size = getSize(img)
  const height = size.height / 8
  const tiles = getVerticalTiles(img, size, height)
  expect(tiles).toHaveLength(8)
})

test.concurrent('getUniqueVerticalTiles', async () => {
  const img = await getImage(vertical.path)
  const size = getSize(img)
  const height = size.height / 8
  const options: UniqueImagesOptions = {
    requirement: 'all',
    distance: MAX_DISTANCE,
    difference: MAX_DIFFERENCE
  }
  const tiles = getUniqueVerticalTiles(img, size, height, options)
  expect(tiles).toHaveLength(6)
})

test.concurrent('getGridTiles', async () => {
  const img = await getImage(chess.path)
  const size = getSize(img)
  const width = size.width / 8
  const height = size.height / 8
  const tiles = getGridTiles(img, size, width, height)
  expect(tiles).toHaveLength(8 * 8)
})

test.concurrent('getUniqueGridTiles', async () => {
  const img = await getImage(chess.path)
  const size = getSize(img)
  const width = size.width / 8
  const height = size.height / 8
  const options: UniqueImagesOptions = {
    requirement: 'all',
    distance: MAX_DISTANCE,
    difference: MAX_DIFFERENCE
  }
  const tiles = getUniqueGridTiles(img, size, width, height, options)
  // Promise.all(tiles.map(async (tile, idx) => {
  //   const extension = tile.getExtension()
  //   const filename = path.join(__dirname, `horizontal_${idx}.${extension}`)
  //   const buffer = await tile.getBufferAsync(tile.getMIME())
  //   fs.writeFileSync(filename, buffer)
  // }))
  expect(tiles).toHaveLength(22)
})

test.concurrent('writeImages', { timeout: 50000 }, async () => {
  const options: StoreOptions = {
    path: __dirname,
    filename: 'horizontal_test',
    extension: 'jpg'
  }
  await expect(writeImages([], options)).rejects.toThrow(SpliteaError)
  const [img1, img2, img3] = await Promise.all([getImage(chess.path), getImage(satie.path), getImage(forest.path)])
  await expect(writeImages([img1], options)).resolves.toHaveLength(1)
  await expect(writeImages([img1, img2, img3], options)).resolves.toHaveLength(3)
  fs.readdirSync(__dirname).forEach(item => {
    if (item.includes(options.filename)) {
      const file = path.join(__dirname, item)
      fs.rmSync(file)
    }
  } )
})

describe.concurrent('Test getBufferImages()', { timeout: 50000 }, () => {
  test('checking buffers', async () => {
    const image1 = forest.path
    const image2 = satie.path
    const [jimp1, jimp2] = await Promise.all([getImage(image1), getImage(image2)])
    const buffers = await getBufferImages([jimp1, jimp2])
    buffers.forEach(async (buffer) => {
      expect(buffer).toBeInstanceOf(Buffer)
    })
  })
})
