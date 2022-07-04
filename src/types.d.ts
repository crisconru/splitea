
import Jimp from 'jimp/*'
import { Output } from './enums'

export type Image = string | Buffer | Jimp

export type Images = string[]
/**
 * 1. Modo de corte -> Cuadricula, vertical, horizontal
 * 2. Datos para el corte
 * 2.1 Grid -> n slices | width + height
 * 2.2 Vertical -> n slices | height
 * 2.3 Horizontal -> n slices | weidth
 * 3. No slices repetidas
 * 4. Que se devuelve -> Path | Buffer
 * 4.1 Path -> Se guardan las imagenes y
 *  se devuelve un array string con el path de cada slices
 * 4.2 Buffer -> No se guardan las imágenes y
 *  se devuelve un array Buffer con la data de cada slice
 **/

export interface Options {
  mode: Mode
  rows?: number
  columns?: number
  width?: number
  height?: number
  unique?: boolean
  output?: Output
  save?: boolean
  path?: string
  name?: string
  extension?: string
}

export interface Size {
  width: number
  height: number
}
