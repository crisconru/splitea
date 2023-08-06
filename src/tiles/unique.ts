import Jimp from "jimp"
import { SpliteaError } from "../errors"
import { areEqualImages } from "../image"


export const parseUnique = (tiles: any): boolean => {
  if (tiles.unique !== undefined && typeof tiles.unique !== 'boolean') {
    throw new SpliteaError('unique property should be boolean, only admits true or false value')
  }
  return true
}

export const uniqueTiles = (imgs: Jimp[]): Jimp[] => {
  if (imgs.length === 0) return []
  if (imgs.length === 1) return [structuredClone(imgs[0])]
  const unique = imgs[0]
  const arr = imgs.slice(1).filter(elem => !areEqualImages(unique, elem))
  return [unique, ...uniqueTiles(arr)]
}
