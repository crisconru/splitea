import * as Path from 'node:path'
import Jimp from 'jimp'
import { SpliteaError, ThrowSpliteaError } from './errors'
import type { CropData, Image, Natural, Size, StoreOptions, UniqueImagesOptions, WriteOptions } from './types'

// @ts-expect-error
export const getImage = async (image: Image): Promise<Jimp> => {
  try {
    // @ts-expect-error
    return await Jimp.read(image)
  } catch (error) {
    ThrowSpliteaError(error, `Error reading image ${image.toString()}`)
  }
}

export const getSize = (image: Jimp): Size => ({ width: image.bitmap.width, height: image.bitmap.height })

const areEqualImages = (img1: Jimp, img2: Jimp, options: UniqueImagesOptions): boolean => {
  const { requirement, distance, difference } = options
  try {
    // Distance
    if (requirement === 'distance') { return Jimp.distance(img1, img2) <= distance }
    // Difference
    if (requirement === 'difference') { return Jimp.diff(img1, img2).percent <= difference }
    // Distance + Difference
    const dist = Jimp.distance(img1, img2)
    const diff = Jimp.diff(img1, img2).percent
    return (dist <= distance && diff <= difference)
  } catch (error) {
    console.log(error)
    ThrowSpliteaError(error, 'Error comparing images')
  }
  return false
}

const getUniqueTiles = (images: Jimp[], options: UniqueImagesOptions): Jimp[] => {
  if (images.length < 2) return images
  let array = [...images]
  const uniques: Jimp[] = []
  do {
    const image: Jimp = array.shift() as Jimp
    uniques.push(image)
    array = array.filter(elem => !areEqualImages(image, elem, options))
  } while (array.length > 0)
  return uniques
}

const getTile = (image: Jimp, { x, y, w, h }: CropData): Jimp => image.clone().crop(x, y, w, h)

export const getHorizontalTiles = (image: Jimp, size: Size, width: Natural): Jimp[] => {
  if (size.width === width) return [image]
  const tiles = []
  const y = 0
  const w = width
  const h = size.height
  for (let x = 0; x < size.width; x += width) {
    try {
      tiles.push(getTile(image, { x, y, w, h }))
    } catch (error) {
      ThrowSpliteaError(error, 'Cannot get Horizontal tiles')
    }
  }
  return tiles
}

export const getUniqueHorizontalTiles = (image: Jimp, size: Size, width: Natural, options: UniqueImagesOptions): Jimp[] => {
  const tiles = getHorizontalTiles(image, size, width)
  return getUniqueTiles(tiles, options)
}

export const getVerticalTiles = (image: Jimp, size: Size, height: Natural): Jimp[] => {
  if (size.height === height) return [image]
  const tiles = []
  const x = 0
  const w = size.width
  const h = height
  for (let y = 0; y < size.height; y += height) {
    try {
      tiles.push(getTile(image, { x, y, w, h }))
    } catch (error) {
      ThrowSpliteaError(error, 'Cannot get Vertical tiles')
    }
  }
  return tiles
}

export const getUniqueVerticalTiles = (image: Jimp, size: Size, height: Natural, options: UniqueImagesOptions): Jimp[] => {
  const tiles = getVerticalTiles(image, size, height)
  return getUniqueTiles(tiles, options)
}

export const getGridTiles = (image: Jimp, size: Size, width: Natural, height: Natural): Jimp[] => {
  if (size.width === width) return [image]
  const tiles = []
  const w = width
  const h = height
  for (let x = 0; x < size.width; x += width) {
    for (let y = 0; y < size.height; y += height) {
      try {
        tiles.push(getTile(image, { x, y, w, h }))
      } catch (error) {
        ThrowSpliteaError(error, 'Cannot get Grid tiles')
      }
    }
  }
  return tiles
}

export const getUniqueGridTiles = (image: Jimp, size: Size, width: Natural, height: Natural, options: UniqueImagesOptions): Jimp[] => {
  const tiles = getGridTiles(image, size, width, height)
  return getUniqueTiles(tiles, options)
}

const writeImage = async (image: Jimp, options: WriteOptions): Promise<string> => {
  const { path, filename: name, extension, index, pad } = options
  const filename = `${name}_${(index).toString().padStart(pad, '0')}.${extension}`
  const file = Path.join(path, filename)
  await image.writeAsync(file)
  return file
}

export const writeImages = async (images: Jimp[], storeOptions: StoreOptions): Promise<string[]> => {
  if (images.length < 1) throw new SpliteaError('Impossible to write no images')
  const { path, filename, extension } = storeOptions
  const pad = Math.floor(Math.log10(images.length)) + 1
  if (images.length === 1) {
    const filenames = await writeImage(images[0], { path, filename, extension, index: '', pad })
    return [filenames]
  }
  return await Promise.all(
    images.map(
      async (image: Jimp, index: number) => await writeImage(image, { path, filename, extension, index: index.toString(), pad })
    )
  )
}

// @ts-expect-error
export const getBufferImages = async (images: Jimp[]): Promise<Buffer[]> => {
  try {
    return await Promise.all(
      images.map(async (image: Jimp) => await image.getBufferAsync(image.getMIME()))
    )
  } catch (error) {
    ThrowSpliteaError(error, 'Impossible to get buffer from images')
  }
}
