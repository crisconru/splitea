import type { Difference, Distance, Filename, GridOptions, HorizontalOptions, Image, Output, StoreOptions, UniqueImagesOptions, UniqueRequirement, VerticalOptions } from './types'
import { getBufferImages, getGridTiles, getHorizontalTiles, getImage, getSize, getUniqueGridTiles, getUniqueHorizontalTiles, getUniqueVerticalTiles, getVerticalTiles, writeImages } from './image'
import { GridOptionsSchema, HorizontalOptionsSchema, ImageSchema, VerticalOptionsSchema } from './schemas'
import { isSubmultiple } from './utils'
import { SpliteaError } from './errors'

export const horizontalTiles = async (image: Image, options: HorizontalOptions): Promise<Output[]> => {
  // 1. Check Image + Get the image + size
  const img = await getImage(ImageSchema.parse(image))
  const size = getSize(img)
  // 2. Check Options
  const opt = HorizontalOptionsSchema.parse(options)
  if (opt.columns !== undefined && !isSubmultiple(size.width, opt.columns)) {
    throw new SpliteaError(`columns (${opt.columns}) is not a submultiple of the image width (${size.width} px)`)
  }
  if (opt.width !== undefined && !isSubmultiple(size.width, opt.width)) {
    throw new SpliteaError(`width (${opt.width} px) is not a submultiple of the image width (${size.width} px)`)
  }
  // 3. Get the tiles
  const tileWidth = (opt.columns !== undefined) ? size.width / opt.columns : opt.width as number
  const uniqueOptions = {
    requirement: opt.uniqueRequirement as UniqueRequirement,
    distance: opt.distance as Distance,
    difference: opt.difference as Difference
  } satisfies UniqueImagesOptions
  const tiles = (opt.unique as boolean)
    ? getUniqueHorizontalTiles(img, size, tileWidth, uniqueOptions)
    : getHorizontalTiles(img, size, tileWidth)
  // 4. Not store -> return Buffer[]
  if (opt.path === undefined) { return await getBufferImages(tiles) }
  // 5. Store tiles
  const storeOptions = {
    path: opt.path,
    filename: opt.filename as Filename,
    extension: opt.extension ?? img.getExtension()
  } satisfies StoreOptions
  const files = await writeImages(tiles, storeOptions)
  // 6. Return buffer[] | string[]
  if (opt.response === 'file') return files
  return await getBufferImages(tiles)
}

export const verticalTiles = async (image: Image, options: VerticalOptions): Promise<Output[]> => {
  // 1. Check Image + Get the image + size
  const img = await getImage(ImageSchema.parse(image))
  const size = getSize(img)
  // 2. Check Options
  const opt = VerticalOptionsSchema.parse(options)
  if (opt.rows !== undefined && !isSubmultiple(size.height, opt.rows)) {
    throw new SpliteaError(`rows (${opt.rows}) is not a submultiple of the image height (${size.height} px)`)
  }
  if (opt.height !== undefined && !isSubmultiple(size.height, opt.height)) {
    throw new SpliteaError(`height (${opt.height} px) is not a submultiple of the image height (${size.height} px)`)
  }
  // 3. Get the tiles
  const tileHeight = (opt.rows !== undefined) ? size.height / opt.rows : opt.height as number
  const uniqueOptions = {
    requirement: opt.uniqueRequirement as UniqueRequirement,
    distance: opt.distance as Distance,
    difference: opt.difference as Difference
  } satisfies UniqueImagesOptions
  const tiles = (opt.unique as boolean)
    ? getUniqueVerticalTiles(img, size, tileHeight, uniqueOptions)
    : getVerticalTiles(img, size, tileHeight)
  // 4. Not store -> return Buffer[]
  if (opt.path === undefined) { return await getBufferImages(tiles) }
  // 5. Store tiles
  const storeOptions = {
    path: opt.path,
    filename: opt.filename as Filename,
    extension: opt.extension ?? img.getExtension()
  } satisfies StoreOptions
  const files = await writeImages(tiles, storeOptions)
  // 6. Return buffer[] | string[]
  if (opt.response === 'file') return files
  return await getBufferImages(tiles)
}

export const gridTiles = async (image: Image, options: GridOptions): Promise<Output[]> => {
  // 1. Check Image + Get the image + size
  const img = await getImage(ImageSchema.parse(image))
  const size = getSize(img)
  // 2. Check Options
  const opt = GridOptionsSchema.parse(options)
  if (opt.columns !== undefined && !isSubmultiple(size.width, opt.columns)) {
    throw new SpliteaError(`columns (${opt.columns}) is not a submultiple of the image width (${size.width} px)`)
  }
  if (opt.rows !== undefined && !isSubmultiple(size.height, opt.rows)) {
    throw new SpliteaError(`rows (${opt.rows}) is not a submultiple of the image height (${size.height} px)`)
  }
  if (opt.width !== undefined && !isSubmultiple(size.width, opt.width)) {
    throw new SpliteaError(`width (${opt.width} px) is not a submultiple of the image width (${size.width} px)`)
  }
  if (opt.height !== undefined && !isSubmultiple(size.height, opt.height)) {
    throw new SpliteaError(`height (${opt.height} px) is not a submultiple of the image height (${size.height} px)`)
  }
  // 3. Get the tiles
  const tileWidth = (opt.columns !== undefined) ? size.width / opt.columns : opt.width as number
  const tileHeight = (opt.rows !== undefined) ? size.height / opt.rows : opt.height as number
  const uniqueOptions = {
    requirement: opt.uniqueRequirement as UniqueRequirement,
    distance: opt.distance as Distance,
    difference: opt.difference as Difference
  } satisfies UniqueImagesOptions
  const tiles = (opt.unique as boolean)
    ? getUniqueGridTiles(img, size, tileWidth, tileHeight, uniqueOptions)
    : getGridTiles(img, size, tileWidth, tileHeight)
  // 4. Not store -> return Buffer[]
  if (opt.path === undefined) { return await getBufferImages(tiles) }
  // 5. Store tiles
  const storeOptions = {
    path: opt.path,
    filename: opt.filename as Filename,
    extension: opt.extension ?? img.getExtension()
  } satisfies StoreOptions
  const files = await writeImages(tiles, storeOptions)
  // 6. Return buffer[] | string[]
  if (opt.response === 'file') return files
  return await getBufferImages(tiles)
}
