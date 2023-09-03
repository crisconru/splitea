import { rmSync } from 'node:fs'
import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { getOutput } from '../src/output'
import { Output, OutputSchema } from '../src/types'
import { getImage } from '../src/image'

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

describe('getOutput', async () => {
  const images = await Promise.all([
    getImage(forest.path),
    getImage(satie.path),
    getImage(chess.path)
  ]).then(response => [response[0][0], response[1][0], response[2][0]])
  const output: Output = OutputSchema.parse({})

  test('response = "buffer", store = undefined', async () => {
    const buffers = await getOutput(images, output)
    expect(buffers).toHaveLength(images.length)
    buffers.forEach(buff => expect(buff).toBeInstanceOf(Buffer))
  })

  test('response = "buffer", store != undefined', async () => {
    const store = { path: 'outputTest', name: 'testStore'}
    output.store = store
    const buffers = await getOutput(images, output)
    expect(buffers).toHaveLength(images.length)
    buffers.forEach(buff => expect(buff).toBeInstanceOf(Buffer))
    rmSync(store.path, { recursive: true })
  })

  test('response = "path", store != undefined', async () => {
    output.response = 'path'
    const store = { path: 'outputTest', name: 'testStore'}
    output.store = store
    const paths = await getOutput(images, output)
    expect(paths).toHaveLength(images.length)
    paths.forEach(path => expect(typeof path).toBe('string'))
    rmSync(store.path, { recursive: true })
  })
})
