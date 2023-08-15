import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { areEqualImages, getSplitImages, getUniqueImages, getImage, getBufferImages, writeImages } from '../src/image'
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

describe('Test getImage()', () => {
  test('Correct local jpg', async () => {
    const [img, size] = await getImage(imgTest.img)
    expect(img.bitmap.width).toBe(imgTest.width)
    expect(img.bitmap.height).toBe(imgTest.height)
    expect(size.width).toBe(imgTest.width)
    expect(size.height).toBe(imgTest.height)
  })

  test('Incorrect local jpg', async () => {
    await expect(getImage(imgTest.imgBad)).rejects.toThrow(SpliteaError)
  })
})

describe('Test getSplitImages()', () => {
  test('Correct splits', async () => {
    const [img, size] = await getImage(imgTest.img)
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
    const [img, size] = await getImage(imgTest.img)
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

describe('Test getUniqueImages()', () => {
  test('Checking Equal Images', async () => {
    const [img, _] = await getImage(imgTest.img)
    const [imgSatie, __] = await getImage(imgTest.imgSatie)
    // Equals
    expect(areEqualImages(img, img)).toBeTruthy()
    expect(areEqualImages(imgSatie, imgSatie)).toBeTruthy()
    // Differents
    expect(areEqualImages(img, imgSatie)).toBeFalsy()
    expect(areEqualImages(imgSatie, img)).toBeFalsy()
  })

  test('Getting Unique Images', async () => {
    const [img1, _i1] = await getImage(imgTest.img)
    const [imgSatie1, _is1] = await getImage(imgTest.imgSatie)
    const uniques = getUniqueImages([img1, imgSatie1, img1, imgSatie1])
    expect(uniques.length).toBe(2)
    const i1 = uniques[0]
    const is1 = uniques[1]
    expect(areEqualImages(i1, img1)).toBeTruthy()
    expect(areEqualImages(is1, imgSatie1)).toBeTruthy()
  })
})

describe('Test writeImages()', () => {
  test(' checking writting', async () => {
    const image1 = imgTest.img
    const [jimp1, _size1] = await getImage(image1)
    
    const image2 = imgTest.imgSatie
    const [jimp2, _size2] = await getImage(image2)

    const data1 = { path: __dirname, name: 'test', extension: jimp1.getExtension() }

    const paths = await writeImages([jimp1, jimp2], data1.path, data1.name, data1.extension)
    paths.forEach(async (path) => {
      expect(() => fs.stat(path)).not.toThrowError()
      await fs.rm(path)
    })
  })
})

describe('Test getbufferImages()', () => {
  test('checking buffers', async () => {
    const image1 = imgTest.img
    const [jimp1, _size1] = await getImage(image1)
    
    const image2 = imgTest.imgSatie
    const [jimp2, _size2] = await getImage(image2)
    
    const buffers = await getBufferImages([jimp1, jimp2])
    
    buffers.forEach(async (buffer) => {
      expect(buffer).toBeInstanceOf(Buffer)
    })
    
    // const imageBuffer1 = await fs.readFile(image1)
    // expect(Buffer.compare(imageBuffer1, buffers[0])).toBe(0)
    // const imageBuffer2 = await fs.readFile(image2)
    // expect(Buffer.compare(imageBuffer2, buffers[1])).toBe(0)

  })
})