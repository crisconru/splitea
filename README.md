# splitea

[![Node.js CI](https://github.com/crisconru/splitea/actions/workflows/node.js.yml/badge.svg)](https://github.com/crisconru/splitea/actions/workflows/node.js.yml)

Is a tool to split images. The code is based on [image-splitter](https://github.com/achimoraites/image-splitter) code.

The idea is that you tell to the lib what source image to use and:

- N images per row and M images per colum -> You get image splitted into N x M images.
- N px per row and M px per colum -> You get image splitted into images with N x M px.

Then you tell if you want to store them and how to return data.

Inputs are two arguments:

1. `image` -> Source image => `String` (local file or url) | `Buffer` | `Jimp Object`
2. `options` -> JSON with next properties:
   1. `mode` -> Split mode => `grid` (by default) | `vertical` | `horizontal`
   2. `tiles` -> JSON with properties related to the slices or commonly known as tiles
      1. `rows` -> Number of rows
      2. `columns` -> Number of columns
      3. `width` -> Width in pixels per tile
      4. `height` -> Height in pixels per tile
      5. `unique` -> If you need all tiles or non-repeated => `false` (all tiles by default) | `true` (non-repeated tiles)
   3. `output` -> JSON with properties related to the output / return data and how store it
      1. `data` -> Type of data to be returned => `buffer` (default) | `path` (local path)
      2. `path` -> Local path to save the tiles
      3. `name` -> Preffix name to save the tiles
      4. `extension` -> Supported extension to save tiles => `jpg` | `png` | `bmp` | `gif` | `tiff`
