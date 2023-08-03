import path from 'path'
import { areEqualImages, getGridTiles, getHorizontalTiles, getSplitImage, getTiles, getVerticalTiles, readImage, uniqueTiles } from '../src/splitea'
import { SpliteaError } from '../src/errors'
import { Tiles } from '../src/types'
import { Mode } from '../src/enums'
// import Jimp from 'jimp/*'
import { describe, test, expect } from 'vitest'

const imgFolder = path.join(__dirname, '..', 'examples')

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  imgBad: path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224,
  imgSatie: path.join(imgFolder, 'Ericsatie.jpg')
}

describe('Test Splitea Module', () => {
  describe('Read Image', () => {
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
    test('Correct splites', async () => {
      const [img, size] = await readImage(imgTest.img)
      let { x, y, w, h } = { x: 0, y: 0, w: size.width, h: size.height }
      let newImage = getSplitImage(img, x, y, w, h)
      expect(newImage.bitmap.width).toBe(w)
      expect(newImage.bitmap.height).toBe(h)
      x = size.width / 2
      w = size.width / 2
      y = size.height / 2
      h = size.height / 2
      newImage = getSplitImage(img, x, y, w, h)
      expect(newImage.bitmap.width).toBe(w)
      expect(newImage.bitmap.height).toBe(h)
    })

    test('Incorrect splites', async () => {
      const [img, size] = await readImage(imgTest.img)
      let { x, y, w, h } = { x: 1, y: 1, w: size.width, h: size.height }
      expect(() => getSplitImage(img, x, y, w, h)).toThrow(SpliteaError)
      x = (size.width / 2) + 1
      w = size.width / 2
      y = size.height / 2
      h = size.height / 2
      expect(() => getSplitImage(img, x, y, w, h)).toThrow(SpliteaError)
      x = size.width / 2
      // w = size.width / 2
      y = (size.height / 2) + 1
      // h = size.height / 2
      expect(() => getSplitImage(img, x, y, w, h)).toThrow(SpliteaError)
    })
  })

  describe('Get Horizontal Tiles', () => {
    test('Providing width & columns', async () => {
      const [img, size] = await readImage(imgTest.img)
      const width = 1
      const columns = 1
      expect(() => getHorizontalTiles(img, size, width, columns)).toThrow(SpliteaError)
    })

    test('Providing width', async () => {
      const [img, size] = await readImage(imgTest.img)
      let width = 1
      const columns = 0
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(size.width)
      width = size.width
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(1)
      width = size.width / 2
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(2)
    })

    test('Providing columns', async () => {
      const [img, size] = await readImage(imgTest.img)
      const width = 0
      let columns = 1
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(columns)
      columns = 2
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(columns)
      columns = size.width / 2
      expect(getHorizontalTiles(img, size, width, columns).length).toBe(columns)
    })
  })

  describe('Get Vertical Tiles', () => {
    test('Providing height & rows', async () => {
      const [img, size] = await readImage(imgTest.img)
      const height = 1
      const rows = 1
      expect(() => getVerticalTiles(img, size, height, rows)).toThrow(SpliteaError)
    })

    test('Providing height', async () => {
      const [img, size] = await readImage(imgTest.img)
      let height = 1
      const rows = 0
      expect(getVerticalTiles(img, size, height, rows).length).toBe(size.height)
      height = size.height
      expect(getVerticalTiles(img, size, height, rows).length).toBe(1)
      height = size.height / 2
      expect(getVerticalTiles(img, size, height, rows).length).toBe(2)
    })

    test('Providing rows', async () => {
      const [img, size] = await readImage(imgTest.img)
      const height = 0
      let rows = 1
      expect(getVerticalTiles(img, size, height, rows).length).toBe(rows)
      rows = 2
      expect(getVerticalTiles(img, size, height, rows).length).toBe(rows)
      rows = size.width / 2
      expect(getVerticalTiles(img, size, height, rows).length).toBe(rows)
    })
  })

  describe('Get Grid Tiles', () => {
    test('Providing invalid width-height and rows-columns', async () => {
      const [img, size] = await readImage(imgTest.img)
      let width = 1
      let height = 1
      let rows = 1
      let columns = 1
      let error = new SpliteaError('It needs to provide "rows & columns" or "width & height" but not both of them')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 1
      height = 0
      rows = 0
      columns = 1
      error = new SpliteaError('It needs to provide "columns" or "width" but not both of them')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 0
      height = 1
      rows = 1
      columns = 0
      error = new SpliteaError('It needs to provide "rows" or "height" but not both of them')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 0
      height = 1
      rows = 0
      columns = 0
      error = new SpliteaError('Missing "width"')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 1
      height = 0
      rows = 0
      columns = 0
      error = new SpliteaError('Missing "height"')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 0
      height = 0
      rows = 0
      columns = 1
      error = new SpliteaError('Missing "rows"')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
      width = 0
      height = 0
      rows = 1
      columns = 0
      error = new SpliteaError('Missing "columns"')
      expect(() => getGridTiles(img, size, width, height, rows, columns)).toThrow(error)
    })

    test('Providing width-height', async () => {
      const [img, size] = await readImage(imgTest.img)
      const rows = 0
      const columns = 0
      let width = size.width
      let height = size.height
      let images = 1
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      width = size.width / 2
      height = size.height / 2
      images = 4
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      width = size.width
      height = size.height / 2
      images = 2
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      width = size.width / 2
      height = size.height
      // images = 2
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
    })

    test('Providing rows-columns', async () => {
      const [img, size] = await readImage(imgTest.img)
      const width = 0
      const height = 0
      let columns = 1
      let rows = 1
      let images = 1
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      columns = 2
      // rows = 1
      images = 2
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      columns = 1
      rows = 2
      // images = 2
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
      columns = 2
      // rows = 2
      images = 4
      expect(getGridTiles(img, size, width, height, rows, columns).length).toBe(images)
    })
  })

  describe('Get Tiles', () => {
    // test('Invalid mode', async () => {
    //   const [img, size] = await readImage(imgTest.img)
    //   const tiles = { mode: undefined }
    //   let error = new SpliteaError('No mode defined')
    //   expect(() => getTiles(img, size, tiles)).toThrow(error)
    //   tiles.mode = null
    //   error = new SpliteaError('Invalid mode')
    //   expect(() => getTiles(img, size, tiles)).toThrow(error)
    //   tiles.mode = 'jrid'
    //   expect(() => getTiles(img, size, tiles)).toThrow(error)
    // })

    test('Mode Horizontal', async () => {
      const [img, size] = await readImage(imgTest.img)
      const tiles: Tiles = { mode: Mode.Horizontal }
      expect(() => getTiles(img, size, tiles)).toThrow(SpliteaError)
      tiles.columns = 4
      expect(getTiles(img, size, tiles).length).toBe(tiles.columns)
      tiles.columns = undefined
      tiles.width = size.width / 2
      expect(getTiles(img, size, tiles).length).toBe(2)
    })

    test('Mode Vertical', async () => {
      const [img, size] = await readImage(imgTest.img)
      const tiles: Tiles = { mode: Mode.Vertical }
      expect(() => getTiles(img, size, tiles)).toThrow(SpliteaError)
      tiles.rows = 4
      expect(getTiles(img, size, tiles).length).toBe(tiles.rows)
      tiles.rows = undefined
      tiles.height = size.height / 2
      expect(getTiles(img, size, tiles).length).toBe(2)
    })

    test('Mode Grid', async () => {
      const [img, size] = await readImage(imgTest.img)
      const tiles: Tiles = { mode: Mode.Grid }
      expect(() => getTiles(img, size, tiles)).toThrow(SpliteaError)
      tiles.rows = 4
      tiles.columns = 2
      expect(getTiles(img, size, tiles).length).toBe(tiles.rows * tiles.columns)
      tiles.rows = undefined
      tiles.columns = undefined
      tiles.width = size.width / 2
      tiles.height = size.height / 2
      expect(getTiles(img, size, tiles).length).toBe(4)
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

    test('uniqueTiles', async () => {
      const [img1, _i1] = await readImage(imgTest.img)
      const [img2, _i2] = await readImage(imgTest.img)
      const [imgSatie1, _is1] = await readImage(imgTest.imgSatie)
      const [imgSatie2, _is2] = await readImage(imgTest.imgSatie)
      const uniques = uniqueTiles([img1, imgSatie1, img2, imgSatie2])
      expect(uniques.length).toBe(2)
      const i1 = uniques[0]
      const is1 = uniques[1]
      expect(areEqualImages(i1, img1)).toBeTruthy()
      expect(areEqualImages(is1, imgSatie1)).toBeTruthy()
    })
  })
})
