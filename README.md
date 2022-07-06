# splitea

[![Node.js CI](https://github.com/crisconru/splitea/actions/workflows/node.js.yml/badge.svg)](https://github.com/crisconru/splitea/actions/workflows/node.js.yml)

Is a tool to split images. The code is based on [image-splitter](https://github.com/achimoraites/image-splitter) code.

The idea is that you tell to the lib what image and:

- N images per row and M images per colum -> You get image splitted into N x M images.
- N px per row and M px per colum -> You get image splitted into images with N x M px.

Dos parámetros:

1. `image` puede ser String (fichero local o url) o Buffer o Jimp Object
2. `options` es un JSON con los campos
   1. `mode` -> Split mode `grid` (by default) | `vertical` | `horizontal`
   2. `slices` -> Number of slices
   3. `width` -> Width in pixels per slice
   4. `height` -> Height in pixels per slice
   5. `name` -> name to the slices
   6. `extension` -> extension to the slices
   7. `unique` -> only non-repeated slices with `true`, `false` by default  

Si `image` no es un fichero local entonces en `options` tiene que venir si o si lo siguiente:

- `name`
- ¿`extension`?

