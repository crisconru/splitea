
export class SpliteaError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const throwError = (error: any): SpliteaError => {
  console.error(error)
  if (error instanceof SpliteaError) { return error }
  return new SpliteaError(String(error))
}
