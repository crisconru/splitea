import path from 'path'
import { Splitea, readImage } from '../src/splitea'
import { SpliteaError } from '../src/errors'
import { Mode } from '../src/enums'

// describe('Test get size', () => {
//   test('Get correct size', async () => {
//     const imgFolder = path.join(__dirname, '..', 'examples')
//     const EricSatie = {
//       img: path.join(imgFolder, 'Ericsatie.jpg'),
//       width: 2651,
//       height: 3711
//     }
//     const EricSatieSize = await getSize(EricSatie.img)
//     expect(EricSatieSize.width).toBe(EricSatie.width)
//     expect(EricSatieSize.height).toBe(EricSatie.height)
//     const MapaBosque = {
//       img: path.join(imgFolder, 'mapabosque.png'),
//       width: 320,
//       height: 224
//     }
//     const MapaBosqueSize = await getSize(MapaBosque.img)
//     expect(MapaBosqueSize.width).toBe(MapaBosque.width)
//     expect(MapaBosqueSize.height).toBe(MapaBosque.height)
//   })
// })

const imgFolder = path.join(__dirname, '..', 'examples')

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  width: 320,
  height: 224
}
const imgTestBad = {
  img: path.join(imgFolder, 'forestmapp.png'),
  width: 320,
  height: 224
}

describe('Test Splitea Module', () => {
  describe('Image source', () => {
    test('Correct local jpg', async () => {
      const img = await readImage(imgTest.img)
      expect(img.bitmap.width).toBe(imgTest.width)
      expect(img.bitmap.height).toBe(imgTest.height)
    })
    test('Incorrect local jpg', async () => {
      await expect(readImage(imgTestBad.img)).rejects.toThrow(SpliteaError)
    })
  })

  describe('Options', () => {
    test('incorrect options.mode', async () => {
      const options = { mode: 'random' }
      const error = new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
      await expect(Splitea(imgTest.img, options)).rejects.toThrow(error)
    })

    describe('Mode Grid', () => {
      const errorNoDimensions = new SpliteaError('you need to provide two natural numbers, columns + rows or height (px) + width (px)')
      test('Not dimensions', async () => {
        const options = { mode: Mode.Grid }
        await expect(Splitea(imgTest.img, options)).rejects.toThrow(errorNoDimensions)
      })
      test('Not unsigned integers -> Rows & Columns', async () => {
        // Rows float & Columns natural
        const optionsColumnsRows = { mode: Mode.Grid, rows: 2.1, columns: 3 }
        await expect(Splitea(imgTest.img, optionsColumnsRows)).rejects.toThrow(errorNoDimensions)
        // Rows negative integer & Columns natural
        optionsColumnsRows.columns = -2.0
        optionsColumnsRows.rows = 3.0
        await expect(Splitea(imgTest.img, optionsColumnsRows)).rejects.toThrow(errorNoDimensions)
        // Rows natural & Columns float
        optionsColumnsRows.columns = 3
        optionsColumnsRows.rows = 2.1
        await expect(Splitea(imgTest.img, optionsColumnsRows)).rejects.toThrow(errorNoDimensions)
        // Rows natural & Columns negative integer
        optionsColumnsRows.columns = 3.0
        optionsColumnsRows.rows = -2.0
        await expect(Splitea(imgTest.img, optionsColumnsRows)).rejects.toThrow(errorNoDimensions)
      })
      test('Not unsigned integers -> Width & Height', async () => {
        // Width float & Height natural
        const optionsWidthHeight = { mode: Mode.Grid, width: 2.1, height: 3 }
        await expect(Splitea(imgTest.img, optionsWidthHeight)).rejects.toThrow(errorNoDimensions)
        // Width negative integer & Height natural
        optionsWidthHeight.width = -2.0
        optionsWidthHeight.height = 3.0
        await expect(Splitea(imgTest.img, optionsWidthHeight)).rejects.toThrow(errorNoDimensions)
        // Width natural & Height float
        optionsWidthHeight.width = 3
        optionsWidthHeight.height = 2.1
        await expect(Splitea(imgTest.img, optionsWidthHeight)).rejects.toThrow(errorNoDimensions)
        // Width natural & Height negative integer
        optionsWidthHeight.width = 3.0
        optionsWidthHeight.height = -2.0
        await expect(Splitea(imgTest.img, optionsWidthHeight)).rejects.toThrow(errorNoDimensions)
      })
    })
  })
})
