import test from 'ava'
import https from 'https'
import nock from 'nock'
import uuid from 'uuid'

import CancelToken from '../index'

const mockEndpoint = () => {
  const id = uuid()

  const domain = 'https://api.mish.guru'
  const path = `/${id}.json`
  const endpoint = domain + path
  const body = `response: ${id}`

  const scope = nock(domain)
    .get(path)
    .delayBody(2000)
    .reply(200, body)

  return { scope, endpoint, body }
}

const get = async (url: string, cancelToken: CancelToken): Promise<string> => {
  cancelToken.throwIfRequested()

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => (body += chunk))
      response.on('end', () => resolve(body))
      response.on('error', reject)
    })
    request.on('error', reject)

    cancelToken.promise.then((error) => {
      reject(error)
      request.abort()
    })
  })
}

test.cb('should successfully make a request', (t) => {
  const { scope, endpoint, body } = mockEndpoint()

  const source = CancelToken.source()

  get(endpoint, source.token)
    .then((info) => {
      t.is(info, body)
      scope.done()
      t.end()
    })
    .catch((error) => {
      t.fail(error)
    })
})

test('should not attempt to make the request', async (t) => {
  const { scope, endpoint } = mockEndpoint()

  const abortError = new Error(t.title)

  const source = CancelToken.source()
  source.cancel(abortError)

  const error = await t.throwsAsync(get(endpoint, source.token))

  t.is(scope.pendingMocks().length, 1)

  t.is(error, abortError)
})

test('should abort web request half way', async (t) => {
  const abortError = new Error(t.title)

  const { scope, endpoint } = mockEndpoint()

  const source = CancelToken.source()

  setTimeout(() => source.cancel(abortError), 1000)

  const error = await t.throwsAsync(get(endpoint, source.token))

  t.is(scope.pendingMocks().length, 0)

  t.is(error, abortError)
})
