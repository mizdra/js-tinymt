# js-tinymt
The JavaScript implements of TinyMT for Pokémon RNG.


## :warning: Note :warning:
This library is not designed for common use, but for **Pokémon RNG**.
If you want to use for simulation and numerical analysis and so on,
**I recommend other library**.


## Installation

```bash
$ npm install @mizdra/tinymt -S
# or
$ yarn add @mizdra/tinymt
```


## Usage
```js
import { Tinymt32 } from '@mizdra/tinymt'

function u32 (num) {
  return num >>> 0
}
const param = {
  mat1: 0x8F7011EE,
  mat2: 0xFC78FF1F,
  tmat: 0x3793fdff,
}
const seed = 1
const status = [0xCCA24D8, 0x11BA5AD5, 0xF2DAD045, 0xD95DD7B2]

// Tinymt32.fromSeed(param, seed)
const rng1 = Tinymt32.fromSeed(param, seed)
console.assert(u32(rng1.gen()) === 2545341989)
console.assert(u32(rng1.gen()) === 981918433)
console.assert(
  [...Array(2)].map(_ => u32(rng1.gen())).toString() === [3715302833, 2387538352].toString()
)

// Tinymt32.fromStatus(param, status)
const rng2 = Tinymt32.fromStatus(param, status)
rng2.nextState()
console.assert(u32(rng2.temper()) === 2545341989)
console.assert(u32(rng2.gen()) === 981918433)
console.assert(u32(rng2.temper()) === 981918433)
for (let i = 0; i < 2; i++) { rng2.nextState() }
console.assert(
  rng1.status().map(u32).toString() === rng2.status().map(u32).toString()
)
```


## Suppoerted Feature of MersenneTwister-Lab/TinyMT
- [ ] tinymt32
  - [ ] tinymt32_next_state
  - [ ] tinymt32_temper
  - [ ] tinymt32_generate_uint32
  - [ ] tinymt32_generate_float
  - [ ] tinymt32_generate_float01
  - [ ] tinymt32_generate_float12
  - [ ] tinymt32_generate_floatOC
  - [ ] tinymt32_generate_floatOO
  - [ ] tinymt32_generate_32double
- [ ] tinymt64
  - [ ] tinymt64_next_state
  - [ ] tinymt64_temper
  - [ ] tinymt64_generate_uint64
  - [ ] tinymt64_generate_double
  - [ ] tinymt64_generate_double01
  - [ ] tinymt64_generate_double12
  - [ ] tinymt64_generate_doubleOC
  - [ ] tinymt64_generate_doubleOO

## License
- js-tinymt: [LICENSE](https://raw.githubusercontent.com/mizdra/js-tinymt/master/LICENSE)
- [MersenneTwister-Lab/TinyMT](https://github.com/MersenneTwister-Lab/TinyMT): [LICENSE_TINYMT](https://raw.githubusercontent.com/mizdra/js-tinymt/master/LICENSE_TINYMT) (Original: [LICENSE.txt](https://raw.githubusercontent.com/MersenneTwister-Lab/TinyMT/master/LICENSE.txt))