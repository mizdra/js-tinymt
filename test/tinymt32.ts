import * as assert from 'assert'
import { Tinymt32 } from '..'

const { fromSeed, fromStatus } = Tinymt32

const PARAM: Tinymt32.Param = {
  mat1: 0x8F7011EE,
  mat2: 0xFC78FF1F,
  tmat: 0x3793fdff,
}
const STATUS = [0x63B07A71, 0x5740A11A, 0x3CFE1DE3, 0x08A80987]
function u32 (num: number): number {
  // tslint:disable-next-line:no-bitwise
  return num >>> 0
}
function u32Obj (obj: any): typeof obj {
  const newObj: typeof obj = {}
  Object.keys(obj).forEach((key, index) => {
    newObj[key] = u32(obj[key])
  })
  return newObj
}

describe('tinymt32', () => {
  it('should transfer a next status', () => {
    const rng = fromStatus(PARAM, STATUS)
    for (let i = 0; i < 100; i++) {
      rng.nextState()
    }
    assert.deepEqual(rng.status().map(u32), [0xB2A870B4, 0x497FA995, 0xC8514463, 0x87BC580F])
  })
  it('should generate a random number', () => {
    const rng = fromStatus(PARAM, STATUS)
    for (let i = 0; i < 100; i++) {
      rng.nextState()
    }
    assert(u32(rng.temper()) === 0x34CC99F7)
  })
  it('should not overwrite the internal param', () => {
    const param = PARAM
    const rng = fromStatus(param, STATUS)

    param.mat1 = 0
    assert.deepEqual(u32Obj(rng.param()), { mat1: 0x8F7011EE, mat2: 0xFC78FF1F, tmat: 0x3793fdff })

    const internalParam = rng.param()
    internalParam.mat1 = 1

    assert.deepEqual(u32Obj(rng.param()), { mat1: 0x8F7011EE, mat2: 0xFC78FF1F, tmat: 0x3793fdff })
  })
  it('should not overwrite the internal status', () => {
    const status = STATUS
    const rng = fromStatus(PARAM, status)

    status[0] = 0
    assert.deepEqual(rng.status().map(u32), [0x63B07A71, 0x5740A11A, 0x3CFE1DE3, 0x08A80987])

    const internalStatus = rng.status()
    internalStatus[0] = 1

    assert.deepEqual(rng.status().map(u32), [0x63B07A71, 0x5740A11A, 0x3CFE1DE3, 0x08A80987])
  })
  it('should be independence from cloned one', () => {
    const rng1 = fromStatus(PARAM, STATUS)
    rng1.nextState()
    const rng2 = rng1.clone()
    rng2.nextState()
    assert(u32(rng1.temper()) === 0xE83FF36F)
    assert(u32(rng2.temper()) === 0x9E6BA88F)
  })
  it('should pass check32 test', () => {
    const param: Tinymt32.Param = {
      mat1: 0x8F7011EE,
      mat2: 0xFC78FF1F,
      tmat: 0x3793fdff,
    }
    const seed = 1
    const rng = fromSeed(param, seed)

    const actual = [...Array(50)].map((_) => u32(rng.gen()))
    const expected = `
2545341989  981918433 3715302833 2387538352 3591001365 \
3820442102 2114400566 2196103051 2783359912  764534509
 643179475 1822416315  881558334 4207026366 3690273640
3240535687 2921447122 3984931427 4092394160   44209675
2188315343 2908663843 1834519336 3774670961 3019990707
4065554902 1239765502 4035716197 3412127188  552822483
 161364450  353727785  140085994  149132008 2547770827
4064042525 4078297538 2057335507  622384752 2041665899
2193913817 1080849512   33160901  662956935  642999063
3384709977 1723175122 3866752252  521822317 2292524454
    `
      .split(/\s/)
      .filter((numStr) => numStr !== '')
      .map((numStr) => parseInt(numStr, 10))
    assert.deepEqual(actual, expected)
  })
  it('should pass readme example', () => {
    const param: Tinymt32.Param = {
      mat1: 0x8F7011EE,
      mat2: 0xFC78FF1F,
      tmat: 0x3793fdff,
    }
    const seed = 1
    const status = [0xCCA24D8, 0x11BA5AD5, 0xF2DAD045, 0xD95DD7B2]

    // Tinymt32.fromSeed(param, seed)
    const rng1 = Tinymt32.fromSeed(param, seed)
    assert(u32(rng1.gen()) === 2545341989)
    assert(u32(rng1.gen()) === 981918433)
    assert.deepEqual(
      [...Array(2)].map((_) => u32(rng1.gen())),
      [3715302833, 2387538352],
    )

    // Tinymt32.fromStatus(param, status)
    const rng2 = Tinymt32.fromStatus(param, status)
    rng2.nextState()
    assert(u32(rng2.temper()) === 2545341989)
    assert(u32(rng2.gen()) === 981918433)
    assert(u32(rng2.temper()) === 981918433)
    for (let i = 0; i < 2; i++) { rng2.nextState() }
    assert.deepEqual(
      rng1.status().map(u32),
      rng2.status().map(u32),
    )
  })
})
