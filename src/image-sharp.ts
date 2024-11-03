import * as Path from 'node:path'
import sharp, { type Sharp } from 'sharp'
import phash from 'sharp-phash'
import dist from 'sharp-phash/distance'
import { SpliteaError, ThrowSpliteaError } from './errors'
import type { CropData, ImageSource, Natural, Size, StoreOptions, UniqueImagesOptions, WriteOptions } from './types'

// @ts-expect-error
export const getImage = async (image: ImageSource): Promise<Sharp> => {
  try {
    const img = sharp(image)
    await getSize(img)
    return await Promise.resolve(img)
  } catch (error) {
    ThrowSpliteaError(error, `Error reading image ${image.toString()}`)
  }
}

export const getSize = async (image: Sharp): Promise<Size> => {
  const metadata = await image.metadata()
  return { width: metadata.width as number, height: metadata.height as number }
}

const areEqualImages = async (img1: Sharp, img2: Sharp, options: UniqueImagesOptions): Promise<boolean> => {
  const { distance } = options
  try {
    const [buff1, buff2] = await Promise.all([img1.toBuffer(), img2.toBuffer()])
    const [hash1, hash2] = await Promise.all([phash(buff1), phash(buff2)])
    const d = dist(hash1, hash2)
    return d < distance
  } catch (error) {
    console.log(error)
    ThrowSpliteaError(error, 'Error comparing images')
  }
  return false
}

const getUniqueTiles = async (images: Sharp[], options: UniqueImagesOptions): Promise<Sharp[]> => {
  if (images.length < 2) return images
  let array = [...images]
  const uniques: Sharp[] = []
  do {
    const image: Sharp = array.shift() as Sharp
    uniques.push(image)
    array = await Promise.all(
      array.filter(async (elem) => {
        const equal = await areEqualImages(image, elem, options)
        return !equal
      })
    )
  } while (array.length > 0)
  return uniques
}

// @ts-expect-error
const getTile = (image: Sharp, { x, y, w, h }: CropData): Sharp => {
  try {
    return image.clone().extract({ left: x, top: y, width: w, height: h })
  } catch (error) {
    console.error(`Error with getTile\n${(error as Error).message}`)
  }
}

export const getHorizontalTiles = (image: Sharp, size: Size, width: Natural): Sharp[] => {
  if (size.width === width) return [image]
  const tiles = []
  const y = 0
  const w = width
  const h = size.height
  for (let x = 0; x < size.width; x += width) {
    try {
      const tile = getTile(image, { x, y, w, h })
      tiles.push(tile)
    } catch (error) {
      ThrowSpliteaError(error, 'Cannot get Horizontal tiles')
    }
  }
  return tiles
}

export const getUniqueHorizontalTiles = async (image: Sharp, size: Size, width: Natural, options: UniqueImagesOptions): Promise<Sharp[]> => {
  const tiles = getHorizontalTiles(image, size, width)
  return await getUniqueTiles(tiles, options)
}

export const getVerticalTiles = (image: Sharp, size: Size, height: Natural): Sharp[] => {
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

export const getUniqueVerticalTiles = async (image: Sharp, size: Size, height: Natural, options: UniqueImagesOptions): Promise<Sharp[]> => {
  const tiles = getVerticalTiles(image, size, height)
  return await getUniqueTiles(tiles, options)
}

export const getGridTiles = (image: Sharp, size: Size, width: Natural, height: Natural): Sharp[] => {
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

export const getUniqueGridTiles = async (image: Sharp, size: Size, width: Natural, height: Natural, options: UniqueImagesOptions): Promise<Sharp[]> => {
  const tiles = getGridTiles(image, size, width, height)
  return await getUniqueTiles(tiles, options)
}

const writeImage = async (image: Sharp, options: WriteOptions): Promise<string> => {
  const { path, filename: name, extension, index, pad } = options
  const filename = `${name}_${(index).toString().padStart(pad, '0')}.${extension}`
  const file = Path.join(path, filename)
  await image.toFile(file)
  return file
}

export const writeImages = async (images: Sharp[], storeOptions: StoreOptions): Promise<string[]> => {
  if (images.length < 1) throw new SpliteaError('Impossible to write no images')
  const { path, filename, extension } = storeOptions
  const pad = Math.floor(Math.log10(images.length)) + 1
  if (images.length === 1) {
    const filenames = await writeImage(images[0], { path, filename, extension, index: '', pad })
    return [filenames]
  }
  return await Promise.all(
    images.map(
      async (image: Sharp, index: number) => await writeImage(image, { path, filename, extension, index: index.toString(), pad })
    )
  )
}

// @ts-expect-error
export const getBufferImages = async (images: Sharp[]): Promise<Buffer[]> => {
  try {
    return await Promise.all(
      images.map(async (image: Sharp) => await image.toBuffer())
    )
  } catch (error) {
    ThrowSpliteaError(error, 'Impossible to get buffer from images')
  }
}
