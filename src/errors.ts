import { ValiError } from "valibot"

export class SpliteaError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const ThrowSpliteaError = (error: any, msg: string): SpliteaError => {
  if (error instanceof SpliteaError) { return error }
  if (error instanceof ValiError) {
    const err = error.issues[0].message
    console.error(`Error: ${msg} -> ${err}`)
    return new SpliteaError(msg + '\n' + err)
  }
  console.error(error)
  return new SpliteaError(msg + '\n' + String(error))
}
