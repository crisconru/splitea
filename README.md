# SPLITEA

[![version](https://img.shields.io/npm/v/splitea)](https://www.npmjs.com/package/splitea) [![Bundle size minified](https://img.shields.io/bundlephobia/min/splitea/latest)](https://img.shields.io/bundlephobia/min/splitea/latest) [![build](https://github.com/crisconru/splitea/actions/workflows/publish.yml/badge.svg)](https://github.com/crisconru/splitea/actions/workflows/publish.yml)

It is a tool to split images into pieces or tiles. Images can be splitted in three ways:

- Horizontal
  
    ```typescript
    import { horizontalTiles } from 'splitea'

    const tiles = await horizontalTiles(image, options)
    ```

- Vertical
  
    ```typescript
    import { verticalTiles } from 'splitea'

    const tiles = await verticalTiles(image, options)
    ```

- Grid
  
    ```typescript
    import { gridTiles } from 'splitea'

    const tiles = await gridTiles(image, options)
    ```

All the functions has two parameters:

1. `image`: A `string` with the path of the image or a `Buffer` with the content of the image.
2. `options`: An `object` with all the options available.

Below there are sections related to each split mode in a simple way.
If you want to know more details about `options` go to the last section.

## Horizontal

Image can be split by columns or width, but not both.

Get tiles by columns

```typescript
import { horizontalTiles } from 'splitea'

const numberOfColumns: number
// ...
const tiles = await horizontalTiles(image, { columns: numberOfColumns })
```

Get tiles by width

```typescript
import { horizontalTiles } from 'splitea'

const tilesWidth: number
// ...
const tiles = await horizontalTiles(image, { width: tilesWidth })
```

Related to options

```typescript
interface HorizontalOptions extends Options {
  columns?: number
  width?: number
}
```

## Vertical

Image can be split by rows or height, but not both.

Get tiles by rows

```typescript
import { verticalTiles } from 'splitea'

const numberOfRows: number
// ...
const tiles = await verticalTiles(image, { rows: numberOfRows })
```

Get tiles by width

```typescript
import { verticalTiles } from 'splitea'

const tilesHeight: number
// ...
const tiles = await verticalTiles(image, { height: tilesHeight })
```

Related to options

```typescript
interface VerticalOptions extends Options {
  rows?: number
  height?: number
}
```

## Grid

Image can be split by rows & columns or width & height, but not both.

Get tiles by rows & columns

```typescript
import { gridTiles } from 'splitea'

const numberOfRows: number
const numberOfColumns: number
// ...
const tiles = await gridTiles(image, { rows: numberOfRows, columns: numberOfColumns })
```

Get tiles by width & height

```typescript
import { gridTiles } from 'splitea'

const tilesWidth: number
const tilesHeight: number
// ...
const tiles = await gridTiles(image, { width: tilesWidth, height: tilesHeight })
```

Related to options

```typescript
interface GridOptions extends Options {
  rows?: number
  columns?: number
  width?: number
  height?: number
}
```

## Options

It is an object which gives you superpowers

```typescript
interface Options {
  // Output Options
  response: 'buffer' | 'file' // 'buffer' by default
  // Store options
  path?: string
  filename?: string
  extension?: 'png' | 'jpg' | 'jpeg' | 'giff' | 'tiff'
  // Unique options
  unique?: boolean // false by default
  uniqueRequirement: 'all' | 'distance' | 'difference' // 'all' by default
  distance?: number // Float between 0 - 1
  difference?: number // Float between 0 - 1
}
```

It can be divided in 3 cathegories:

1. Response: What to return.
2. Store Options: If you want to store the tiles in your computer.
3. Unique Options: If you want all tiles or non repeated tiles.

### Output Options

```typescript
interface Options {
  response: 'buffer' | 'file' // 'buffer' by default
}
```

The output is an array, `Buffer[]` or `string[]`.

The property for that is `response`. It can have just two values: `'buffer'` or `'file'`.

- `response = 'buffer'` then the output is `Buffer[]`.
- `response = 'file'` then the output is `string[]` where each element is the absolute path to each tile.

If `response = 'file'` then splitea needs to store in disk, so this implies to enter
at `path` property of the Store Options (check in the next section).

### Store Options

```typescript
interface Options {
  path?: string
  filename?: string
  extension?: 'png' | 'jpg' | 'jpeg' | 'giff' | 'tiff'
}
```

Splitea can store in disk all the tiles. If the output are the images in disk (`response = 'file'`), at least `path` is mandatory.

- `path`: Absolute path where tiles must be stored.
- `filename`: The main name of each tile. If none is provided, it has the value `'tile'`.
- `extension`: Image extension for all tiles. If none is provided, it has the value of the image extension.

### Unique Options

```typescript
interface Options {
  unique?: boolean // false by default
  uniqueRequirement: 'all' | 'distance' | 'difference' // 'all' by default
  distance?: number // Float between 0 - 1, 0.01 by default
  difference?: number // Float between 0 - 1, 0.01 by default
}
```

Splitea give you all the tiles by default. But it can give you only the non repeated tiles too.
To get that `unique = false`.

To check if the images are non repeated it uses two concepts:

- Distance means the Hamming distance of the pHash (percentual Hash algorithm).
- Difference means the difference between pixels using PixelMatch.

- `unique`: By default to false, if you need non repeated it needs to be true.
- `uniqueRequirement`: By default is `'all'`, which means to use distance and difference. If you only want to use one of them, the value should be `'distance'` or `'difference'`.
- `distance`: It is a float number between 0 and 1. It has `0.01` by default.
- `difference`: It is a float number between 0 and 1. It has `0.01` by default.

## Examples

```typescript
import { horizontalTiles, VerticalTiles, gridTiles } from 'splitea'
// ...
import fs from 'node:fs'

const imagePath = '/path/to/my/image'
const imageBuffer = fs.readFileSync(imagePath)
// ...
// Horizontal Tiles: 4 tiles
const horizontal = horizontalTiles(imagePath, { columns: 4 })
// Vertical Tiles: 5 tiles non-repeated
const vertical = verticalTiles(imageBuffer, { rows: 4, unique: true })
// Grid Tiles: Tiles of 40 x 60 px and stored in disk
const gridNoUniqueBuffer = gridTiles(
  imagePath,
  { width: 40, height: 60, path: '/store/path/grid', img: 'images' }
)
const gridUniqueImagesPath = gridTiles(
  imageBuffer,
  { width: 40, height: 60 , response: 'file', path: '/store/path/gridUnique', img: 'gridtiles' }
)

```
