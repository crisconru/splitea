import fs from 'node:fs'
import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { checkOutput } from '../src/output'
import { SpliteaError } from '../src/errors'
import { Output } from '../src/types'

describe('checkOutput - response "buffer"', () => {
  test('response buffer', () => {
    const output: Output = { response: 'buffer' }
    expect(() => checkOutput(output)).not.toThrowError()
    output.store = { path: 'as?..jhfla', name: '?>.fdsg/.' }
    expect(() => checkOutput(output)).not.toThrowError()
  })
})

describe('checkOutput - response "path"', () => {
  const output: Output = { response: 'path', store: {} } as Output

  test('no store', () => {
    expect(() => checkOutput(output)).not.toThrowError(SpliteaError)
  })

  test('path: Not exists', () => {
    output.store = {
      path: new Date().getTime().toString(),
      name: 'test'
    }
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
    output.store.path = path.join(__dirname, new Date().toString())
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  })

  test('path: No write permission', () => {
    const tmpFolder = path.join(__dirname, new Date().getTime().toString())
    output.store = { path: tmpFolder, name: 'test' }
    fs.mkdirSync(tmpFolder, { mode: 0o444 })
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
    fs.rmdirSync(tmpFolder)
  })
  
  test('path: Valid path', () => {
    const dir = __dirname
    output.store = { path: dir, name: 'test' }
    expect(() => checkOutput(output)).not.toThrowError(SpliteaError)
  })

  test('Invalid OS filenames', () => {
    output.store = { path: __dirname, name: 'test' }
    // Invalid filenames
    output.store.name = 'foo/bar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'foo\u0000bar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'foo\u001Fbar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'foo*bar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'foo:bar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'AUX'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  
    output.store.name = 'com1'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)

    output.store.name = 'foo\\bar'
    expect(() => checkOutput(output)).toThrowError(SpliteaError)
  })
  
  test('Valid OS filenames', () => {
    output.store = { path: __dirname, name: 'test' }

    output.store.name = 'foo-bar'
    expect(() => checkOutput(output)).not.toThrowError(SpliteaError)

    output.store.name = 'hola.txt'
    expect(() => checkOutput(output)).not.toThrowError(SpliteaError)
  })

})
