
import Jimp from 'jimp/*'
import { Data, Extension } from './enums'

export type Image = string | Buffer | Jimp

export type Images = string[]

export interface Size {
  width: number
  height: number
}

export interface Tile {
  rows?: number
  columns?: number
  width?: number
  height?: number
  unique?: boolean
}

export interface Output {
  data: Data
  path?: string
  name?: string
  extension?: Extension
}

/**
 * 1. Slice Mode -> mode => grid | vertical | horizontal
 * 2. Data for the slices -> tiles
 * 2.1 Grid tiles -> rows + columns | width + height
 * 2.2 Vertical tiles -> rows | height
 * 2.3 Horizontal tiles -> columns | width
 * 2.4 Non-repeated tiles -> unique => true | false
 * 3. Output info -> output
 * 3.1 Data to return -> data => buffer | path
 *     If data is path or you want to store the slices it needs to provide more properties
 * 3.2 Local path to store slices -> path
 * 3.3 Name preffix to slices -> name
 * 3.4 Extension to slices -> extension => jpg | png | bmp | gif | tiff
 **/

export interface Options {
  mode: Mode
  tiles?: Tile
  output?: Output
}
