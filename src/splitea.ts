import { Tiles, Output, Image } from './types'
import { getImage, getSplitImages } from './image'
import { checkTiles, getTilesCoordinates } from './tiles'
import { checkOutput, getOutput } from './output'

const Splitea = async (image: Image, tiles: Tiles, output: Output): Promise<Image[]> => {
  // 1. Check Image + Get the image
  const [img, size] = await getImage(image)
  // 2. Check arguments -> Tiles, Outputs
  checkTiles(tiles, size)
  checkOutput(output)
  // 3. everything is fine so get tiles and output
  const coordinates = getTilesCoordinates(size, tiles)
  const newTiles = getSplitImages(img, size, coordinates, tiles?.unique)
  const newOutput = await getOutput(newTiles, output)
  // 4. Return solution
  return newOutput
}

export default Splitea