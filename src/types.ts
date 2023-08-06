
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
// Modes Parser
export const HorizontalSchema = TilesSchema.pick({ columns: true, width: true })
export const VerticalSchema = TilesSchema.pick({ rows: true, height: true })
export const GridSchema = TilesSchema.pick({ rows: true, height: true })

/**
 * 1. Data to return -> data => "buffer" | "path"
 * 2. If data = "path" or you want to store the slices it needs to provide path + name (extension is optional)
 * 2.1 Local path to store slices -> path
 * 2.2 Name preffix to slices -> name
 * 2.3 Extension to store tiles -> extension => "jpg" | "png" | "bmp" | "gif" | "tiff"
 **/
export const DataSchema = z.enum(['buffer', 'path'])
export type Data = z.infer<typeof DataSchema>

export const ExtensionSchema = z.enum(['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff'])
export type Extension = z.infer<typeof ExtensionSchema>
export const ExtensionOptionalSchema = ExtensionSchema.optional()
export type ExtensionOptional = z.infer<typeof ExtensionOptionalSchema>

export const OutputSchema = z.object({
  data: DataSchema,
  path: StringOptionalSchema,
  name: StringOptionalSchema,
  extension: ExtensionOptionalSchema
})
export type Output = z.infer<typeof OutputSchema>

export const SizeSchema = z.object({
  width: NaturalSchema.positive(),
  height: NaturalSchema.positive()
})
export type Size = z.infer<typeof SizeSchema>

export const BufferSchema = z.instanceof(Buffer)

export const JimpSchema = z.instanceof(Jimp)

export type Image = z.infer<typeof BufferSchema>
