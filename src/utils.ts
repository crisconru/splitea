import * as v from 'valibot'
import { NaturalSchema } from './schemas'
import { Natural } from './types'
// import  isValidFilename from 'valid-filename'

export const greaterThanZero = (num: Natural): boolean => num > 0
export const xor = (a: boolean, b: boolean): boolean => ( a && !b ) || ( !a && b )

export const isSubmultiple = (numerator: number, denominator: number): boolean => (v.parse(NaturalSchema, numerator) % v.parse(NaturalSchema, denominator)) === 0

export const invalidWindowsFilename = (name: string): boolean => {
  // Windows Regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
  const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/
  const invalidWindowsFilename = new RegExp(windowsReservedNameRegex, 'i')
  const result = invalidWindowsFilename.test(name)
  if (result) console.error(`Invalid windows filename ${name}`)
  return result
}

export const invalidUnixFilename = (name: string): boolean => {
  // All OS except Windows Regex = /[<>:"/\\|?*\u0000-\u001F]/g
  const filenameReservedRegex = /[<>:"/\\|?*\u0000-\u001F]/
  const invalidFilename = new RegExp(filenameReservedRegex, 'g')
  const result = invalidFilename.test(name)
  if (result) console.error(`Invalid unix filename ${name}`)
  return result
}

export const invalidFilename = (name: string): boolean => invalidUnixFilename(name) || invalidWindowsFilename(name)
// export const invalidFilename = (name: string): boolean => !isValidFilename(name)