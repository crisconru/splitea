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

const EricSatie = {
  img: path.join(imgFolder, 'Ericsatie.jpg'),
  width: 2651,
  height: 3711
}

describe('Test Splitea Module', () => {
  describe('Image source', () => {
    test('Correct local jpg', async () => {
      const img = await readImage(EricSatie.img)
      expect(img.bitmap.width).toBe(EricSatie.width)
      expect(img.bitmap.height).toBe(EricSatie.height)
    })
    test('Incorrect local jpg', async () => {
      try {
        await readImage(EricSatie.img)
      } catch (error) {
        const errorMsg = 'Error: ENOENT: no such file or directory'
        expect(String(error).includes(errorMsg)).toBeTruthy()
      }
    })
  })

  describe('Options', () => {
    test('incorrect options.mode', async () => {
      const options = { mode: 'random' }
      const error = new SpliteaError(`Invalid mode, only ${Mode.Grid}, ${Mode.Horizontal}, ${Mode.Vertical} is permitted`)
      await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
    })

    describe('Mode Grid', () => {
      const errorNoDimesions = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')

      test('No Rows & Columns or Width & Height', async () => {
        const options = { mode: Mode.Grid }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Rows float & Columns natural', async () => {
        const options = { mode: Mode.Grid, rows: 2.1, columns: 3 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Rows negative integer & Columns natural', async () => {
        const options = { mode: Mode.Grid, rows: -2.0, columns: 3 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Rows natural & Columns float', async () => {
        const options = { mode: Mode.Grid, rows: 3, columns: 2.1 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Rows natural & Columns negative integer', async () => {
        const options = { mode: Mode.Grid, rows: 3, columns: -2.0 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Width float & Height natural', async () => {
        const options = { mode: Mode.Grid, width: 2.1, height: 3 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Width negative integer & Height natural', async () => {
        const options = { mode: Mode.Grid, width: -2.0, height: 3 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Width natural & Height float', async () => {
        const options = { mode: Mode.Grid, width: 3, height: 2.1 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
      test('Width natural & Height negative integer', async () => {
        const options = { mode: Mode.Grid, width: 3, height: -2.0 }
        const error = new SpliteaError('you need to provide two natural numbers, rows + columns or height (px) + width (px)')
        await expect(Splitea(EricSatie.img, options)).rejects.toThrow(error)
      })
    })
  })
})
