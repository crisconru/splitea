import Path from 'path'
import fs from 'fs'
import { Data, Extension, Mode } from '../src/enums'
import { SpliteaError } from '../src/errors'
import { Output, Size, Tiles } from '../src/types'
import { isNatural, isSubmultiple, parseData, parseExtension, parseMode, parseName, parseOutput, parsePath, parseTiles, parseUnique, validPairNaturalNumbers, validPairSubmultiples } from '../src/utils'

const imgFolder = Path.join(__dirname, '..', 'examples')

const imgTest = {
  img: Path.join(imgFolder, 'forestmap.png'),
  imgBad: Path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224
}

describe('Test Utils Module', () => {
  describe('Tiles', () => {
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

    describe('parseUnique', () => {
      test('Valid Unique', () => {
        const tiles: any = {}
        expect(parseUnique(tiles)).toBeTruthy()
        tiles.unique = true
        expect(parseUnique(tiles)).toBeTruthy()
        tiles.unique = false
        expect(parseUnique(tiles)).toBeTruthy()
      })

      test('Invalid Unique', () => {
        const tiles: any = { unique: 0 }
        const error = new SpliteaError('unique property should be boolean, only admits true or false value')
        expect(() => parseUnique(tiles)).toThrow(error)
        tiles.unique = 1
        expect(() => parseUnique(tiles)).toThrow(error)
        tiles.unique = 'true'
        expect(() => parseUnique(tiles)).toThrow(error)
      })
    })

    describe('parseTiles', () => {
      test('Grid', () => {
        const size: Size = { width: imgTest.width, height: imgTest.height }
        const errorSubmultiple = new SpliteaError(`you need to provide two natural submultiples of ${size.width} and ${size.height}, columns + rows or width (px) + height (px)`)
        const tiles: Tiles = { mode: Mode.Grid, rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
        // OK Rows & Columns
        tiles.rows = 2
        tiles.columns = 2
        expect(parseTiles(tiles, size)).toBeTruthy()
        // OK Width & Height
        tiles.rows = undefined
        tiles.columns = undefined
        tiles.width = 2
        tiles.height = 2
        expect(parseTiles(tiles, size)).toBeTruthy()
        // Fail Rows Ok Columns
        tiles.rows = 3
        tiles.columns = 2
        tiles.width = undefined
        tiles.height = undefined
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
        // Ok Rows Fail Columns
        tiles.rows = 2
        tiles.columns = 3
        tiles.width = undefined
        tiles.height = undefined
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
        // Fail Width & Ok Height
        tiles.rows = undefined
        tiles.columns = undefined
        tiles.width = 3
        tiles.height = 2
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
        // Ok Width & Fail Height
        tiles.rows = undefined
        tiles.columns = undefined
        tiles.width = 2
        tiles.height = 3
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
      })

      test('Horizontal', () => {
        const size: Size = { width: imgTest.width, height: imgTest.height }
        const errorSubmultiple = new SpliteaError(`you need to provide one natural submultiple of ${size.width}, columns or width (px)`)
        const tiles: Tiles = { mode: Mode.Horizontal, rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
        // OK Columns
        tiles.columns = 2
        tiles.width = undefined
        expect(parseTiles(tiles, size)).toBeTruthy()
        // OK Width
        tiles.columns = undefined
        tiles.width = 2
        expect(parseTiles(tiles, size)).toBeTruthy()
        // Fail Columns
        tiles.columns = 3
        tiles.width = undefined
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
        // Fail Width
        tiles.columns = undefined
        tiles.width = 3
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
      })

      test('Vertical', () => {
        const size: Size = { width: imgTest.width, height: imgTest.height }
        const errorSubmultiple = new SpliteaError(`you need to provide one natural submultiple of ${size.height}, rows or height (px)`)
        const tiles: Tiles = { mode: Mode.Vertical, rows: undefined, columns: undefined, width: undefined, height: undefined, unique: false }
        // OK Rows
        tiles.rows = 2
        tiles.height = undefined
        expect(parseTiles(tiles, size)).toBeTruthy()
        // OK Height
        tiles.rows = undefined
        tiles.height = 2
        expect(parseTiles(tiles, size)).toBeTruthy()
        // Fail Rows
        tiles.rows = 3
        tiles.height = undefined
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
        // Fail Height
        tiles.rows = undefined
        tiles.height = 3
        expect(() => parseTiles(tiles, size)).toThrow(errorSubmultiple)
      })
    })
  })

  describe('Output', () => {
    describe('parseData', () => {
      test('Invalid data', () => {
        const error = new SpliteaError('Invalid output data, it should be "buffer" or "path"')
        expect(() => parseData(undefined)).toThrow(error)
        expect(() => parseData(null)).toThrow(error)
        expect(() => parseData(false)).toThrow(error)
        expect(() => parseData('Buffer')).toThrow(error)
        expect(() => parseData('Path')).toThrow(error)
        expect(() => parseData(1)).toThrow(error)
        expect(() => parseData(['path'])).toThrow(error)
      })
      test('Valid data', () => {
        expect(parseData('path')).toBeTruthy()
        expect(parseData('buffer')).toBeTruthy()
      })
    })

    describe('parsePath', () => {
      test('Invalid path', () => {
        const error = new SpliteaError('path needs to be string')
        expect(() => parsePath(null)).toThrow(error)
        expect(() => parsePath(undefined)).toThrow(error)
        expect(() => parsePath(false)).toThrow(error)
        expect(() => parsePath(1)).toThrow(error)
        expect(() => parsePath(['./test'])).toThrow(error)
        expect(() => parsePath({ path: './test' })).toThrow(error)
      })

      test('Not exists path', () => {
        let testPath = new Date().getTime().toString()
        let error = new SpliteaError(`Not exists path ${testPath}`)
        expect(() => parsePath(testPath)).toThrow(error)
        testPath = Path.join(__dirname, new Date().toString())
        error = new SpliteaError(`Not exists path ${testPath}`)
        expect(() => parsePath(testPath)).toThrow(error)
      })

      test('No write permission path', () => {
        const tmpFolder = Path.join(__dirname, new Date().getTime().toString())
        fs.mkdirSync(tmpFolder, { mode: 0o444 })
        expect(() => parsePath(tmpFolder)).toThrow(SpliteaError)
        fs.rmdirSync(tmpFolder)
      })

      test('Valid path', () => {
        expect(parsePath(__dirname)).toBeTruthy()
      })
    })

    describe('parseName', () => {
      test('Invalid type of name', () => {
        const error = new SpliteaError('name needs to be string')
        expect(() => parseName(null)).toThrow(error)
        expect(() => parseName(undefined)).toThrow(error)
        expect(() => parseName(false)).toThrow(error)
        expect(() => parseName(1)).toThrow(error)
        expect(() => parseName(['test'])).toThrow(error)
        expect(() => parseName({ test: 'test' })).toThrow(error)
      })

      test('Invalid OS name', () => {
        // Invalid filenames
        let name = 'foo/bar'
        let error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'foo\u0000bar'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'foo\u001Fbar'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'foo*bar'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'foo:bar'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'AUX'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        name = 'com1'
        error = new SpliteaError(`${String(name)} is not a valid filename`)
        expect(() => parseName(name)).toThrow(error)
        // Valid filenames
        name = 'foo-bar'
        expect(parseName(name)).toBeTruthy()
        name = 'foo\\bar'
        expect(parseName(name)).toBeTruthy()
      })

      test('Valid name', () => {
        expect(parseName('hola.txt')).toBeTruthy()
      })
    })

    describe('parseExtension', () => {
      test('Extension not string', () => {
        const error = new SpliteaError('extension needs to be string')
        expect(() => parseExtension(undefined)).toThrow(error)
        expect(() => parseExtension(null)).toThrow(error)
        expect(() => parseExtension(false)).toThrow(error)
        expect(() => parseExtension(true)).toThrow(error)
        expect(() => parseExtension(1)).toThrow(error)
        expect(() => parseExtension(['jpg'])).toThrow(error)
        expect(() => parseExtension({ jpg: 'jpg' })).toThrow(error)
      })

      test('Extension not valid', () => {
        const values = Object.values(Extension)
        const extensions = ['pnj', 'jepg', 'giff', 'tif']
        extensions.forEach(extension => {
          const err = new SpliteaError(`${extension} needs to be one of this extensions -> ${values.toString()}`)
          expect(() => parseExtension(extension)).toThrow(err)
        })
      })

      test('Extension valid', () => {
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'tiff']
        extensions.forEach(extension => expect(extension).toBeTruthy())
      })
    })

    describe('parseOutput', () => {
      describe('data = buffer', () => {
        test('only data', () => {
          const output: Output = { data: Data.Buffer }
          expect(parseOutput(output)).toBeTruthy()
        })

        test('name', () => {
          const output: Output = { data: Data.Buffer, name: 'test' }
          expect(parseOutput(output)).toBeTruthy()
          const error = { data: Data.Buffer, name: 123 }
          expect(() => parseOutput(error)).toThrow(SpliteaError)
        })
      })
    })
  })
})
