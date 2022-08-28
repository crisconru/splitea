import Jimp from 'jimp'
import { Mode } from './enums'
import { SpliteaError, throwError } from './errors'
import { Size, Tiles, Output, Image } from './types'
import { isNatural, parseOutput, parseTiles } from './utils'

export const readImage = async (image: string): Promise<[Jimp, Size]> => {
  try {
    const img = await Jimp.read(image)
    const size: Size = { width: img.bitmap.width, height: img.bitmap.height }
    return [img, size]
  } catch (error) {
    throw throwError(error, `Error reading image ${image}`)
  }
}

// const writeImage = (image: Jimp, path: string, name: string, index: number, extension: string): string => {
//   const filename = `${name}_${index}_${new Date().getTime()}${extension}`
//   image.write(filename)
//   return filename
// }

export const getSplitImage = (image: Jimp, x: number, y: number, w: number, h: number): Jimp => {
  try {
    const { width, height } = image.bitmap
    if (x === 0 && w === width && y === 0 && h === height) return image
    if ((x + w) > width) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max x value is ${width - 1}`)
    if ((y + h) > height) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max y value is ${height - 1}`)
    return image.clone().crop(x, y, w, h)
  } catch (error) {
    throw throwError(error, 'Problem spliting image')
  }
}

export const getHorizontalTiles = (image: Jimp, size: Size, tilesWidth: number, tilesColumns: number): Image[] => {
  if (tilesWidth === 0 && tilesColumns === 0) throw new SpliteaError('It needs to provide "columns" or "width"')
  if (tilesWidth > 0 && tilesColumns > 0) throw new SpliteaError('It needs to provide "columns" or "width" but not both of them')
  try {
    const { width, height } = size
    const [w, tilesNumber] = tilesWidth === 0
      ? [width / tilesColumns, tilesColumns]
      : [tilesWidth, width / tilesWidth]
    const h = height
    const y = 0
    return new Array(tilesNumber).map((_, index) => {
      const x = w * index
      return getSplitImage(image, x, y, w, h)
    })
  } catch (error) {
    throw throwError(error, 'Problem with getting horizontal slices')
  }
}

export const getVerticalTiles = (image: Jimp, size: Size, tilesHeight: number, tilesRows: number): Image[] => {
  if (tilesHeight === 0 && tilesRows === 0) throw new SpliteaError('It needs to provide "rows" or "heigth"')
  if (tilesHeight > 0 && tilesRows > 0) throw new SpliteaError('It needs to provide "rows" or "heigth" but not both of them')
  try {
    const { width, height } = size
    const w = width
    const [h, tilesNumber] = tilesHeight === 0
      ? [height / tilesRows, tilesRows]
      : [tilesHeight, height / tilesHeight]
    const x = 0
    return new Array(tilesNumber).map((_, index) => {
      const y = h * index
      return getSplitImage(image, x, y, w, h)
    })
  } catch (error) {
    throw throwError(error, 'Problem with getting vertical slices')
  }
}

const validGridTiles = (tilesWidth: number, tilesHeight: number, tilesRows: number, tilesColumns: number): void => {
  if (tilesWidth === 0 && tilesHeight === 0 && tilesRows === 0 && tilesColumns === 0) throw new SpliteaError('It needs to provide "rows & columns" or "width & height"')
  if (tilesWidth > 0 && tilesHeight > 0 && tilesRows > 0 && tilesColumns > 0) throw new SpliteaError('It needs to provide "rows & columns" or "width & height" but not both of them')
  if (tilesWidth > 0 && tilesColumns > 0) throw new SpliteaError('It needs to provide "columns" or "width" but not both of them')
  if (tilesHeight > 0 && tilesRows > 0) throw new SpliteaError('It needs to provide "rows" or "height" but not both of them')
  if (tilesWidth === 0 && tilesHeight > 0) throw new SpliteaError('Missing "width"')
  if (tilesWidth > 0 && tilesHeight === 0) throw new SpliteaError('Missing "height"')
  if (tilesRows === 0 && tilesColumns > 0) throw new SpliteaError('Missing "rows"')
  if (tilesRows > 0 && tilesColumns === 0) throw new SpliteaError('Missing "columns"')
}

export const getGridTiles = (image: Jimp, size: Size, tilesWidth: number, tilesHeight: number, tilesRows: number, tilesColumns: number): Image[] => {
  validGridTiles(tilesWidth, tilesHeight, tilesRows, tilesColumns)
  try {
    const { width, height } = size
    const [w, tilesNumberX] = tilesWidth === 0
      ? [width / tilesColumns, tilesColumns]
      : [tilesWidth, width / tilesWidth]
    const [h, tilesNumberY] = tilesHeight === 0
      ? [height / tilesRows, tilesRows]
      : [tilesHeight, height / tilesHeight]
    const arrayX = new Array(tilesNumberX).fill(1)
    const arrayY = new Array(tilesNumberY).fill(1)
    return arrayX.map((_x, indexX) => {
      const x = w * indexX
      return arrayY.map((_y, indexY) => {
        const y = h * indexY
        return getSplitImage(image, x, y, w, h)
      })
    }).flat()
  } catch (error) {
    throw throwError(error, 'Problem with getting grid slices')
  }
}

export const getTiles = (img: Jimp, size: Size, tiles: Tiles): Image[] => {
  if (tiles?.mode !== undefined) {
    const width = (!isNatural(tiles.width)) ? 0 : tiles.width as number
    const height = (!isNatural(tiles.height)) ? 0 : tiles.height as number
    const columns = (!isNatural(tiles.columns)) ? 0 : tiles.columns as number
    const rows = (!isNatural(tiles.rows)) ? 0 : tiles.rows as number
    // Horizontal
    if (tiles.mode === Mode.Horizontal) return getHorizontalTiles(img, size, width, columns)
    // Vertical
    if (tiles.mode === Mode.Vertical) return getVerticalTiles(img, size, height, rows)
    // Grid
    if (tiles.mode === Mode.Grid) return getGridTiles(img, size, width, height, rows, columns)
    // Error
    throw new SpliteaError('Invalid mode')
  }
  throw new SpliteaError('No mode defined')
}

export const areEqualImages = (img1: Jimp, img2: Jimp): boolean => {
  try {
    const distance = Jimp.distance(img1, img2)
    const diff = Jimp.diff(img1, img2)
    if (distance < 0.15 || diff.percent < 0.15) return true
  } catch (error) {
    console.log(error)
    throwError(error, 'Error comparing images')
  }
  return false
}

export const uniqueTiles = (imgs: Image[]): Image[] => {
  return imgs
}

export const Splitea = async (image: string, tiles: Tiles, output?: Output): Promise<Image[] | undefined | never> => {
  try {
    // Read image
    const [img, size] = await readImage(image)
    // Check tiles options
    parseTiles(tiles, size)
    // Check output options
    parseOutput(output)
    // Get tiles
    const tmpSlices = getTiles(img, size, tiles)
    // Remove similars
    const uniqueSlices = (tiles?.unique === true) ? uniqueTiles(tmpSlices) : tmpSlices
    // Store tiles
    if (output.)
    // Return tiles
    const slices = uniqueSlices
    return await Promise.resolve(slices)
  } catch (error) {
    throw throwError(error, 'Problems with Splitea')
  }
}
