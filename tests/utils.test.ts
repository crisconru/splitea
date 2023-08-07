import { describe, test, expect } from 'vitest'
import { isSubmultiple } from '../src/utils'

describe('Test Utils Module', () => {
  test('isSubmultiple', () => {
    expect(isSubmultiple(10, 5)).toBeTruthy()
    expect(isSubmultiple(10, 2)).toBeTruthy()
    expect(isSubmultiple(10, 3)).toBeFalsy()
    expect(isSubmultiple(10, 4)).toBeFalsy()
  })  

})
