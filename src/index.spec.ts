import test from 'ava'

import CancelToken from './index'

const ABORT = new Error('ABORT')

test('CancelToken.source should create a new CancelToken', (t) => {
  const source = CancelToken.source()
  t.is(typeof source.cancel, 'function')
  t.true(source.token.promise instanceof Promise)
})

test('token.isCancelled should be false when token is not cancelled', (t) => {
  const source = CancelToken.source()
  t.false(source.token.isCancelled())
})

test('token.isCancelled should be true when token is cancelled', (t) => {
  const source = CancelToken.source()
  source.cancel(ABORT)
  t.true(source.token.isCancelled())
})

test('token.throwIfRequested should not throw if token is not cancelled', (t) => {
  const source = CancelToken.source()
  source.token.throwIfRequested()
  t.pass()
})

test('token.throwIfRequested should throw if token is cancelled', (t) => {
  const source = CancelToken.source()
  source.cancel(ABORT)
  t.throws(() => {
    source.token.throwIfRequested()
  }, ABORT.message)
})

test('token.promise should not resolve if token is not cancelled', (t) => {
  const source = CancelToken.source()
  source.token.promise.then(() => t.fail())
  t.pass()
})

test('token.promise should resolve if token is cancelled', async (t) => {
  const source = CancelToken.source()
  source.cancel(ABORT)
  await source.token.promise
  t.pass()
})

test('should be able to pass cancelToken to another function', async (t) => {
  t.plan(2)

  const builder = async (cancelToken: CancelToken) => {
    cancelToken.promise.then(() => t.pass())
    cancelToken.throwIfRequested()
    t.fail()
  }

  const source = CancelToken.source()
  source.cancel(ABORT)
  await t.throwsAsync(builder(source.token), ABORT.message)
})
