import { SpliteaError } from "../errors"

export const parseData = (data: any): boolean => {
  const datas = [Data.Buffer, Data.Path]
  if (!datas.includes(data)) {
    throw new SpliteaError('Invalid output data, it should be "buffer" or "path"')
  }
  return true
}

export const parsePath = (path: any): boolean => {
  // Check if path is string
  if (!isString(path)) { throw new SpliteaError('path needs to be string') }
  // Check if path exist
  if (!existsSync(path as string | Buffer | URL)) { throw new SpliteaError(`Not exists path ${path as string}`) }
  // Check if can write
  try {
    accessSync(path as string | Buffer | URL, constants.W_OK)
  } catch (err) {
    throw throwError(err, `Problems parsing path ${String(path)}`)
  }
  return true
}

export const parseName = (name: any): boolean => {
  // Check if string
  if (!isString(name)) { throw new SpliteaError('name needs to be string') }
  // Check OS valid filename
  // Windows Regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
  const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/
  const invalidWindowsFilename = new RegExp(windowsReservedNameRegex, 'i')
  // All OS except Windows Regex = /[<>:"/\\|?*\u0000-\u001F]/g
  const filenameReservedRegex = '[<>:"/\\|?*\u0000-\u001F]'
  const invalidFilename = new RegExp(filenameReservedRegex, 'g')
  if (invalidFilename.test(name as string) || invalidWindowsFilename.test(name as string)) { throw new SpliteaError(`${String(name)} is not a valid filename`) }
  return true
}

export const parseExtension = (extension: any): boolean => {
  // Check if string
  if (!isString(extension)) { throw new SpliteaError('extension needs to be string') }
  // Check if valid extension
  const values = Object.values(Extension)
  if (!values.includes(extension)) { throw new SpliteaError(`${extension as string} needs to be one of this extensions -> ${values.toString()}`) }
  return true
}

const parseStore = (path: any, name: any, extension: any): boolean => {
  // Path
  if (path !== undefined) { parsePath(path) }
  // Name
  parseName(name)
  // Extension
  if (extension !== undefined) { parseExtension(extension) }
  return true
}

export const parseOutput = (output: any): boolean => {
  const { data, path, name, extension } = output
  // Data
  parseData(data)
  // Check if save => data = path
  if (data === 'path') {
    if (name === undefined) { throw new SpliteaError('"name" is required') }
    parseStore(path, name, extension)
  // Check if save => data = path || name != undefined
  } else if (name !== undefined) {
    parseStore(path, name, extension)
  }
  return true
}