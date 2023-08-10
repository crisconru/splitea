import Jimp from "jimp"
import {
  HorizontalTilesSchema, VerticalTilesSchema, GridTilesSchema, 
  Mode, ModeSchema,
  Size,
  Tiles, TilesSchema, TileCoordinates
} from "../types"
import { checkHorizontalTiles, getHorizontalTiles } from "./horizontal"
import { checkVerticalTiles, getVerticalTiles } from "./vertical"
import { checkGridTiles, getGridTiles } from "./grid"
import { getSplitImages } from "../image"

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

const getTilesByMode = (size: Size, tiles: Tiles): TileCoordinates[] => {
  const { mode, width, height, columns, rows } = tiles
  // Horizontal
  if (mode === 'horizontal') { return getHorizontalTiles(size, width, columns) }
  // Vertical
  if (mode === 'vertical') { return getVerticalTiles(size, height, rows) }
  // Grid
  return getGridTiles(size, width, height, rows, columns)
}

export const getTiles = (img: Jimp, size: Size, tiles: Tiles): Jimp[] => {
  // Get coordinates
  const tilesCoordinates: TileCoordinates[] = getTilesByMode(size, tiles)
  // Get images
  return getSplitImages(img, tilesCoordinates, tiles.unique)
}
