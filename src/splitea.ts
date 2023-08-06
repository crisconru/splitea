import Jimp from 'jimp'
import { throwError } from './errors'
import { Tiles, Output, Image } from './types'
import { readImage } from './image'
import { getTiles, checkTiles } from './tiles'
import { parseOutput } from './output'


export const Splitea = async (image: Image, tiles: Tiles, output?: Output): Promise<Image[] | undefined> => {
  try {
    // 1. Check arguments (Image) + Get the image
    const [img, size] = await readImage(image)
    // 2. Check arguments -> Tiles, Outputs
    checkTiles(tiles, size)
    parseOutput(output)
    // 3. Get the tiles
    const newTiles = getTiles(img, size, tiles) as Jimp[]
    // 4. Get the output
    // 5. Return solution
    // Check tiles options
    // Check output options
    const slices = newTiles
    return await Promise.resolve(slices)
  } catch (error) {
    throw throwError(error, 'Problems with Splitea')
  }
}
