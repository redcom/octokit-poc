export type ErrorItem = {
  code: string
  text: string
}

declare class IError implements Error {
  public name: string
  public message: string
  public status: number
  constructor(message?: string)
}

export class ValidationError extends IError {
  public readonly errors: ErrorItem[]

  constructor(message: string, errorItems: ErrorItem[]) {
    super(message)
    this.errors = errorItems
    this.status = 400
  }
}
