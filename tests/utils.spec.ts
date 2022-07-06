import path from 'path'
import { Mode } from '../src/enums'
import { SpliteaError } from '../src/errors'
import { Size, Tile } from '../src/types'
import { isNatural, isSubmultiple, parseMode, parseModeSlices, validPairNaturalNumbers, validPairSubmultiples } from '../src/utils'

const imgFolder = path.join(__dirname, '..', 'examples')

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  imgBad: path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224
}

describe('Test Utils Module', () => {
  describe('parseMode', () => {
    test('Invalid Modes', () => {
      // No mode
      let mode: any
      const errorNoModeValid = new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
      expect(() => parseMode(mode)).toThrow(errorNoModeValid)
      // Invalid Modes
      mode = 'aslkdfhaljkfhl'
      expect(() => parseMode(mode)).toThrow(errorNoModeValid)
      mode = 3
      expect(() => parseMode(mode)).toThrow(errorNoModeValid)
    })

    test('Valid Modes', () => {
      // Valid Modes
      let mode = Mode.Grid
      expect(parseMode(mode)).toBe(mode)
      mode = Mode.Horizontal
      expect(parseMode(mode)).toBe(mode)
      mode = Mode.Vertical
      expect(parseMode(mode)).toBe(mode)
    })
  })

  describe('isNatural', () => {
    test('Negative integer', () => expect(isNatural(-1)).toBeFalsy())

    test('Zero', () => expect(isNatural(0)).toBeFalsy())

    test('Float', () => expect(isNatural(3.1)).toBeFalsy())

    test('Invalid types', () => {
      expect(isNatural(undefined)).toBeFalsy()
      expect(isNatural('adslfjha')).toBeFalsy()
      expect(isNatural([1, 2])).toBeFalsy()
    })

    test('Valid natural numbers', () => {
      expect(isNatural(4)).toBeTruthy()
      expect(isNatural(4.0)).toBeTruthy()
    })
  })

  describe('validPairNaturalNumbers', () => {
    test('Invalid numbers', () => {
      expect(validPairNaturalNumbers(-1, 2)).toBeFalsy()
      expect(validPairNaturalNumbers(2, -1)).toBeFalsy()
      expect(validPairNaturalNumbers(2.1, 1)).toBeFalsy()
      expect(validPairNaturalNumbers(1, 2.1)).toBeFalsy()
      expect(validPairNaturalNumbers('1', 2)).toBeFalsy()
      expect(validPairNaturalNumbers(1, '2')).toBeFalsy()
      expect(validPairNaturalNumbers([1, 2], 2)).toBeFalsy()
      expect(validPairNaturalNumbers(1, [3, 2])).toBeFalsy()
      expect(validPairNaturalNumbers(1, undefined)).toBeFalsy()
      expect(validPairNaturalNumbers(undefined, 2)).toBeFalsy()
    })

    test('Valid numbers', () => {
      expect(validPairNaturalNumbers(1, 2)).toBeTruthy()
      expect(validPairNaturalNumbers(1.0, 2)).toBeTruthy()
      expect(validPairNaturalNumbers(1, 2.0)).toBeTruthy()
    })
  })

  describe('isSubmultiple', () => {
    test('Invalid submultiples', () => {
      expect(isSubmultiple(4, 2.1)).toBeFalsy()
      expect(isSubmultiple(4, -2.0)).toBeFalsy()
      expect(isSubmultiple(-4, 2.0)).toBeFalsy()
      expect(isSubmultiple(-4, -2.0)).toBeFalsy()
      expect(isSubmultiple('4', 2)).toBeFalsy()
      expect(isSubmultiple(4, '2')).toBeFalsy()
    })

    test('Valid submultiples', () => {
      expect(isSubmultiple(320, 2.0)).toBeTruthy()
      expect(isSubmultiple(224.0, 2)).toBeTruthy()
    })
  })

  describe('validPairSubmultiples', () => {
    test('Invalid submultiples', () => {
      expect(validPairSubmultiples(320, 3, 224, 2)).toBeFalsy()
      expect(validPairSubmultiples(320, 2, 224, 3)).toBeFalsy()
      expect(validPairSubmultiples(320, 2.1, 224, 2)).toBeFalsy()
      expect(validPairSubmultiples(320, 2, 224, 2.1)).toBeFalsy()
      expect(validPairSubmultiples(320, '2', 224, 2)).toBeFalsy()
      expect(validPairSubmultiples(320, 2, 224, '2')).toBeFalsy()
    })

    test('Valid submultiples', () => {
      expect(validPairSubmultiples(320, 2, 224, 2)).toBeTruthy()
    })
  })

  describe('parseModeSlices', () => {
    test('Grid', () => {
      const mode = Mode.Grid
      const size: Size = { width: imgTest.width, height: imgTest.height }
      const errorSubmultiple = new SpliteaError(`you need to provide two natural submultiples of ${size.width} and ${size.height}, columns + rows or width (px) + height (px)`)
      const tiles: Tile = { rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
      // OK Rows & Columns
      tiles.rows = 2
      tiles.columns = 2
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // OK Width & Height
      tiles.rows = undefined
      tiles.columns = undefined
      tiles.width = 2
      tiles.height = 2
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // Fail Rows Ok Columns
      tiles.rows = 3
      tiles.columns = 2
      tiles.width = undefined
      tiles.height = undefined
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
      // Ok Rows Fail Columns
      tiles.rows = 2
      tiles.columns = 3
      tiles.width = undefined
      tiles.height = undefined
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
      // Fail Width & Ok Height
      tiles.rows = undefined
      tiles.columns = undefined
      tiles.width = 3
      tiles.height = 2
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
      // Ok Width & Fail Height
      tiles.rows = undefined
      tiles.columns = undefined
      tiles.width = 2
      tiles.height = 3
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
    })

    test('Horizontal', () => {
      const mode = Mode.Horizontal
      const size: Size = { width: imgTest.width, height: imgTest.height }
      const errorSubmultiple = new SpliteaError(`you need to provide one natural submultiple of ${size.width}, columns or width (px)`)
      const tiles: Tile = { rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
      // OK Columns
      tiles.columns = 2
      tiles.width = undefined
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // OK Width
      tiles.columns = undefined
      tiles.width = 2
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // Fail Columns
      tiles.columns = 3
      tiles.width = undefined
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
      // Fail Width
      tiles.columns = undefined
      tiles.width = 3
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
    })

    test('Vertical', () => {
      const mode = Mode.Vertical
      const size: Size = { width: imgTest.width, height: imgTest.height }
      const errorSubmultiple = new SpliteaError(`you need to provide one natural submultiple of ${size.height}, rows or height (px)`)
      const tiles: Tile = { rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
      // OK Rows
      tiles.rows = 2
      tiles.height = undefined
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // OK Height
      tiles.rows = undefined
      tiles.height = 2
      expect(parseModeSlices(mode, tiles, size)).toBeTruthy()
      // Fail Rows
      tiles.rows = 3
      tiles.height = undefined
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
      // Fail Height
      tiles.rows = undefined
      tiles.height = 3
      expect(() => parseModeSlices(mode, tiles, size)).toThrow(errorSubmultiple)
    })
  })
})
