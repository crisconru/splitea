import { Mode } from './enums'
import { SpliteaError } from './errors'
import { Size } from './types'

const parseMode = (mode: any): void => {
  if (!Object.values(Mode).includes(mode)) {
    throw new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
  }
  return mode
}

const isNatural = (number: any): boolean => typeof number === 'number' && String(number).split('.').length === 1 && number >= 0

const validPairNaturalNumbers = (first: any, second: any): boolean => isNatural(first) && isNatural(second)

const isSubmultiple = (numerator: number, denominator: number): boolean => isNatural(numerator / denominator)

const validPairSubmultiples = (numerator1: number, denominator1: number, numerator2: number, denominator2: number): boolean => isSubmultiple(numerator1, denominator1) && isSubmultiple(numerator2, denominator2)

const parseModeSlices = (mode: Mode, rows: any, columns: any, width: any, height: any, size: Size): void => {
  parseMode(mode)
  switch (mode) {
    // Mode Grid -> rows + columns || width + height
    case Mode.Grid:
      if (!(validPairNaturalNumbers(rows, columns) || validPairNaturalNumbers(width, height))) {
        const msg = 'you need to provide two natural numbers, columns + rows or height (px) + width (px)'
        throw new SpliteaError(msg)
      }
      if (!(validPairSubmultiples(size.height, rows, size.width, columns) || validPairSubmultiples(size.width, width, size.height, height))) {
        const msg = `you need to provide two natural submultiples of ${size.width} and ${size.height}, columns + rows or width (px) + height (px)`
        throw new SpliteaError(msg)
      }
      break
    // Mode horizontal -> columns || width
    case Mode.Horizontal:
      if (!(isNatural(columns) || isNatural(width))) {
        const msg = 'you need to provide one natural number, columns or width (px)'
        throw new SpliteaError(msg)
      }
      break
    // Mode Vertical -> rows || height
    case Mode.Vertical:
      if (!(isNatural(rows) || isNatural(height))) {
        const msg = 'you need to provide one natural number, columns or height (px)'
        throw new SpliteaError(msg)
      }
      break
  }
}

export const parseOptions = (options: any, size: Size): boolean => {
  // Mode + Slices (Rows + Columns || Width + Height)
  parseModeSlices(options.mode, options?.row, options?.columns, options?.width, options?.height, size)
  // Name
  // Extension
  // Unique
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