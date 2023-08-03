import { existsSync, accessSync, constants } from 'fs'
import { Data, Extension, Mode } from './enums'
import { SpliteaError, throwError } from './errors'
import { Size } from './types'

const isString = (str: any): boolean => typeof str === 'string' || str instanceof String

export const parseMode = (mode: any): Mode => {
  if (Object.values(Mode).includes(mode)) return mode
  throw new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
}

export const isNatural = (num: any): boolean => (typeof num === 'number') && (String(num).split('.').length === 1) && (num > 0)

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
    throw throwError(err, `Problems parsing path ${String(path)}`)
  }
  return true
}

export const parseName = (name: any): boolean => {
  // Check if string
  if (!isString(name)) { throw new SpliteaError('name needs to be string') }
  // Check OS valid filename
  // Windows Regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
  const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/
  const invalidWindowsFilename = new RegExp(windowsReservedNameRegex, 'i')
  // All OS except Windows Regex = /[<>:"/\\|?*\u0000-\u001F]/g
  const filenameReservedRegex = '[<>:"/\\|?*\u0000-\u001F]'
  const invalidFilename = new RegExp(filenameReservedRegex, 'g')
  if (invalidFilename.test(name as string) || invalidWindowsFilename.test(name as string)) { throw new SpliteaError(`${String(name)} is not a valid filename`) }
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

const parseStore = (path: any, name: any, extension: any): boolean => {
  // Path
  if (path !== undefined) { parsePath(path) }
  // Name
  parseName(name)
  // Extension
  if (extension !== undefined) { parseExtension(extension) }
  return true
}

export const parseOutput = (output: any): boolean => {
  const { data, path, name, extension } = output
  // Data
  parseData(data)
  // Check if save => data = path
  if (data === 'path') {
    if (name === undefined) { throw new SpliteaError('"name" is required') }
    parseStore(path, name, extension)
  // Check if save => data = path || name != undefined
  } else if (name !== undefined) {
    parseStore(path, name, extension)
  }
  return true
}
