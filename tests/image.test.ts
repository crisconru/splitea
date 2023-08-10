import path from 'node:path'
import { areEqualImages, getSplitImages, getUniqueImages, readImage } from '../src/image'
import { describe, test, expect } from 'vitest'
import { SpliteaError } from '../src/errors'
import { TileCoordinates } from '../src/types'

const imgFolder = path.join(__dirname)

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  imgBad: path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224,
  imgSatie: path.join(imgFolder, 'Ericsatie.jpg')
}

describe('read Image', () => {

  test('Correct local jpg', async () => {
    const [img, size] = await readImage(imgTest.img)
    expect(img.bitmap.width).toBe(imgTest.width)
    expect(img.bitmap.height).toBe(imgTest.height)
    expect(size.width).toBe(imgTest.width)
    expect(size.height).toBe(imgTest.height)
  })

  test('Incorrect local jpg', async () => {
    await expect(readImage(imgTest.imgBad)).rejects.toThrow(SpliteaError)
  })
})

describe('Get Split Image', () => {
  test('Correct splits', async () => {
    const [img, size] = await readImage(imgTest.img)
    const tile: TileCoordinates = { x: 0, y: 0, width: size.width, height: size.height }
    let newImage = getSplitImages(img, [tile])[0]
    expect(newImage.bitmap.width).toBe(tile.width)
    expect(newImage.bitmap.height).toBe(tile.height)
    tile.x = size.width / 2
    tile.width = size.width / 2
    tile.y = size.height / 2
    tile.height = size.height / 2
    newImage = getSplitImages(img, [tile])[0]
    expect(newImage.bitmap.width).toBe(tile.width)
    expect(newImage.bitmap.height).toBe(tile.height)
  })

  test('Incorrect splits', async () => {
    const [img, size] = await readImage(imgTest.img)
    const tile: TileCoordinates = { x: 1, y: 1, width: size.width, height: size.height }
    expect(() => getSplitImages(img, [tile])).toThrow(SpliteaError)
    tile.x = (size.width / 2) + 1
    tile.width = size.width / 2
    tile.y = size.height / 2
    tile.height = size.height / 2
    expect(() => getSplitImages(img, [tile])).toThrow(SpliteaError)
    tile.x = size.width / 2
    // w = size.width / 2
    tile.y = (size.height / 2) + 1
    // h = size.height / 2
    expect(() => getSplitImages(img, [tile])).toThrow(SpliteaError)
  })
})

describe('Unique tiles', () => {
  test('Test areEqualImages', async () => {
    const [img, _] = await readImage(imgTest.img)
    const [imgSatie, __] = await readImage(imgTest.imgSatie)
    // Equals
    expect(areEqualImages(img, img)).toBeTruthy()
    expect(areEqualImages(imgSatie, imgSatie)).toBeTruthy()
    // Differents
    expect(areEqualImages(img, imgSatie)).toBeFalsy()
    expect(areEqualImages(imgSatie, img)).toBeFalsy()
  })

  test('getUniqueImages', async () => {
    const [img1, _i1] = await readImage(imgTest.img)
    // const [img2, _i2] = await readImage(imgTest.img)
    const [imgSatie1, _is1] = await readImage(imgTest.imgSatie)
    // const [imgSatie2, _is2] = await readImage(imgTest.imgSatie)
    const uniques = getUniqueImages([img1, imgSatie1, img1, imgSatie1])
    // const uniques = getUniqueImages([img1, imgSatie1, img2, imgSatie2])
    expect(uniques.length).toBe(2)
    const i1 = uniques[0]
    const is1 = uniques[1]
    expect(areEqualImages(i1, img1)).toBeTruthy()
    expect(areEqualImages(is1, imgSatie1)).toBeTruthy()
  })
})