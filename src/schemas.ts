import fs from 'node:fs'
import * as v from 'valibot'
import { ValibotValidator } from '@schemasjs/validator'
import { UnsignedIntegerSchema as ValibotNaturalSchema, type UnsignedInteger, Float32Schema as ValibotFloat32Schema } from '@schemasjs/valibot-numbers'
import { EXTENSIONS, MAX_DIFFERENCE, MAX_DISTANCE, UNIQUE_REQUIREMENTS } from './constants'
import { validFilename } from './utils'

// PRIMITIVES ---------------------------------------------------------------------------------------------------------
const ValibotBooleanSchema = v.boolean()

export const NaturalSchema = ValibotValidator<UnsignedInteger>(ValibotNaturalSchema)

const ValibotBufferSchema = v.instance(Buffer)
// IMAGE --------------------------------------------------------------------------------------------------------------
const ValibotImageExistsSchema = v.pipe(
  v.string(),
  v.check((file: string) => fs.existsSync(file), 'This image does not exists')
)

const ValibotImageSchema = v.union([ValibotImageExistsSchema, ValibotBufferSchema])
export const ImageSchema = ValibotValidator<v.InferInput<typeof ValibotImageSchema>>(ValibotImageSchema)
// OPTIONS ------------------------------------------------------------------------------------------------------------
const ValibotResponseSchema = v.picklist(['buffer', 'file'])
export const ResponseSchema = ValibotValidator<v.InferInput<typeof ValibotResponseSchema>>(ValibotResponseSchema)

const ValibotPathSchema = v.pipe(
  v.string(),
  // v.custom((input: string) => !invalidFilename(input), 'Invalid name for a path'),
  v.check(
    (input: string) => {
      try {
        if (!fs.existsSync(input)) {
          fs.mkdirSync(input)
        }
        return true
      } catch (error) {
        return false
      }
    },
    'Cannot create the provided path'
  ),
  v.check(
    (input: string) => {
      try {
        fs.accessSync(input, fs.constants.W_OK)
        return true
      } catch (error) {
        return false
      }
    },
    'provided path doesn\'t have write permissions'
  )
)
export const PathSchema = ValibotValidator<v.InferInput<typeof ValibotPathSchema>>(ValibotPathSchema)

const ValibotFilenameSchema = v.pipe(
  v.string(),
  v.check((input: string) => validFilename(input), 'Invalid filename')
)
export const FilenameSchema = ValibotValidator<v.InferInput<typeof ValibotFilenameSchema>>(ValibotFilenameSchema)

// const ValibotExtensionSchema = v.picklist(EXTENSIONS)
const ValibotExtensionSchema = v.pipe(
  v.string(),
  v.check(input => EXTENSIONS.filter(ext => ext === input.toLowerCase()).length > 0),
  v.transform(input => input.toLowerCase())
)
export const ExtensionSchema = ValibotValidator<v.InferInput<typeof ValibotExtensionSchema>>(ValibotExtensionSchema)

const ValibotUniqueRequirementSchema = v.picklist(UNIQUE_REQUIREMENTS)
export const UniqueRequirementSchema = ValibotValidator<v.InferInput<typeof ValibotUniqueRequirementSchema>>(ValibotUniqueRequirementSchema)

const ValibotDistanceSchema = v.pipe(ValibotFloat32Schema, v.minValue(0), v.maxValue(1))
export const DistanceSchema = ValibotValidator<v.InferOutput<typeof ValibotDistanceSchema>>(ValibotDistanceSchema)

const ValibotDifferenceSchema = ValibotDistanceSchema
export const DifferenceSchema = ValibotValidator<v.InferOutput<typeof ValibotDifferenceSchema>>(ValibotDifferenceSchema)

const ValibotOptionsSchema = v.pipe(
  v.object({
    response: v.optional(ValibotResponseSchema, 'buffer'),
    path: v.optional(ValibotPathSchema),
    filename: v.optional(ValibotFilenameSchema, 'tile'),
    extension: v.optional(ValibotExtensionSchema),
    unique: v.optional(ValibotBooleanSchema, false),
    uniqueRequirement: v.optional(ValibotUniqueRequirementSchema, 'all'),
    distance: v.optional(ValibotDistanceSchema, MAX_DISTANCE),
    difference: v.optional(ValibotDifferenceSchema, MAX_DIFFERENCE)
  }),
  v.forward(
    v.partialCheck(
      [['response'], ['path']],
      ({ response, path }) => (response === 'file') ? path !== undefined : true,
      'If response is "file" a valid "path" has to be provided'),
    ['path']
  )
)
export const OptionsSchema = ValibotValidator<v.InferInput<typeof ValibotOptionsSchema>>(ValibotOptionsSchema)
// HORIZONTAL ---------------------------------------------------------------------------------------------------------
const ValibotColumnsWidthSchema = v.pipe(
  v.object({
    columns: v.optional(ValibotNaturalSchema),
    width: v.optional(ValibotNaturalSchema)
  }),
  v.check(
    ({ columns, width }) => !(columns !== undefined && width !== undefined) && !(columns === undefined && width === undefined),
    'columns or width has to be provided, not both'
  )
)

const ValibotHorizontalOptionsSchema = v.intersect([ValibotColumnsWidthSchema, ValibotOptionsSchema])
export const HorizontalOptionsSchema = ValibotValidator<v.InferInput<typeof ValibotHorizontalOptionsSchema>>(ValibotHorizontalOptionsSchema)
// VERTICAL -----------------------------------------------------------------------------------------------------------
const ValibotRowsHeightSchema = v.pipe(
  v.object({
    rows: v.optional(ValibotNaturalSchema),
    height: v.optional(ValibotNaturalSchema)
  }),
  v.check(
    ({ rows, height }) => !(rows !== undefined && height !== undefined) && !(rows === undefined && height === undefined),
    'rows or width has to be provided, not both'
  )
)

const ValibotVerticalOptionsSchema = v.intersect([ValibotRowsHeightSchema, ValibotOptionsSchema])
export const VerticalOptionsSchema = ValibotValidator<v.InferInput<typeof ValibotVerticalOptionsSchema>>(ValibotVerticalOptionsSchema)
// GRID ---------------------------------------------------------------------------------------------------------------
const ValibotGridOptionsSchema = v.pipe(
  v.intersect([ValibotColumnsWidthSchema, ValibotRowsHeightSchema, ValibotOptionsSchema]),
  v.check(
    input => (input.rows !== undefined && input.columns !== undefined) || (input.width !== undefined && input.height !== undefined),
    'It must be provided the pair rows-columns or width-height'
  )
)
export const GridOptionsSchema = ValibotValidator<v.InferInput<typeof ValibotGridOptionsSchema>>(ValibotGridOptionsSchema)
