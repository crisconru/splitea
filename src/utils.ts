import { NaturalSchema } from "./types"

export const isSubmultiple = (numerator: number, denominator: number): boolean => NaturalSchema.multipleOf(denominator).safeParse(numerator).success
