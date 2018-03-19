import * as assert from 'assert'
import { echo } from '../src'

describe('index.ts', () => {
  it('echo', () => {
    assert(echo('hello') === 'hello')
  })
})
