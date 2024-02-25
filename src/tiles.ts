import * as v from 'valibot'
import {
  Size,
  Tiles,
  HorizontalTiles,
  VerticalTiles,
  GridTiles,
  TilesCut,
  TileCoordinates,
} from "./types"
import { ThrowSpliteaError } from "./errors"
import { GridTilesSchema, HorizontalTilesSchema, TileCoordinatesSchema, TilesCutSchema, TilesSchema, VerticalTilesSchema } from './schemas'

export const checkTiles = (tiles: Tiles, size: Size): void => {
  const { mode } = v.parse(TilesSchema, tiles)
  const parser = {
    // Mode horizontal -> Columns || Width
    'horizontal': HorizontalTilesSchema,
    // Mode Vertical -> Rows || Height
    'vertical': VerticalTilesSchema,
    // Mode Grid -> rows + columns || width + height
    'grid': GridTilesSchema
  }
  v.parse(parser[mode], { ...tiles, size })
}

const getCoordinates = (tilesCut: TilesCut): TileCoordinates[] => {
  try {
    const { tileWidth, tileHeight, imageWidth, imageHeight } = tilesCut
    const arrayX = new Array(imageWidth / tileWidth).fill(0)
    const arrayY = new Array(imageHeight / tileHeight).fill(0)
    // Move by row
    return arrayY.map((_y, indexY) => {
      const y = tileHeight * indexY
      // Move by column
      return arrayX.map((_x, indexX) => {
        const x = tileWidth * indexX
        return v.parse(TileCoordinatesSchema, { x, y, width: tileWidth, height: tileHeight })
      })
    }).flat()
  } catch (error) {
    throw ThrowSpliteaError(error, 'Problem with getting tiles')
  }
}

const getHorizontalTiles = (tiles: HorizontalTiles): TileCoordinates[] => {
  const { width , columns, size } = v.parse(HorizontalTilesSchema, tiles)
  const tilesCut = v.parse(TilesCutSchema, {
    tileWidth: (width > 0) ? width : size.width / columns,
    tileHeight: size.height,
    imageWidth: size.width,
    imageHeight: size.height,
  })
  return getCoordinates(tilesCut)
}

const getVerticalTiles = (tiles: VerticalTiles): TileCoordinates[] => {
  const { height, rows, size } = v.parse(VerticalTilesSchema, tiles)
  const tilesCut = v.parse(TilesCutSchema, {
    tileWidth: size.width,
    tileHeight: (height > 0) ? height : size.height / rows,
    imageWidth: size.width,
    imageHeight: size.height,
  })
  return getCoordinates(tilesCut)
}

const getGridTiles = (tiles: GridTiles): TileCoordinates[] => {
  const { width, height, rows, columns, size } = v.parse(GridTilesSchema, tiles)
  const tilesCut = v.parse(TilesCutSchema, {
    tileWidth: (width > 0) ? width : size.width / columns,
    tileHeight: (height > 0) ? height : size.height / rows,
    imageWidth: size.width,
    imageHeight: size.height,
  })
  return getCoordinates(tilesCut)
}

export const getTilesCoordinates = (size: Size, tiles: Tiles): TileCoordinates[] => {
  if (tiles.mode === 'horizontal') return getHorizontalTiles({ ...tiles, size } as HorizontalTiles)
  if (tiles.mode === 'vertical') return getVerticalTiles({ ...tiles, size } as VerticalTiles)
  return getGridTiles({ ...tiles, size } as GridTiles)
}
