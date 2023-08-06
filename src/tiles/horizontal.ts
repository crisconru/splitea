import Jimp from "jimp"
import { HorizontalTiles, Image, Size } from "../types"
import { SpliteaError, ThrowSpliteaError } from "../errors"
import { getSplitImage } from "../image"
import { isSubmultiple } from "../utils"

export const checkHorizontalTiles = (tiles: HorizontalTiles, size: Size): void => {
  const { columns, width } = tiles
  // At least Columns or Width is non zero
  if (columns === 0 && width === 0) {
    const msg = 'you need to provide one natural number, columns or width (px)'
    throw new SpliteaError(msg)
  }
  // Just Columns or Width but not both
  if (columns > 0 && width > 0) {
    throw new SpliteaError(`You have to enter columns or width, but not both`)
  }
  // Image Width is multiple of Columns
  if (columns > 0 && !isSubmultiple(size.width, columns)) {
    throw new SpliteaError(`columns (${columns}) have to be a submultiple of ${size.width} px`)
  }
  // Image Width is multiple of Width
  if (width > 0 && !isSubmultiple(size.width, width)) {
    throw new SpliteaError(`width (${width}px) have to be a submultiple of ${size.width} px`)
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
    throw ThrowSpliteaError(error, 'Problem with getting horizontal slices')
  }
}