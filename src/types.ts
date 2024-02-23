import * as v from 'valibot'
import { ExtensionSchema, FilenameSchema, GridTilesSchema, HorizontalTilesSchema, ImageSchema, ModeSchema, NaturalSchema, OutputSchema, PathSchema, ResponseSchema, SizeSchema, StoreSchema, TileCoordinatesSchema, TilesCutSchema, TilesSchema, UniqueSchema, VerticalTilesSchema } from './schemas'

export type Natural = v.Input<typeof NaturalSchema>
// Image ----------------------------------------------------------------------
export type Image = v.Input<typeof ImageSchema>
export type Size = v.Input<typeof SizeSchema>
/** Tiles ---------------------------------------------------------------------
 * 1. Slice Mode -> mode => "grid" | "vertical" | "horizontal"
 * 2. Options for the slices
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 3. Non-repeated tiles -> unique => false (default) | true
*/
export type Mode = v.Input<typeof ModeSchema>

export type Unique = v.Output<typeof UniqueSchema>

export type Tiles = v.Output<typeof TilesSchema>

export type HorizontalTiles = v.Output<typeof HorizontalTilesSchema>

export type VerticalTiles = v.Output<typeof VerticalTilesSchema>

export type GridTiles = v.Output<typeof GridTilesSchema>

export type TilesCut = v.Output<typeof TilesCutSchema>

export type TileCoordinates = v.Output<typeof TileCoordinatesSchema>
/** Output --------------------------------------------------------------------
 * 1. response = data to return -> data => "buffer" | "path"
 * 2. If response = "path" or you want to store the slices it needs to provide path + name (extension is optional)
 * 2.1 Local path to store slices -> path
 * 2.2 Name preffix to slices -> name
 * 2.3 Extension to store tiles -> extension => "jpg" | "png" | "bmp" | "gif" | "tiff"
 **/
export type Response = v.Input<typeof ResponseSchema>

export type Path = v.Input<typeof PathSchema>

export type Filename = v.Input<typeof FilenameSchema>

export type Extension = v.Input<typeof ExtensionSchema>

export type Store = v.Input<typeof StoreSchema>

export type Output = v.Output<typeof OutputSchema>
