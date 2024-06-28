import { DifferenceSchema, DistanceSchema, ExtensionSchema, FilenameSchema, GridOptionsSchema, HorizontalOptionsSchema, ImageSchema, NaturalSchema, OptionsSchema, PathSchema, ResponseSchema, UniqueRequirementSchema, VerticalOptionsSchema } from './schemas'

// PRIMITIVES -----------------------------------------------------------------
export type Natural = ReturnType<typeof NaturalSchema.parse>
// IMAGE ----------------------------------------------------------------------
export type Image = ReturnType<typeof ImageSchema.parse>
export interface Size {
  width: Natural
  height: Natural
}
// OPTIONS --------------------------------------------------------------------
export type Response = ReturnType<typeof ResponseSchema.parse>
export type Path = ReturnType<typeof PathSchema.parse>
export type Filename = ReturnType<typeof FilenameSchema.parse>
export type Extension = ReturnType<typeof ExtensionSchema.parse>
export type UniqueRequirement = ReturnType<typeof UniqueRequirementSchema.parse>
export type Distance = ReturnType<typeof DistanceSchema.parse>
export type Difference = ReturnType<typeof DifferenceSchema.parse>

export type Options = ReturnType<typeof OptionsSchema.parse>
export type HorizontalOptions = ReturnType<typeof HorizontalOptionsSchema.parse>
export type VerticalOptions = ReturnType<typeof VerticalOptionsSchema.parse>
export type GridOptions = ReturnType<typeof GridOptionsSchema.parse>

export interface UniqueImagesOptions {
  requirement: UniqueRequirement
  distance: Distance
  difference: Difference
}

export interface StoreOptions {
  path: Path
  filename: Filename
  extension: Extension
}

export interface CropData {
  x: Natural
  y: Natural
  w: Natural
  h: Natural
}

export interface WriteOptions {
  path: string
  filename: string
  extension: string
  index: string
  pad: number
}

export type Output = string | Buffer
