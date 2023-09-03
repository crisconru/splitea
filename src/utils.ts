import { NaturalSchema } from "./types"

export const isSubmultiple = (numerator: number, denominator: number): boolean => NaturalSchema.multipleOf(denominator).safeParse(numerator).success

export const invalidWindowsFilename = (name: string): boolean => {
  // Windows Regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
  const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/
  const invalidWindowsFilename = new RegExp(windowsReservedNameRegex, 'i')
  return invalidWindowsFilename.test(name)
}

export const invalidUnixFilename = (name: string): boolean => {
  // All OS except Windows Regex = /[<>:"/\\|?*\u0000-\u001F]/g
  const filenameReservedRegex = /[<>:"/\\|?*\u0000-\u001F]/
  const invalidFilename = new RegExp(filenameReservedRegex, 'g')
  return invalidFilename.test(name)
}

export const invalidFilename = (name: string): boolean => invalidUnixFilename(name) || invalidWindowsFilename(name)
