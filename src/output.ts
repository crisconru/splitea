import { existsSync, accessSync, constants } from 'node:fs'
import { SpliteaError, ThrowSpliteaError } from "./errors"
import { ExtensionSchema, Image, Output, OutputSchema, StoreSchema } from "./types"
import Jimp from 'jimp'
import { getBufferImages, writeImages } from './image'

const checkPath = (path: string): void => {
  // Check if path exist
  if (!existsSync(path)) { throw new SpliteaError(`Not exists path ${path}`) }
  // Check if can write
  try {
    accessSync(path, constants.W_OK)
  } catch (err) {
    throw ThrowSpliteaError(err, `Problems parsing path ${path}`)
  }
}

const invalidWindowsFilename = (name: string): boolean => {
  // Windows Regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
  const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/
  const invalidWindowsFilename = new RegExp(windowsReservedNameRegex, 'i')
  return invalidWindowsFilename.test(name)
}

const invalidUnixFilename = (name: string): boolean => {
  // All OS except Windows Regex = /[<>:"/\\|?*\u0000-\u001F]/g
  const filenameReservedRegex = /[<>:"/\\|?*\u0000-\u001F]/
  const invalidFilename = new RegExp(filenameReservedRegex, 'g')
  return invalidFilename.test(name)
}

const checkName = (name: string): void => {
  // Check OS valid filename
  if (invalidUnixFilename(name) || invalidWindowsFilename(name)) {
    throw new SpliteaError(`Invalid filename -> ${name}`)
  }
}

export const checkOutput = (output: Output): void => {
  const { response, store } = OutputSchema.parse(output)
  if (response === 'path' || store !== undefined) {
    const { path, name } = StoreSchema.parse(store)
    checkPath(path)
    checkName(name)
  }
}

export const getOutput = async (images: Jimp[], output: Output): Promise<Image[]> => {
  if (images.length === 0) return []
  const { response, store } = output
  // Storage if neccessary
  if (store) {
    const { path, name, extension: ext } = store
    const extension = ext ?? ExtensionSchema.parse(images[0].getExtension())
    const paths = await writeImages(images, path, name, extension)
    // Response are paths
    if (response === 'path') return paths
  }
  // Luego devolver si es buffer o path
  const buffers =await getBufferImages(images)
  return buffers
}