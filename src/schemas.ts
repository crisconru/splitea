import fs from 'node:fs'
import * as v from 'valibot'
import Jimp from 'jimp'
import { MAX_DIFFERENCE, MAX_DISTANCE, MODES } from './constants'
import { greaterThanZero, invalidFilename, isSubmultiple, xor } from './utils'

export const BooleanSchema = v.boolean()
export const StringSchema = v.string()
export const NaturalSchema = v.number([v.integer(), v.minValue(0)])

// Image ----------------------------------------------------------------------
export const BufferSchema = v.instance(Buffer)
export const JimpSchema = v.instance(Jimp)

export const ImageExistsSchema = v.string([
  v.custom((file) => fs.existsSync(file), 'This image does not exists')
])

export const ImageSchema = v.union([ImageExistsSchema, BufferSchema])

export const SizeSchema = v.object({
  width: NaturalSchema,
  height: NaturalSchema,
})
/** Tiles ---------------------------------------------------------------------
 * 1. Slice Mode -> mode => "grid" | "vertical" | "horizontal"
 * 2. Options for the slices
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 3. Non-repeated tiles -> unique => false (default) | true
*/
export const ModeSchema = v.picklist(MODES)

export const UniqueSchema = v.object({
  // enable: v.fallback(BooleanSchema, false),
  distance: v.fallback(v.number([v.minValue(0), v.maxValue(1)]), MAX_DISTANCE),
  difference: v.fallback(v.number([v.minValue(0), v.maxValue(1)]), MAX_DIFFERENCE),
  requirement: v.fallback(v.picklist(['one', 'both']), 'both')
})

export const TilesSchema = v.object({
  mode: ModeSchema,
  rows: v.optional(NaturalSchema),
  columns: v.optional(NaturalSchema),
  width: v.optional(NaturalSchema),
  height: v.optional(NaturalSchema),
  unique: v.optional(UniqueSchema),
})

export const HorizontalTilesSchema = v.object(
  {
    columns: v.fallback(NaturalSchema, 0),
    width: v.fallback(NaturalSchema, 0),
    size: SizeSchema
  },
  [
    v.custom(({ columns, width }) => [columns, width].some(greaterThanZero), 'Provide columns or width (px)'),
    v.custom(({ columns, width }) => xor(Boolean(columns), Boolean(width)), 'Provide columns or width (px), not both'),
    v.custom(({ columns, width, size }) => {
      if (columns > 0) return isSubmultiple(size.width, columns)
      if (width > 0) return isSubmultiple(size.width, width)
      return false
    }, 'Provided columns or width has to be a submultiple of image width'),
  ]
)

export const VerticalTilesSchema = v.object(
  {
    rows: v.fallback(NaturalSchema, 0),
    height: v.fallback(NaturalSchema, 0),
    size: SizeSchema
  },
  [
    v.custom(({ rows, height }) => [rows, height].some(greaterThanZero), 'Provide rows or height (px)'),
    v.custom(({ rows, height }) => xor(Boolean(rows), Boolean(height)), 'Provide rows or height (px), not both'),
    v.custom(({ rows, height, size }) => {
      if (rows > 0) return isSubmultiple(size.height, rows)
      if (height > 0) return isSubmultiple(size.height, height)
      return false
    }, 'Provided rows or height has to be a submultiple of image height'),
  ]
)

