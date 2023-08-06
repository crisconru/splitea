import Jimp from "jimp"
import { Image, Size, VerticalTiles } from "../types"
import { SpliteaError, ThrowSpliteaError } from "../errors"
import { getSplitImage } from "../image"
import { isSubmultiple } from "../utils"

export const checkVerticalTiles = (tiles: VerticalTiles, size: Size): void => {
  const { rows, height } = tiles
  // At least Rows or Height is non zero
  if (rows === 0 && height === 0) {
    const msg = 'you need to provide one natural number, rows or height (px)'
    throw new SpliteaError(msg)
  }
  // Just Rows or Height but not both
  if (rows > 0 && height > 0) {
    throw new SpliteaError(`You have to enter rows or height, but not both`)
  }
  // Image Height is multiple of Rows
  if (rows > 0 && !isSubmultiple(size.height, rows)) {
    throw new SpliteaError(`rows (${rows}) have to be a submultiple of ${size.height} px`)
  }
  // Image Height is multiple of Height
  if (height > 0 && !isSubmultiple(size.height, height)) {
    throw new SpliteaError(`height (${height}px) submultiple of ${size.height} px`)
  }
}

export const getVerticalTiles = (image: Jimp, size: Size, tilesHeight: number, tilesRows: number): Image[] => {
  if (tilesHeight === 0 && tilesRows === 0) throw new SpliteaError('It needs to provide "rows" or "heigth"')
  if (tilesHeight > 0 && tilesRows > 0) throw new SpliteaError('It needs to provide "rows" or "heigth" but not both of them')
  try {
    const { width, height } = size
    const w = width
    const [h, tilesNumber] = tilesHeight === 0
      ? [height / tilesRows, tilesRows]
      : [tilesHeight, height / tilesHeight]
    const x = 0
    return new Array(tilesNumber).map((_, index) => {
      const y = h * index
      return getSplitImage(image, x, y, w, h)
    })
  } catch (error) {
    throw ThrowSpliteaError(error, 'Problem with getting vertical slices')
  }
}