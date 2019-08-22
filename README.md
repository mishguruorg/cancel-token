# @mishguru/cancel-token

> Cancle Token for Promise in MiniProgram

## APT

### CancelTokenSource

* `cancel(reason)`
* `token`

### CancelToken

* `#source()`
* `promise`
* `isCancelled()`
* `throwIfRequested()`

## usage

```js
function doFoo(foo, cancelToken) {
  return new Promise((resolve, reject) => {
    cancelToken.promise.then(()=>{
      // do somethig to cancel
      // like xhr.abort()
      foo.abort()
    })
    cancelToken.throwIfRequested()
    resolve('something')
  })
}
```

```js
import CancelToken from '@mishguru/cancel-token'

// create CancelToken Source
const source = CancelToken.source()

//use canceltoken
doFoo(foo, source.token).then(console.log)

// cancle it
source.cancel(new Error('Aborting foo'))
```

## references

* This project is a fork of [miniprogram-cancel-token](https://github.com/NewFuture/miniprogram-network/tree/master/cancel-token)
