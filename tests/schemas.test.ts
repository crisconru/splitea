import fs from 'node:fs'
import path from 'node:path'
import { describe, test, expect } from 'vitest'
import type { GridOptions, HorizontalOptions, Options, VerticalOptions } from '../src/types'
import { ExtensionSchema, GridOptionsSchema, HorizontalOptionsSchema, ImageSchema, OptionsSchema, PathSchema, ResponseSchema, VerticalOptionsSchema } from '../src/schemas'
import { EXTENSIONS, MAX_DIFFERENCE, MAX_DISTANCE } from '../src'

const IMG_FOLDER = path.join(__dirname)

const forest = {
  file: path.join(IMG_FOLDER, 'forestmap.png'),
  width: 320,
  height: 224,
}

const satie = {
  file: path.join(IMG_FOLDER, 'Ericsatie.jpg'),
  width: 2651,
  height: 3711,
}

const chess = {
  file: path.join(IMG_FOLDER, 'chess.png'),
  width: 720,
  height: 720,
}

const bad = {
  file: path.join(IMG_FOLDER, 'forestmapp.png'),
  width: 320,
  height: 224,
}
// ImageSchema ----------------------------------------------------------------
describe('ImageSchema', () => {
  test('input non exists image throw an exception', () => {
    expect(() => ImageSchema.parse(bad.file)).toThrow()
  })

  test('input image exists', async () => {
    expect(ImageSchema.parse(satie.file)).toBeTypeOf('string')
  })

  test('input buffer', () => {
    const buffer = fs.readFileSync(forest.file)
    expect(ImageSchema.safeParse(buffer).success).toBeTruthy()
  })
})
// ResponseSchema -------------------------------------------------------------
test('ResponseSchema', () => {
  ['buffer', 'file'].forEach(el => {
    expect(ResponseSchema.parse(el)).toBe(el)
  })
  ;['Buffer', 'File', {}, false].forEach(el => {
    expect(() => ResponseSchema.parse(el)).toThrow()
  })
})
// PathSchema -----------------------------------------------------------------
describe('PathSchema', () => {
  test('Cannot create path', () => {
    const badPath = path.join(IMG_FOLDER, '\0')
    const parsed = PathSchema.safeParse(badPath)
    if (parsed.success) {
      fs.rmdirSync(badPath)
    }
    expect(parsed.success).toBeFalsy()
  })

  test('Not write permissions', () => {
    const badPath = path.join(IMG_FOLDER, 'bad')
    if (!fs.existsSync(badPath)) {
      fs.mkdirSync(badPath, { mode: 444 })
    }
    fs.chmodSync(badPath, 0o444)
    const parsed = PathSchema.safeParse(badPath)
    fs.rmdirSync(badPath)
    expect(parsed.success).toBeFalsy()
  })
})
// FilenameSchema -------------------------------------------------------------
// ExtensionSchema ------------------------------------------------------------
test('ExtensionSchema', () => {
  EXTENSIONS.forEach(ext => expect(ExtensionSchema.parse(ext)).toBe(ext))
  ;EXTENSIONS.forEach(ext => expect(ExtensionSchema.parse(ext.toLocaleUpperCase())).toBe(ext))
  ;expect(() => ExtensionSchema.parse('peneg')).toThrow()
})
// UniqueRequirementSchema ----------------------------------------------------
// DistanceSchema -------------------------------------------------------------
// DifferenceSchema -----------------------------------------------------------
// OptionsSchema --------------------------------------------------------------
describe('OptionsSchema', () => {
  test('Default object', () => {
    const options = {}
    expect(OptionsSchema.parse(options)).toEqual({
      response: 'buffer',
      filename: 'tile',
      unique: false,
      uniqueRequirement: 'all',
      distance: MAX_DISTANCE,
      difference: MAX_DIFFERENCE
    })
  })

  test('If response is "file" then path must be provided', () => {
    const options = { response: 'file' } satisfies Options
    expect(() => OptionsSchema.parse(options)).toThrow()
  })
})
// HorizontalOptionsSchema ----------------------------------------------------
describe('HorizontalOptionsSchema', () => {
  test('Just provide at least columns or width but not both', () => {
    const columns = 4
    const width = 40
    const options = { columns, width } satisfies HorizontalOptions
    expect(() => HorizontalOptionsSchema.parse(options)).toThrow()
    expect(() => HorizontalOptionsSchema.parse({})).toThrow()
    const opt1 = { columns }
    expect(HorizontalOptionsSchema.safeParse(opt1).success).toBeTruthy()
    const opt2 = { width }
    expect(HorizontalOptionsSchema.safeParse(opt2).success).toBeTruthy()
  })
})
// VerticalOptionsSchema ------------------------------------------------------
describe('VerticalOptionsSchema', () => {
  test('Just provide at least rows or height but not both', () => {
    const rows = 4
    const height = 40
    const options = { rows, height } satisfies VerticalOptions
    expect(() => VerticalOptionsSchema.parse(options)).toThrow()
    expect(() => VerticalOptionsSchema.parse({})).toThrow()
    const opt1 = { rows }
    expect(VerticalOptionsSchema.safeParse(opt1).success).toBeTruthy()
    const opt2 = { height }
    expect(VerticalOptionsSchema.safeParse(opt2).success).toBeTruthy()
  })
})
// GridOptionsSchema ----------------------------------------------------------
describe('GridOptionsSchema', () => {
  test('Just provide at least columns-rows or width-height but not both', () => {
    const rows = 4
    const columns = 4
    const width = 40
    const height = 40
    const options = { rows, columns, width, height } satisfies GridOptions
    expect(() => GridOptionsSchema.parse(options)).toThrow()
    expect(() => GridOptionsSchema.parse({})).toThrow()
    const opt1 = { rows, width }
    expect(() => GridOptionsSchema.parse(opt1)).toThrow()
    const opt2 = { columns, height }
    expect(() => GridOptionsSchema.parse(opt2)).toThrow()
    const opt3 = { rows, columns }
    expect(GridOptionsSchema.safeParse(opt3).success).toBeTruthy()
    const opt4 = { width, height }
    expect(GridOptionsSchema.safeParse(opt4).success).toBeTruthy()
  })
})
