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
    return []
  }
  nextState (): void {
    return
  }
  temper (): number {
    return 1
  }
  gen (): number {
    return 1
  }
}

export function fromSeed (param: Param, seed: number): Rng {
  return new Rng(param, [])
}

export function fromStatus (param: Param, status: number[]): Rng {
  return new Rng(param, status.slice())
}
