import path from 'path'
import Jimp from 'jimp'
import { Size } from './types'

class SpliteaError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const getSize = async (IMG: string): Promise<Size> => {
  try {
    const img = await Jimp.read(IMG)
    const { width, height } = img.bitmap
    return { width, height }
  } catch (error) {
    console.log('Error Splitea')
    console.log(error)
    throw new SpliteaError('Invalid dimensions')
  }
}

const writeImage = (image: Jimp, name: string, index: number, extension: string): string => {
  const filename = `${name}_${index}_${new Date().getTime()}${extension}`
  image.write(filename)
  return filename
}

const getSplitImage = (img: Jimp, x: number, y: number, w: number, h: number): Jimp => {
  try {
    return img.clone().autocrop().crop(x, y, w, h)
  } catch (err) {
    if (err instanceof SpliteaError) { throw err }
    console.log(err)
    throw new SpliteaError('Problem spliting image')
  }
}

export const getSlicesVertical = async (IMG: string, slicesNumber: number): Promise<Jimp[]> => {
  try {
    const img = await Jimp.read(IMG)
    const { width, height } = img.bitmap
    const step = Math.floor(height / slicesNumber)
    let slices: Jimp[] = []
    const x = 0
    const w = width
    const h = step
    for (let i = 0; i < slicesNumber; i++) {
      const y = i * step
      const newHeight = ((y + h) <= height) ? h : height - y
      const slice = getSplitImage(img, x, y, w, newHeight)
      if (slice.bitmap.height < height) {
        slices.push(slice)
      }
    }
    return slices
  } catch (error) {
    if (error instanceof SpliteaError) { throw error }
    console.log(error)
    throw new SpliteaError('Problem with getting vertical slices')
  }
}

export const getSlicesHorizontal = async (IMG: string, slicesNumber: number): Promise<Jimp[]> => {
  try {
    const img = await Jimp.read(IMG)
    const { width, height } = img.bitmap
    const step = Math.floor(width / slicesNumber)
    let slices: Jimp[] = []
    const y = 0
    const w = step
    const h = height
    for (let i = 0; i < slicesNumber; i++) {
      const x = i * step
      const newWidth = ((x + w) <= width) ? w : width - x
      console.log(`
        Image of ${width} x ${height} px
        x = ${x} px - w = ${newWidth} px
        y = ${y} px - h = ${h} px
      `)
      const slice = getSplitImage(img, x, y, newWidth, h)
      if (slice.bitmap.width < width) {
        slices.push(slice)
      }
    }
    return slices
  } catch (error) {
    if (error instanceof SpliteaError) { throw error }
    console.error(error)
    throw new SpliteaError('Problem with getting horizontal slices')
  }
}

export const splitImageVertical = async (IMG: string, slicesNumber: number): Promise<string[]> => {
  try {
    const slices = await getSlicesVertical(IMG, slicesNumber)
    if (slices.length === 0) { return [] }
    const { name, ext } = path.parse(IMG)
    return slices.map((slice, index) => writeImage(slice, name, index, ext))
  } catch (error) {
    if (error instanceof SpliteaError) { throw error }
    console.log(error)
    throw new SpliteaError('Problem writting vertical slices')
  }
}

export const splitImageHorizontal = async (IMG: string, slicesNumber: number): Promise<string[]> => {
  try {
    const slices = await getSlicesHorizontal(IMG, slicesNumber)
    if (slices.length === 0) { return [] }
    const { name, ext } = path.parse(IMG)
    return slices.map((slice, index) => writeImage(slice, name, index, ext))
  } catch (error) {
    if (error instanceof SpliteaError) { throw error }
    console.log(error)
    throw new SpliteaError('Problem writting vertical slices')
  }
}
