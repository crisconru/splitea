
import Jimp from 'jimp'
import { z } from 'zod'
import { MIN_DIFFERENCE, MIN_DISTANCE } from './constants'
import { isSubmultiple } from './utils'

export const BooleanSchema = z.boolean()
export type Boolean = z.infer<typeof BooleanSchema>
export const BooleanOptionalSchema = BooleanSchema.default(false)
export type BooleanOptional = z.infer<typeof BooleanOptionalSchema>

export const StringSchema = z.string()
export type String = z.infer<typeof StringSchema>
export const StringOptionalSchema = StringSchema.optional()
export type StringOptional = z.infer<typeof StringOptionalSchema>

export const NaturalSchema = z.number().int().nonnegative()
export type Natural = z.infer<typeof NaturalSchema>
export const NaturalOptionalSchema = NaturalSchema.default(0)
export type NaturalOptional = z.infer<typeof NaturalOptionalSchema>
// Image ----------------------------------------------------------------------
export const BufferSchema = z.instanceof(Buffer)

export const JimpSchema = z.instanceof(Jimp)

export const ImageSchema = z.union([StringSchema, BufferSchema])
export type Image = z.infer<typeof ImageSchema>

export const SizeSchema = z.object({
  width: NaturalSchema.positive(),
  height: NaturalSchema.positive()
})
export type Size = z.infer<typeof SizeSchema>
/** Tiles ---------------------------------------------------------------------
 * 1. Slice Mode -> mode => "grid" | "vertical" | "horizontal"
 * 2. Options for the slices
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 3. Non-repeated tiles -> unique => false (default) | true
*/
export const ModeSchema = z.union([z.literal('horizontal'),z.literal('vertical'), z.literal('grid')])
export type Mode = z.infer<typeof ModeSchema>

export const UniqueSchema = z.object({
  enable: z.boolean().default(false),
  distance: z.number().min(0).max(1).default(MIN_DISTANCE),
  difference: z.number().min(0).max(1).default(MIN_DIFFERENCE),
  requirement: z.union([z.literal('one'), z.literal('both')]).default('both').default('both')
})
export type Unique = z.infer<typeof UniqueSchema>

export const TilesSchema = z.object({
  mode: ModeSchema,
  rows: NaturalOptionalSchema,
  columns: NaturalOptionalSchema,
  width: NaturalOptionalSchema,
  height: NaturalOptionalSchema,
  unique: UniqueSchema.default({}),
})
export type Tiles = z.infer<typeof TilesSchema>

export const HorizontalTilesSchema = TilesSchema
  .pick({ columns: true, width: true })
  .extend({ size: SizeSchema })
  .superRefine((args, ctx) => {
    const { columns, width, size } = args
    if (columns === 0 && width === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least columns or width (px)'
      })
    }
    if (columns > 0 && width > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide columns or width (px), not both'
      })
    }
    if (columns > 0 && !isSubmultiple(size.width, columns)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `columns (${columns}) have to be a submultiple of ${size.width} px`
      })
    }
    if (width > 0 && !isSubmultiple(size.width, width)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `width (${width}px) have to be a submultiple of ${size.width} px`
      })
    }
  })
export type HorizontalTiles = z.infer<typeof HorizontalTilesSchema>

export const VerticalTilesSchema = TilesSchema
  .pick({ rows: true, height: true })
  .extend({ size: SizeSchema })
  .superRefine((args, ctx) => {
    const { rows, height, size } = args
    if (rows === 0 && height === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least one, rows or height (px)'
      })
    }
    if (rows > 0 && height > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide rows or height (px), not both'
      })
    }
    if (rows > 0 && !isSubmultiple(size.height, rows)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `rows (${rows}) have to be a submultiple of ${size.height} px`
      })
    }
    if (height > 0 && !isSubmultiple(size.width, height)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `height (${height}px) have to be a submultiple of ${size.height} px`
      })
    }
  })
export type VerticalTiles = z.infer<typeof VerticalTilesSchema>

export const GridTilesSchema = TilesSchema
  .omit({ mode: true, unique: true })
  .extend({ size: SizeSchema })
  .superRefine((args, ctx) => {
    const { rows, columns, width, height, size } = args
    if (rows === 0 && columns === 0 && width === 0 && height === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide a pair columns + rows or height (px) + width (px)'
      })
    }
    if (rows > 0 && height > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Provide rows or height, but not both`
      })
    }
    // Just Columns or Width but not both
    if (columns > 0 && width > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Provide columns or width, but not both`
      })
    }
    // Just Rows + Columns
    if ((rows > 0 && columns > 0) && (width > 0 || height > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `If you entered rows + columns, width and height don't have to be entered`
      })
    }
    // Just Width + Height
    if ((width > 0 && height > 0) && (rows > 0 || columns > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `If you entered width + height, rows and columns don't have to be entered`
      })
    }
    // Image Width + Height are multiple of Columns + Rows
    if ( (rows > 0 && columns > 0) && !( isSubmultiple(size.height, rows) && isSubmultiple(size.width, columns) ) ) {
      let msg = `rows (${rows}) have to be a submultiple of ${size.height} px\n`
      msg += `columns (${columns}) have to be a submultiple of ${size.width} px`
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg
      })
    }
    // Image Width + Height are multiple of Width + Height
    if ( (width > 0 && height > 0) && !( isSubmultiple(size.width, width) && isSubmultiple(size.height, height ) ) ) {
      let msg = `width (${width}) have to be a submultiple of ${size.width} px\n`
      msg += `height (${height}) have to be a submultiple of ${size.height} px`
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg
      })
    }
  })
export type GridTiles = z.infer<typeof GridTilesSchema>

export const TileCoordinatesSchema = z.object({
  x: NaturalSchema,
  y: NaturalSchema,
  width: NaturalSchema,
  height: NaturalSchema
})
export type TileCoordinates = z.infer<typeof TileCoordinatesSchema>
/** Output --------------------------------------------------------------------
 * 1. response = data to return -> data => "buffer" | "path"
 * 2. If response = "path" or you want to store the slices it needs to provide path + name (extension is optional)
 * 2.1 Local path to store slices -> path
 * 2.2 Name preffix to slices -> name
 * 2.3 Extension to store tiles -> extension => "jpg" | "png" | "bmp" | "gif" | "tiff"
 **/
export const ResponseSchema = z.enum(['buffer', 'path'])
export type Data = z.infer<typeof ResponseSchema>

export const ExtensionSchema = z.enum(['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff'])
export type Extension = z.infer<typeof ExtensionSchema>
export const ExtensionOptionalSchema = ExtensionSchema.optional()
export type ExtensionOptional = z.infer<typeof ExtensionOptionalSchema>

export const StoreSchema = z.object({
  path: StringSchema,
  name: StringSchema,
  extension: ExtensionOptionalSchema
})
export type Store = z.infer<typeof StoreSchema>

export const OutputSchema = z.object({
  response: ResponseSchema.default('buffer'),
  store: StoreSchema.optional()
})
export type Output = z.infer<typeof OutputSchema>
