import isValidFilename from 'valid-filename'

export const xor = (a: boolean, b: boolean): boolean => (a && !b) || (!a && b)

export const isSubmultiple = (numerator: number, denominator: number): boolean => numerator % denominator === 0

export const validFilename = (name: string): boolean => isValidFilename(name)
