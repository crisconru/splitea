import Jimp from "jimp"
import { GridTilesSchema, HorizontalTilesSchema, Image, Mode, ModeSchema, Size, Tiles, TilesSchema, VerticalTilesSchema } from "../types"
import { checkHorizontalTiles, getHorizontalTiles } from "./horizontal"
import { checkVerticalTiles, getVerticalTiles } from "./vertical"
import { checkGridTiles, getGridTiles } from "./grid"
import { SpliteaError } from "../errors"

const checkMode = (mode: Mode) => ModeSchema.parse(mode)

export const checkTiles = (tiles: Tiles, size: Size): void => {
  const { mode } = TilesSchema.parse(tiles)
  // Mode
  checkMode(mode)
  // Mode horizontal -> Columns || Width
  if (mode === 'horizontal') { checkHorizontalTiles(HorizontalTilesSchema.parse(tiles), size) }
  // Mode Vertical -> Rows || Height
  else if (mode === 'vertical') { checkVerticalTiles(VerticalTilesSchema.parse(tiles), size) }
  // Mode Grid -> rows + columns || width + height
  else if (mode === 'grid') { checkGridTiles(GridTilesSchema.parse(tiles), size) }
}

export const getTiles = (img: Jimp, size: Size, tiles: Tiles): Image[] => {
  if (tiles?.mode !== undefined) {
    let tmpSlices: Image[] = []
    const { width, height, columns, rows } = tiles
    // Horizontal
    if (tiles.mode === 'horizontal') { tmpSlices = getHorizontalTiles(img, size, width, columns) }
    // Vertical
    if (tiles.mode === 'vertical') { tmpSlices = getVerticalTiles(img, size, height, rows) }
    // Grid
    if (tiles.mode === 'grid') { tmpSlices = getGridTiles(img, size, width, height, rows, columns) }
    // Remove similars
    if (tmpSlices.length > 0) return (tiles.unique) ? uniqueTiles(tmpSlices as Jimp[]) : tmpSlices
    // Error
    throw new SpliteaError('Invalid mode')
  }
  throw new SpliteaError('No mode defined')
}
