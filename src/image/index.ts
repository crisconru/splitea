import Jimp from "jimp"
import { SpliteaError, throwError } from "../errors"
import { Image, Size } from "../types"


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

export const readImage = async (image: Image): Promise<[Jimp, Size]> => {
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
    throwError(error, 'Error comparing images')
  }
  return false
}