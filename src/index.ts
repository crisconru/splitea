import path from 'path'
import { Mode } from './enums'
import { Splitea } from './splitea'
import { Options } from './types'

const IMG = path.join(__dirname, '..', 'examples', 'mapabosque.png')
console.log(IMG)
const OPTIONS: Options = {
  mode: Mode.Grid
}

// Splitea.getSize(IMG)
//   .then(size => {
//     console.log(`width: ${size.width}\nheight: ${size.height}`)
//   })
//   .catch(err => console.log(err))

Splitea(IMG, OPTIONS)
  .then(res => console.log(res))
  .catch(error => console.error(error))
