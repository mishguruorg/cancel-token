# @mishguru/cancel-token

> Cancel Token for Promises

## APT

### CancelTokenSource

* `cancel(reason)`
* `token`

### CancelToken

* `#source()`
* `promise`
* `isCancelled()`
* `throwIfRequested()`

## Usage

### Example of cancelling an HTTP request

```typescript
const get = async (uri: string, cancelToken: CancelToken) => {
  return new Promise((resolve, reject) => {

    // check to see if the token is cancelled before the requests starts
    cancelToken.throwIfRequested()

    // do something async
    const request = https.get({ uri }, (error, response) => {

      // check to see if the token was cancelled after the request started
      cancelToken.throwIfRequested()

      if (error != null) {
        reject(error)
      } else {
        resolve(response)
      }
    })

    // listen for token to be cancelled
    // if it is, then we abort the request
    cancelToken.promise.then(() => request.abort())
  })
}
```

### Cancelling a Function

```js
import CancelToken from '@mishguru/cancel-token'

// create CancelToken Source
const source = CancelToken.source()

// use canceltoken
get('https://api.mish.guru/info.json', source.token).then(console.log)

// cancel it
source.cancel(new Error('We no longer need info'))
```

## references

* This project is a fork of [miniprogram-cancel-token](https://github.com/NewFuture/miniprogram-network/tree/master/cancel-token)
