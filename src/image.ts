import * as Path from 'node:path'
import * as v from 'valibot'
import Jimp from "jimp"
import { SpliteaError, ThrowSpliteaError } from "./errors"
import { Image, Size, TileCoordinates, Unique } from "./types"
import { ImageSchema, SizeSchema } from './schemas'

export const getSize = (image: Jimp): Size => v.parse(SizeSchema, { width: image.bitmap.width, height: image.bitmap.height})

export const getImage = async (image: Image): Promise<[Jimp, Size]> => {
  try {
    const i = v.parse(ImageSchema, image)
    // @ts-ignore
    const img = await Jimp.read(i)
    const size: Size = getSize(img)
    return [img, size]
  } catch (error) {
    throw ThrowSpliteaError(error, `Error reading image ${image}`)
  }
}

const getSplitImage = (image: Jimp, size: Size, tileCoordinates: TileCoordinates): Jimp => {
  try {
    const { width, height } = size
    const { x, y, width: w, height: h } = tileCoordinates
    if (x === 0 && w === width && y === 0 && h === height) return image
    if ((x + w) > width) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max x value is ${width - 1}`)
    if ((y + h) > height) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max y value is ${height - 1}`)
    return image.clone().crop(x, y, w, h)
  } catch (error) {
    throw ThrowSpliteaError(error, 'Problem spliting image')
  }
}

export const areEqualImages = (img1: Jimp, img2: Jimp, unique: Unique): boolean => {
  const { requirement, distance, difference } = unique
  try {
    const dist = Jimp.distance(img1, img2)
    const diff = Jimp.diff(img1, img2).percent
    return ( requirement === 'both')
      ? (dist < distance && diff < difference)
      : (dist < distance || diff < difference)
  } catch (error) {
    console.log(error)
    ThrowSpliteaError(error, 'Error comparing images')
  }
  return false
}

export const getUniqueImages = (images: Jimp[], unique: Unique): Jimp[] => {
  if (images.length < 2) return images
  let array = [...images]
  let uniques: Jimp[] = []
  do {
    const image: Jimp = array.shift() as Jimp
    uniques.push(image)
    array = array.filter(elem => !areEqualImages(image, elem, unique))
  } while (array.length > 0) 
  return uniques
}

export const getSplitImages = (image: Jimp, size: Size, tilesCoordinate: TileCoordinates[], unique: Unique | undefined): Jimp[] => {
  const images = tilesCoordinate.map(tileCoordinates => getSplitImage(image, size, tileCoordinates))
  if (unique && images.length > 1) { return getUniqueImages(images, unique) }
  return images
}

const writeImage = async (image: Jimp, path: string, name: string, index: number | string, extension: string): Promise<string> => {
  const filename = `${name}_${(index).toString().padStart(3, '0')}.${extension}`
  const file = Path.join(path, filename)
  await image.writeAsync(file)
  return file
}

export const writeImages = async (images: Jimp[], path: string, name: string, extension: string): Promise<string[]> => {
  if (images.length < 1) throw new SpliteaError('Impossible to write no images')
  if (images.length === 1) {
    const filenames = await writeImage(images[0], path, name, '', extension)
    return [filenames]
  }
  return Promise.all(
    images.map(
      async (image: Jimp, index: number) => await writeImage(image, path, name, index, extension)
    )
  )
}

export const getBufferImages = async (images: Jimp[]): Promise<Buffer[]> => {
  try {
    const buffers = await Promise.all(images.map(async (image: Jimp) => await image.getBufferAsync(image.getMIME())))
    return buffers
  } catch (error) {
    ThrowSpliteaError(error, 'Impossible to get buffer from images')
  }
  return Promise.resolve([])
}