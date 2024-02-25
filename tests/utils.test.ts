import { describe, test, expect } from 'vitest'
import { invalidFilename, isSubmultiple } from '../src/utils'

describe('Test Utils Module', () => {
  test('isSubmultiple', () => {
    expect(isSubmultiple(10, 5)).toBeTruthy()
    expect(isSubmultiple(10, 2)).toBeTruthy()
    expect(isSubmultiple(10, 3)).toBeFalsy()
    expect(isSubmultiple(10, 4)).toBeFalsy()
  })  

  test('invalidFilename', () => {
    // INVALID
    const invalidFiles = ['foo/bar', 'foo\u0000bar', 'foo\u001Fbar', 'foo*bar', 'foo:bar', 'AUX', 'com1', 'foo\\bar']
    invalidFiles.forEach(file => {
      expect(invalidFilename(file)).toBeTruthy()
    })
    // VALID
    const validFiles = ['chess.txt', 'chess.jpg', 'chessFolder', 'chessfolder']
    validFiles.forEach(file => {
      expect(invalidFilename(file)).toBeFalsy()
    })
  })
})
