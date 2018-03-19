const MIN_LOOP = 8
const PRE_LOOP = 8
const TINYMT32_MASK = 0x7fffffff
const TINYMT32_SH0 = 1
const TINYMT32_SH1 = 10
const TINYMT32_SH8 = 8

export interface Param {
  mat1: number,
  mat2: number,
  tmat: number,
}

export class Rng {
  constructor (
    private readonly param: Param,
    private _status: number[],
  ) {}

  status (): number[] {
    return [...this._status]
  }
  nextState (): void {
    let x: number
    let y: number

    y = this._status[3]
    x = (this._status[0] & TINYMT32_MASK)
      ^ this._status[1]
      ^ this._status[2]
    x ^= x << TINYMT32_SH0
    y ^= (y >>> TINYMT32_SH0) ^ x
    this._status[0] = this._status[1]
    this._status[1] = this._status[2]
    this._status[2] = x ^ (y << TINYMT32_SH1)
    this._status[3] = y
    this._status[1] ^= (-((y & 1)) >>> 0) & this.param.mat1
    this._status[2] ^= (-((y & 1)) >>> 0) & this.param.mat2
    return
  }
  temper (): number {
    let t0 = this._status[3]
    const t1 = this._status[0] + (this._status[2] >>> TINYMT32_SH8)
    t0 ^= t1
    t0 ^= -((t1 & 1)) & this.param.tmat
    return t0
  }
  gen (): number {
    this.nextState()
    return this.temper()
  }
}

export function fromSeed (param: Param, seed: number): Rng {
  const status = [
    seed,
    param.mat1,
    param.mat2,
    param.tmat,
  ]
  for (let i = 1; i < MIN_LOOP; i++) {
    const a = i & 3
    const b = (i - 1) & 3
    status[a] ^= i + Math.imul(1812433253, (status[b] ^ (status[b] >>> 30)))
  }
  const rng = new Rng(param, periodCertification(status))

  for (let i = 0; i < PRE_LOOP; i++) {
    rng.nextState()
  }

  return rng
}

export function fromStatus (param: Param, status: number[]): Rng {
  return new Rng({ ...param }, [...status])
}

function periodCertification (status: number[]): number[] {
  if ((status[0] & TINYMT32_MASK) === 0 &&
    status[1] === 0 &&
    status[2] === 0 &&
    status[3] === 0) {
    return ['T', 'I', 'N', 'Y'].map((c) => c.codePointAt(0) as number)
  }
  return status
}
