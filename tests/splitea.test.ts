import fs from 'node:fs/promises'
import path from 'node:path'
import * as v from 'valibot'
import { describe, test, expect } from 'vitest'
import { Image } from '../src/types'
import { Splitea } from '../src'
import { OutputSchema, TilesSchema } from '../src/schemas'

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

describe('Splitea Grid', () => {
  const image: Image = chess.path
  const tiles = v.parse(TilesSchema, {
    mode: 'grid',
    rows: 8, columns: 8,
  })
  const store = {
    path: path.join(IMG_FOLDER, 'chessFolder'),
    name: 'chessTest',
  }
  const output = v.parse(OutputSchema, {})
  output.response = 'path'
  output.store = store

  test('chess grid', async () => {
    const imgs = await Splitea(image, tiles, output)
    const rows = tiles.rows as number
    const columns = tiles.columns as number
    expect(imgs).toHaveLength(rows * columns)
    await Promise.all(imgs.map(async (img) => {
      expect(() => fs.stat(img)).not.toThrowError()
      // await fs.rm(img)
    }))
    await fs.rm(store.path, {recursive: true})
  })

  test('chess grid unique', async () => {
    tiles.unique.enable = true
    const imgs = await Splitea(image, tiles, output)
    expect(imgs).toHaveLength(22)
    await Promise.all(imgs.map(async (img) => {
      expect(() => fs.stat(img)).not.toThrowError()
      await fs.rm(img)
    }))
    await fs.rm(store.path, {recursive: true})
  }, 100000)

  test('chess grid unique tunning requirement', async () => {
    tiles.unique.enable = true
    tiles.unique.difference = 0.15
    tiles.unique.distance = 0.15

    tiles.unique.requirement = 'both'
    let imgs = await Splitea(image, tiles, output)
    expect(imgs).toHaveLength(11)
    await Promise.all(imgs.map(async (img) => {
      expect(() => fs.stat(img)).not.toThrowError()
      await fs.rm(img)
    }))
    await fs.rm(store.path, {recursive: true})

    tiles.unique.requirement = 'one'
    imgs = await Splitea(image, tiles, output)
    expect(imgs).toHaveLength(3)
    await Promise.all(imgs.map(async (img) => {
      expect(() => fs.stat(img)).not.toThrowError()
      await fs.rm(img)
    }))
    await fs.rm(store.path, {recursive: true})
  }, 100000)
})
