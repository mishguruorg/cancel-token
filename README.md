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
const get = async (url: string, cancelToken: CancelToken): Promise<string> => {
  // check to see if the token is cancelled before the requests starts
  cancelToken.throwIfRequested()

  return new Promise((resolve, reject) => {
    // download a url async
    const request = https.get(url, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => (body += chunk))
      response.on('end', () => resolve(body))
      response.on('error', reject)
    })
    request.on('error', reject)

    // watch if the token gets cancelled, and cleanup
    cancelToken.promise.then((error) => {
      reject(error)
      request.abort()
    })
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
