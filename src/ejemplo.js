import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const IMG_FOLDER = path.join(__dirname, '..', 'tests')
const horizontal = {
  path: path.join(IMG_FOLDER, 'chess_horizontal.png'),
  width: 720,
  height: 90
}

const img = sharp(horizontal.path)
const tile = img.clone().extract({ top: 0, left: 180, width: 90, height: 90 })
const metadata = await tile.metadata()
console.log(`width = ${metadata.width} - height = ${metadata.height}`)
const filename = path.join(__dirname, 'tile.png')
await tile.toFile(filename)

const saved = await sharp(filename).metadata()
console.log(`width = ${saved.width} - height = ${saved.height}`)
