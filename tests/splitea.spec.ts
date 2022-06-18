import { getSize } from '../src/splitea'

describe('Test get size', () => {
  test('Get correct size', async () => {
    const img = 'tests/EricSatie.jpg'
    const size = await getSize(img)
    expect(size.width).toBe(2651)
    expect(size.height).toBe(3711)
  })

//   test('Get correct size', async () => {
//     const img = 'tests/EricSatie.jpg'
//     const size = await getSize(img)
//     expect(size.width).toBe(2651)
//     expect(size.height).toBe(3711)
//   })
})
