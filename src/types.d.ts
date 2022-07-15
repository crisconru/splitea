
import Jimp from 'jimp/*'
import { Data, Extension, Mode } from './enums'

export type Image = string | Buffer | Jimp

export interface Size {
  width: number
  height: number
}

/** Tiles
 * 1. Slice Mode -> mode => "grid" | "vertical" | "horizontal"
 * 2. Options for the slices
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 3. Non-repeated tiles -> unique => false (default) | true
*/

export interface Tiles {
  mode: Mode
  rows?: number
  columns?: number
  width?: number
  height?: number
  unique?: boolean
}

/**
 * 1. Data to return -> data => "buffer" | "path"
 * 2. If data = "path" or you want to store the slices it needs to provide path + name (extension is optional)
 * 2.1 Local path to store slices -> path
 * 2.2 Name preffix to slices -> name
 * 2.3 Extension to store tiles -> extension => "jpg" | "png" | "bmp" | "gif" | "tiff"
 **/

export interface Output {
  data: Data
  path?: string
  name?: string
  extension?: Extension
}
