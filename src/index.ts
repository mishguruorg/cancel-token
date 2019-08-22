export interface CancelTokenSource {
  readonly token: CancelToken,
  cancel(reason: Error): void,
}

class CancelToken {
  public readonly promise: Promise<Error>
  private reason: Error

  public static source (): CancelTokenSource {
    let cancel: CancelTokenSource['cancel']

    const token = new CancelToken((cancelPromise) => {
      cancel = cancelPromise
    })

    return { token, cancel }
  }

  private constructor (executor: (cb: CancelTokenSource['cancel']) => void) {
    let cancelPromise: (reason: Error) => void

    this.promise = new Promise<Error>((resolve) => {
      cancelPromise = resolve
    })

    executor((reason: Error) => {
      this.reason = reason
      cancelPromise(reason)
    })
  }

  public isCancelled (): boolean {
    return this.reason !== undefined
  }

  public throwIfRequested (): void | never {
    if (this.isCancelled()) {
      throw this.reason
    }
  }
}

export default CancelToken
