// import { platform } from 'os'
import { existsSync, accessSync, constants } from 'fs'
// import isValidFilename from 'valid-filename'
// import filenameReservedRegex, { windowsReservedNameRegex } from 'filename-reserved-regex'
import { Data, Extension, Mode } from './enums'
import { SpliteaError, throwError } from './errors'
import { Size } from './types'

const isString = (str: any): boolean => typeof str === 'string' || str instanceof String

export const parseMode = (mode: any): any => {
  if (!Object.values(Mode).includes(mode)) {
    throw new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
  }
  return mode
}

export const isNatural = (number: any): boolean => typeof number === 'number' && String(number).split('.').length === 1 && number > 0

export const validPairNaturalNumbers = (first: any, second: any): boolean => isNatural(first) && isNatural(second)

export const isSubmultiple = (numerator: any, denominator: any): boolean => isNatural(numerator) && isNatural(denominator) && isNatural(numerator / denominator)

export const validPairSubmultiples = (numerator1: any, denominator1: any, numerator2: any, denominator2: any): boolean => isSubmultiple(numerator1, denominator1) && isSubmultiple(numerator2, denominator2)

export const parseUnique = (tiles: any): boolean => {
  if (tiles.unique !== undefined && typeof tiles.unique !== 'boolean') {
    throw new SpliteaError('unique property should be boolean, only admits true or false value')
  }
  return true
}

const checkModeGrid = (rows: any, columns: any, width: any, height: any, size: Size): void => {
  // Are Natural Numbers -> Columns + Rows || Width + Height
  if (!(validPairNaturalNumbers(rows, columns) || validPairNaturalNumbers(width, height))) {
    throw new SpliteaError('you need to provide two natural numbers, columns + rows or height (px) + width (px)')
  }
  // Are Submultiples Numbers of Size -> Columns + Rows || Width + Height
  if (!(validPairSubmultiples(size.height, rows, size.width, columns) || validPairSubmultiples(size.width, width, size.height, height))) {
    throw new SpliteaError(`you need to provide two natural submultiples of ${size.width} and ${size.height}, columns + rows or width (px) + height (px)`)
  }
}

const checkModeHorizontal = (columns: any, width: any, size: Size): void => {
  // Are Natural Numbers -> Columns || Width
  if (!(isNatural(columns) || isNatural(width))) {
    const msg = 'you need to provide one natural number, columns or width (px)'
    throw new SpliteaError(msg)
  }
  // Are Submultiples Numbers of Size -> Columns || Width
  if (!(isSubmultiple(size.width, columns) || isSubmultiple(size.width, width))) {
    throw new SpliteaError(`you need to provide one natural submultiple of ${size.width}, columns or width (px)`)
  }
}

const checkModeVertical = (rows: any, height: any, size: Size): void => {
  // Are Natural Numbers -> Rows || Height
  if (!(isNatural(rows) || isNatural(height))) {
    const msg = 'you need to provide one natural number, rows or height (px)'
    throw new SpliteaError(msg)
  }
  // Are Submultiples Numbers of Size -> Rows || Height
  if (!(isSubmultiple(size.height, rows) || isSubmultiple(size.height, height))) {
    throw new SpliteaError(`you need to provide one natural submultiple of ${size.height}, rows or height (px)`)
  }
}

export const parseTiles = (tiles: any, size: Size): boolean => {
  const { mode, rows, columns, width, height } = tiles
  // Mode
  parseMode(mode)
  // Mode + Options -> rows, columns,  width, height
  switch (mode) {
    // Mode Grid -> rows + columns || width + height
    case Mode.Grid:
      checkModeGrid(rows, columns, width, height, size)
      break
    // Mode horizontal -> Columns || Width
    case Mode.Horizontal:
      checkModeHorizontal(columns, width, size)
      break
    // Mode Vertical -> Rows || Height
    case Mode.Vertical:
      checkModeVertical(rows, height, size)
      break
  }
  // Unique
  parseUnique(tiles)
  return true
}

export const parseData = (data: any): boolean => {
  const datas = [Data.Buffer, Data.Path]
  if (!datas.includes(data)) {
    throw new SpliteaError('Invalid output data, it should be "buffer" or "path"')
  }
  return true
}

export const parsePath = (path: any): boolean => {
  // Check if path is string
  if (!isString(path)) { throw new SpliteaError('path needs to be string') }
  // Check if path exist
  if (!existsSync(path as string | Buffer | URL)) { throw new SpliteaError(`Not exists path ${path as string}`) }
  // Check if can write
  try {
    accessSync(path as string | Buffer | URL, constants.W_OK)
  } catch (err) {
    throw throwError(err)
  }
  return true
}

