import path from 'path'
import { readImage } from '../src/splitea'
import { SpliteaError } from '../src/errors'

const imgFolder = path.join(__dirname, '..', 'examples')

const imgTest = {
  img: path.join(imgFolder, 'forestmap.png'),
  imgBad: path.join(imgFolder, 'forestmapp.png'),
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
      await expect(readImage(imgTest.imgBad)).rejects.toThrow(SpliteaError)
    })
  })
})
