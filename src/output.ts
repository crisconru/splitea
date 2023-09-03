import { ExtensionSchema, Image, Output, OutputSchema } from "./types"
import Jimp from 'jimp'
import { getBufferImages, writeImages } from './image'


export const checkOutput = (output: Output): void => {
  OutputSchema.parse(output)
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