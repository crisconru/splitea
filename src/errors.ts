
export class SpliteaError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const throwError = (error: any, msg: string): SpliteaError => {
  if (error instanceof SpliteaError) { return error }
  console.error(error)
  return new SpliteaError(msg + '\n' + String(error))
}
