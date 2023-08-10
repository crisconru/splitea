import Jimp from "jimp"
import { SpliteaError, ThrowSpliteaError } from "./errors"
import { Image, ImageSchema, Size, SizeSchema, TileCoordinates } from "./types"

export const readImage = async (image: Image): Promise<[Jimp, Size]> => {
  try {
    ImageSchema.parse(image)
    const img = await Jimp.read(image)
    const size: Size = SizeSchema.parse({ width: img.bitmap.width, height: img.bitmap.height })
    return [img, size]
  } catch (error) {
    throw ThrowSpliteaError(error, `Error reading image ${image}`)
  }
}

const getSplitImage = (image: Jimp, tileCoordinates: TileCoordinates): Jimp => {
  try {
    const { width, height } = image.bitmap
    const { x, y, width: w, height: h } = tileCoordinates
    if (x === 0 && w === width && y === 0 && h === height) return image
    if ((x + w) > width) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max x value is ${width - 1}`)
    if ((y + h) > height) throw new SpliteaError(`Can't have an image of ${w}x${h}px from (${x}, ${y}) because max y value is ${height - 1}`)
    return image.clone().crop(x, y, w, h)
  } catch (error) {
    throw ThrowSpliteaError(error, 'Problem spliting image')
  }
}

export const getSplitImages = (image: Jimp, tilesCoordinate: TileCoordinates[], unique: boolean = false): Jimp[] => {
  const images = tilesCoordinate.map(tileCoordinates => getSplitImage(image, tileCoordinates))
  if (unique && images.length > 1) { return getUniqueImages(images) }
  return images
}

export const areEqualImages = (img1: Jimp, img2: Jimp): boolean => {
  try {
    const distance = Jimp.distance(img1, img2)
    const diff = Jimp.diff(img1, img2)
    if (distance < 0.15 && diff.percent < 0.15) {
      console.log(`distance = ${distance} | diff = ${diff.percent}`)
      return true
    }
  } catch (error) {
    console.log(error)
    ThrowSpliteaError(error, 'Error comparing images')
  }
  return false
}

export const getUniqueImages = (images: Jimp[]): Jimp[] => {
  let array = [...images ]
  let image: Jimp
  let uniqueArray: Jimp[] = []
  while (array.length) {
    image = array[0]
    uniqueArray.push(image)
    array = array.filter(elem => !areEqualImages(image, elem))
  }
  return uniqueArray
}

// const writeImage = (image: Jimp, path: string, name: string, index: number, extension: string): string => {
//   const filename = `${name}_${index}_${new Date().getTime()}${extension}`
//   image.write(filename)
//   return filename
// }
