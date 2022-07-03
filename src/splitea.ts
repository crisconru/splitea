// import path from 'path'
import Jimp from 'jimp'
import { SpliteaError, throwError } from './errors'
import { Size, Options, Images } from './types'
import { parseOptions } from './utils'

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
    console.error('Problem reading image')
    throw new SpliteaError(String(error))
  }
}

export const Splitea = async (image: string, options?: Options): Promise<Images | undefined | never> => {
  try {
    // Leer la imagen
    const img = await readImage(image)
    const size: Size = { width: img.bitmap.width, height: img.bitmap.height }
    // Comprobar que las opciones son correctas
    if (!parseOptions(options, size)) { throw new SpliteaError('Bad options') }
    // Obtener las imagenes cortadas
    // Quitar las iguales
    // Guardar las fotos
    // Devolver los nombres de las imagenes
    return await Promise.resolve(['hioo', 'hgjkg'])
  } catch (error) {
    throw throwError(error)
  }
}
