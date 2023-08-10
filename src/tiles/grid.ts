import { GridTiles, Size, TileCoordinates, TileCoordinatesSchema } from "../types"
import { SpliteaError, ThrowSpliteaError } from "../errors"
import { isSubmultiple } from "../utils"

const checkNonZero = (tiles: GridTiles): void => {
  const { rows, columns, width, height } = tiles
  if (rows === 0 && columns === 0 && width === 0 && height === 0) {
    const msg = 'you need to provide two non zero natural numbers, columns + rows or height (px) + width (px)'
    throw new SpliteaError(msg)
  }
}

const checkRowsColumsOrWidthHeight = (tiles: GridTiles): void => {
  const { rows, columns, width, height } = tiles
  // Just Rows or Height but not both
  if (rows > 0 && height > 0) {
    throw new SpliteaError(`You have to enter rows or height, but not both`)
  }
  // Just Columns or Width but not both
  if (columns > 0 && width > 0) {
    throw new SpliteaError(`You have to enter columns or width, but not both`)
  }
  // Just Rows + Columns
  if ((rows > 0 && columns > 0) && (width > 0 || height > 0)) {
    throw new SpliteaError(`If you entered rows + columns, width and height don't have to be entered`)
  }
  // Just Width + Height
  if ((width > 0 && height > 0) && (rows > 0 || columns > 0)) {
    throw new SpliteaError(`If you entered width + height, rows and columns don't have to be entered`)
  }
}

export const checkGridTiles = (tiles: GridTiles, size: Size): void => {
  const { rows, columns, width, height } = tiles
  // At least Rows + Columns or Width + Height is non zero
  checkNonZero(tiles)
  // Just Rows + Columns or Width + Height but bot both
  checkRowsColumsOrWidthHeight(tiles)
  // Image Width + Height are multiple of Columns + Rows
  if ((rows > 0 && columns > 0) && !(isSubmultiple(size.height, rows) && isSubmultiple(size.width, columns))) {
    let msg = `rows (${rows}) have to be a submultiple of ${size.height} px\n`
    msg += `columns (${columns}) have to be a submultiple of ${size.width} px`
    throw new SpliteaError(msg)
  }
  // Image Width + Height are multiple of Width + Height
  if ((width > 0 && height > 0) && !(isSubmultiple(size.width, width) && isSubmultiple(size.height, height))) {
    let msg = `width (${width}) have to be a submultiple of ${size.width} px\n`
    msg += `height (${height}) have to be a submultiple of ${size.height} px`
    throw new SpliteaError(msg)
  }
}

export const getGridTiles = (size: Size, tilesWidth: number, tilesHeight: number, tilesRows: number, tilesColumns: number): TileCoordinates[] => {
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
        return TileCoordinatesSchema.parse({ x, y, width: w, height: h })
      })
    }).flat()
  } catch (error) {
    throw ThrowSpliteaError(error, 'Problem with getting grid slices')
  }
}