export const GridTilesSchema = v.object(
  {
    columns: v.fallback(NaturalSchema, 0),
    rows: v.fallback(NaturalSchema, 0),
    width: v.fallback(NaturalSchema, 0),
    height: v.fallback(NaturalSchema, 0),
    size: SizeSchema
  },
  [
    v.custom(({ columns, rows, width, height }) => [columns, rows, width, height].some(greaterThanZero), 'Provide columns-rows or height-width (px)'),
    v.custom(({ columns, rows, width, height }) => xor( [columns, rows].some(greaterThanZero), [width, height].some(greaterThanZero) ) , 'Provide columns-rows or height-width (px), not both'),
    v.custom(({ columns, rows, size }) => {
      if ([columns, rows].every(greaterThanZero)) return isSubmultiple(size.width, columns) && isSubmultiple(size.height, rows)
      return true
    }, 'Provided columns-rows have to be a submultiple of image width-height'),
    v.custom(({ width, height, size }) => {
      if ([width, height].every(greaterThanZero)) return isSubmultiple(size.width, width) && isSubmultiple(size.height, height)
      return true
    }, 'Provided width-height have to be a submultiple of image width-height'),
    // v.custom(({ columns, rows, width, height, size }) => {
    //   if ([columns, rows].every(greaterThanZero)) return isSubmultiple(size.width, columns) && isSubmultiple(size.height, rows)
    //   if ([width, height].every(greaterThanZero)) return isSubmultiple(size.width, width) && isSubmultiple(size.height, height)
    //   return false
    // }, 'Provided columns-rows or width-height have to be a submultiple of image width-height'),
  ]
)

export const TilesCutSchema = v.object(
  {
    tileWidth: NaturalSchema,
    tileHeight: NaturalSchema,
    imageWidth: NaturalSchema,
    imageHeight: NaturalSchema,
  },
  [
    v.custom(({ tileWidth, imageWidth }) => tileWidth <= imageWidth, 'tileWidth cannot be bigger than imageWidth'),
    v.custom(({ tileWidth, imageWidth }) => isSubmultiple(imageWidth, tileWidth), 'tileWidth has to be a submultiple of imageWidth'),
    v.custom(({ tileHeight, imageHeight }) => tileHeight <= imageHeight, 'tileHeight cannot be bigger than imageHeight'),
    v.custom(({ tileHeight, imageHeight }) => isSubmultiple(imageHeight, tileHeight), 'tileHeight has to be a submultiple of imageHeight'),
  ]
)

export const TileCoordinatesSchema = v.object({
  x: NaturalSchema,
  y: NaturalSchema,
  width: NaturalSchema,
  height: NaturalSchema
})
/** Output --------------------------------------------------------------------
 * 1. response = data to return -> data => "buffer" | "path"
 * 2. If response = "path" or you want to store the slices it needs to provide path + name (extension is optional)
 * 2.1 Local path to store slices -> path
 * 2.2 Name preffix to slices -> name
 * 2.3 Extension to store tiles -> extension => "jpg" | "png" | "bmp" | "gif" | "tiff"
**/
export const ResponseSchema = v.picklist(['buffer', 'path'])

export const PathSchema = v.string([
  // v.custom((input: string) => !invalidFilename(input), 'Invalid name for a path'),
  v.custom(
    (input: string) => {
      try {
        if (!fs.existsSync(input)) {
          fs.mkdirSync(input)
        }
        return true
      } catch (error) {
        return false
      }
    },
    'Cannot create the path provided'
  ),
  v.custom(
    (input: string) => {
      try {
        fs.accessSync(input, fs.constants.W_OK)
        return true
      } catch (error) {
        return false
      }
    },
    'path provided doesn\'t have write permissions'
  )
])

export const FilenameSchema = v.string([
  v.custom((input: string) => !invalidFilename(input), 'Invalid filename'),
])

export const ExtensionSchema = v.picklist([
  'jpg', 'jpeg',
  'png', 'bmp',
  'gif', 'tiff'
])

export const StoreSchema = v.object({
  path: PathSchema,
  name: FilenameSchema,
  extension: v.optional(ExtensionSchema)
})

export const OutputSchema = v.object(
  {
    response: v.fallback(ResponseSchema, 'buffer'),
    store: v.optional(StoreSchema)
  },
  [
    v.custom(
      ({ response, store }) => (response === 'path') ? store !== undefined : true
      , 'To response with path, store argument has to be passed'
    ),
    v.custom(
      ({ store }) => (store !== undefined) ? v.safeParse(StoreSchema, store).success : true
      , 'Invalid store property'
    ),
  ]
)