export const parseName = (name: any): boolean => {
  // Check if string
  if (!isString(name)) { throw new SpliteaError('name needs to be string') }
  // Check OS valid filename
  // if (!isValidFilename(name as string)) { throw new SpliteaError(`${String(name)} is not a valid filename`) }
  // const invalidFilename: boolean = (platform() === 'win32')
  //   ? windowsReservedNameRegex().test(name)
  //   : filenameReservedRegex().test(name)
  // if (invalidFilename) { throw new SpliteaError(`${String(name)} is not a valid filename`) }
  return true
}

export const parseExtension = (extension: any): boolean => {
  // Check if string
  if (!isString(extension)) { throw new SpliteaError('extension needs to be string') }
  // Check if valid extension
  const values = Object.values(Extension)
  if (!values.includes(extension)) { throw new SpliteaError(`${extension as string} needs to be one of this extensions -> ${values.toString()}`) }
  return true
}

export const parseOutput = (output: any): boolean => {
  const { data, path, name, extension } = output
  // Data
  parseData(data)
  // Path
  parsePath(path)
  // Name
  parseName(name)
  // Extension
  parseExtension(extension)
  return true
}

// const writeImage = (image: Jimp, name: string, index: number, extension: string): string => {
//   const filename = `${name}_${index}_${new Date().getTime()}${extension}`
//   image.write(filename)
//   return filename
// }

// const getSplitImage = (image: Jimp, x: number, y: number, w: number, h: number): Jimp => {
//   try {
//     return image.clone().autocrop().crop(x, y, w, h)
//   } catch (err) {
//     if (err instanceof SpliteaError) { throw err }
//     console.log(err)
//     throw new SpliteaError('Problem spliting image')
//   }
// }

// const getSlicesVertical = async (image: Jimp, slicesNumber: number): Promise<Jimp[]> => {
//   try {
//     const { width, height } = image.bitmap
//     const step = Math.floor(height / slicesNumber)
//     let slices: Jimp[] = []
//     const x = 0
//     const w = width
//     const h = step
//     for (let i = 0; i < slicesNumber; i++) {
//       const y = i * step
//       const newHeight = ((y + h) <= height) ? h : height - y
//       const slice = getSplitImage(image, x, y, w, newHeight)
//       if (slice.bitmap.height < height) {
//         slices.push(slice)
//       }
//     }
//     return slices
//   } catch (error) {
//     if (error instanceof SpliteaError) { throw error }
//     console.log(error)
//     throw new SpliteaError('Problem with getting vertical slices')
//   }
// }

// const getSlicesHorizontal = async (image: Jimp, slicesNumber: number): Promise<Jimp[]> => {
//   try {
//     const { width, height } = image.bitmap
//     const step = Math.floor(width / slicesNumber)
//     let slices: Jimp[] = []
//     const y = 0
//     const w = step
//     const h = height
//     for (let i = 0; i < slicesNumber; i++) {
//       const x = i * step
//       const newWidth = ((x + w) <= width) ? w : width - x
//       console.log(`
//         Image of ${width} x ${height} px
//         x = ${x} px - w = ${newWidth} px
//         y = ${y} px - h = ${h} px
//       `)
//       const slice = getSplitImage(image, x, y, newWidth, h)
//       if (slice.bitmap.width < width) {
//         slices.push(slice)
//       }
//     }
//     return slices
//   } catch (error) {
//     if (error instanceof SpliteaError) { throw error }
//     console.error(error)
//     throw new SpliteaError('Problem with getting horizontal slices')
//   }
// }

// const splitImageVertical = async (image: Jimp, slicesNumber: number): Promise<string[]> => {
//   try {
//     const slices = await getSlicesVertical(image, slicesNumber)
//     if (slices.length === 0) { return [] }
//     const { name, ext } = path.parse(image)
//     return slices.map((slice, index) => writeImage(slice, name, index, ext))
//   } catch (error) {
//     if (error instanceof SpliteaError) { throw error }
//     console.log(error)
//     throw new SpliteaError('Problem writting vertical slices')
//   }
// }

// const splitImageHorizontal = async (image: Jimp, slicesNumber: number): Promise<string[]> => {
//   try {
//     const slices = await getSlicesHorizontal(image, slicesNumber)
//     if (slices.length === 0) { return [] }
//     const { name, ext } = path.parse(IMG)
//     return slices.map((slice, index) => writeImage(slice, name, index, ext))
//   } catch (error) {
//     if (error instanceof SpliteaError) { throw error }
//     console.log(error)
//     throw new SpliteaError('Problem writting vertical slices')
//   }
// }
