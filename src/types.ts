
import Jimp from 'jimp'
import { z } from 'zod'

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
/** Tiles ---------------------------------------------------------------------
 * 1. Slice Mode -> mode => "grid" | "vertical" | "horizontal"
 * 2. Options for the slices
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 3. Non-repeated tiles -> unique => false (default) | true
*/
export const ModeSchema = z.enum(['horizontal', 'vertical', 'grid'])
export type Mode = z.infer<typeof ModeSchema>

export const TilesSchema = z.object({
  mode: ModeSchema,
  rows: NaturalOptionalSchema,
  columns: NaturalOptionalSchema,
  width: NaturalOptionalSchema,
  height: NaturalOptionalSchema,
  unique: BooleanOptionalSchema,
})
export type Tiles = z.infer<typeof TilesSchema>

export const HorizontalTilesSchema = TilesSchema.pick({ columns: true, width: true })
export type HorizontalTiles = z.infer<typeof HorizontalTilesSchema>
export const VerticalTilesSchema = TilesSchema.pick({ rows: true, height: true })
export type VerticalTiles = z.infer<typeof VerticalTilesSchema>
export const GridTilesSchema = TilesSchema.omit({ mode: true, unique: true })
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
// Other ----------------------------------------------------------------------
export const SizeSchema = z.object({
  width: NaturalSchema.positive(),
  height: NaturalSchema.positive()
})
export type Size = z.infer<typeof SizeSchema>

export const BufferSchema = z.instanceof(Buffer)

export const JimpSchema = z.instanceof(Jimp)

export const ImageSchema = z.union([StringSchema, BufferSchema])

export type Image = z.infer<typeof ImageSchema>
