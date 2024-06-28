import { ValiError } from 'valibot'

export class SpliteaError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const ThrowSpliteaError = (error: any, msg: string): never => {
  if (error instanceof SpliteaError) { throw error }
  if (error instanceof ValiError) {
    const err: string = error.issues[0].message
    console.error(`Error: ${msg} -> ${err}`)
    throw new SpliteaError(msg + '\n' + err)
  }
  console.error(error)
  throw new SpliteaError(msg + '\n' + String(error))
}
