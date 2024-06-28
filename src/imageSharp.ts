// phash with sharp -> https://www.npmjs.com/package/sharp-phash
// phash -> https://www.npmjs.com/search?q=phash

// import * as Path from 'node:path'
// import Jimp from "jimp"
// import sharp, { Sharp } from 'sharp'
// import { SpliteaError, ThrowSpliteaError } from "./errors"
// import { Image, ImageSchema, Size, SizeSchema, TileCoordinates } from "./types"

// export const getSize = async (image: Sharp): Promise<Size> => {
//   const { width, height } = await image.metadata()
//   return SizeSchema.parse({ width, height })
// }

// export const getImage = async (image: Image): Promise<[Sharp, Size]> => {
//   try {
//     ImageSchema.parse(image)
//     const img = sharp(image)
//     const { width, height } = await img.metadata()
//     const size: Size = SizeSchema.parse({ width, height })
//     return [img, size]
//   } catch (error) {
//     throw ThrowSpliteaError(error, `Error reading image ${image}`)
//   }
// }

// const getSplitImage = (image: Sharp, size: Size, tileCoordinates: TileCoordinates): Sharp => {
//   try {
//     const { width, height } = size
//     const { x, y, width: w, height: h } = tileCoordinates
//     if (x === 0 && w === width && y === 0 && h === height) return image
//     if ((x + w) > width) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max x value is ${width - 1}`)
//     if ((y + h) > height) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max y value is ${height - 1}`)
//     return image.clone().extract({ left: x, top: y, width: w, height: h })
//   } catch (error) {
//     throw ThrowSpliteaError(error, 'Problem spliting image')
//   }
// }

// export const getSplitImages = (image: Sharp, size: Size, tilesCoordinate: TileCoordinates[], unique: boolean = false): Sharp[] => {
//   const images = tilesCoordinate.map(tileCoordinates => getSplitImage(image, size, tileCoordinates))
//   if (unique && images.length > 1) { return getUniqueImages(images) }
//   return images
// }

// export const areEqualImages = (img1: Sharp, img2: Sharp): boolean => {
//   try {
//     const distance = Jimp.distance(img1, img2)
//     const diff = Jimp.diff(img1, img2)
//     if (distance < 0.15 && diff.percent < 0.15) {
//       console.debug(`distance = ${distance} | diff = ${diff.percent}`)
//       return true
//     }
//   } catch (error) {
//     console.log(error)
//     ThrowSpliteaError(error, 'Error comparing images')
//   }
//   return false
// }

// export const getUniqueImages = (images: Sharp[]): Sharp[] => {
//   let array = [...images]
//   let image: Sharp
//   let uniqueArray: Sharp[] = []
//   while (array.length) {
//     image = array[0]
//     uniqueArray.push(image)
//     array = array.filter(elem => !areEqualImages(image, elem))
//   }
//   return uniqueArray
// }

// const writeImage = async (image: Jimp, path: string, name: string, index: number | string, extension: string): Promise<string> => {
//   const filename = `${name}_${index}_${new Date().getTime()}.${extension}`
//   const file = Path.join(path, filename)
//   await image.writeAsync(file)
//   return file
// }

// export const writeImages = async (images: Jimp[], path: string, name: string, extension: string): Promise<string[]> => {
//   if (images.length < 1) throw new SpliteaError('Impossible to write no images')
//   if (images.length === 1) {
//     const filenames = await writeImage(images[0], path, name, '', extension)
//     return [filenames]
//   }
//   return Promise.all(
//     images.map(
//       async (image: Jimp, index: number) => await writeImage(image, path, name, index, extension)
//     )
//   )
// }

// export const getBufferImages = async (images: Jimp[]): Promise<Buffer[]> => {
//   try {
//     const buffers = await Promise.all(images.map(async (image: Jimp) => await image.getBufferAsync(image.getMIME())))
//     return buffers
//   } catch (error) {
//     ThrowSpliteaError(error, 'Impossible to get buffer from images')
//   }
//   return Promise.resolve([])
// }
