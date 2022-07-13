import Jimp from 'jimp'
import { SpliteaError, throwError } from './errors'
import { Size, Images, Tiles, Output } from './types'
import { parseOutput, parseTiles } from './utils'

export const getSize = async (IMG: string): Promise<Size> => {
  try {
    const img = await Jimp.read(IMG)
    const { width, height } = img.bitmap
    return { width, height }
  } catch (error) {
    console.log('Error Splitea')
    console.log(error)
    throw new SpliteaError('Invalid dimensions')
  }
}

export const readImage = async (image: string): Promise<Jimp> => {
  try {
    return await Jimp.read(image)
  } catch (error) {
    throw throwError(error)
  }
}

export const Splitea = async (image: string, tiles?: Tiles, output?: Output): Promise<Images | undefined | never> => {
  try {
    // Leer la imagen
    const img = await readImage(image)
    const size: Size = { width: img.bitmap.width, height: img.bitmap.height }
    // Comprobar que las tiles son correctas
    if (!parseTiles(tiles, size)) { throw new SpliteaError('Bad tiles options') }
    // Comprobar que el output es correcto
    if (!parseOutput(output)) { throw new SpliteaError('Bad output options') }
    // Obtener las imagenes cortadas
    // Quitar las iguales
    // Guardar las fotos
    // Devolver los nombres de las imagenes
    return await Promise.resolve(['hioo', 'hgjkg'])
  } catch (error) {
    throw throwError(error)
  }
}
