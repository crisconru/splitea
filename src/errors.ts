
export class SpliteaError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'SpliteaError'
  }
}

export const throwError = (error: any): SpliteaError => {
  if (error instanceof SpliteaError) { return error }
  console.error(error)
  return new SpliteaError(String(error))
}
