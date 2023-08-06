import Jimp from "jimp"
import { Image, Size } from "../types"
import { getSplitImage } from "../image"
import { SpliteaError, throwError } from "../errors"
import { isSubmultiple } from "../utils"


export const checkModeGrid = (rows: number, columns: number, width: number, height: number, size: Size): void => {
  // At least Rows + Columns or Width + Height is non zero
  if (rows === 0 && columns === 0 && width === 0 && height === 0) {
    const msg = 'you need to provide two non zero natural numbers, columns + rows or height (px) + width (px)'
    throw new SpliteaError(msg)
  }
  // Image Width + Height are multiple of Columns + Rows
  if ( (rows > 0 && columns > 0) && !(isSubmultiple(size.height, rows) && isSubmultiple(size.width, columns)) ) {
    let msg = `rows (${rows}) have to be a submultiple of ${size.height} px\n`
    msg += `columns (${columns}) have to be a submultiple of ${size.width} px`
    throw new SpliteaError(msg)
  }
  // Image Width + Height are multiple of Width + Height
  if ( (width > 0 && height > 0) && !(isSubmultiple(size.width, width) && isSubmultiple(size.height, height)) ) {
    let msg = `width (${width}) have to be a submultiple of ${size.width} px\n`
    msg += `height (${height}) have to be a submultiple of ${size.height} px`
    throw new SpliteaError(msg)
  }
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