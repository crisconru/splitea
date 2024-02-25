# splitea

[![build](https://github.com/crisconru/splitea/actions/workflows/publish.yml/badge.svg)](https://github.com/crisconru/splitea/actions/workflows/publish.yml)

It is a tool to split images into tiles or pieces. The idea is based on the project [image-splitter](https://github.com/achimoraites/image-splitter).

It has just one entry point with three arguments and the response is an array of tiles:

- `image`: The image to split. It is a string path or a buffer
- `tiles`: All the information to create the tiles
    - `mode`: How to cut the images
    - `rows` / `height`: Number of rows to be cut or height in px of each tile
    - `columns` / `width`: Number of columns to be cut or width in px of each tile
    - `unique`: Options to specify if you just want tiles not repeated
        - `distance`: Max distance between tiles to be filtered
        - `difference`: Max difference between tiles to be filtered
        - `requirement`: Condition to be filtered, one of them or both
- `output`: Information for the created tiles
    - `response`: Type of output, an array of Buffer (default) or the path of each tile
    - `store`: Information if you want to store the tiles in the computer or not
        - `path`: Where to store
        - `name`: Filename pattern
        - `extension`: Extension of the tiles

For the tiles there are only these possible combinations:

- `mode` = `"horizontal"` + (`columns` | `width`)
- `mode` = `"vertical"` + (`rows` | `height`)
- `mode` = `"grid"` + (`columns` + `rows` | `width` + `height`)

`columns` and `rows` are natural number while `width` and `height` are in pixels.

For the output the default type is buffer and it is not stored. If you want to store the tiles in the computer you'll have to add store object.

If you select response as `"path"` you have to add store object too.

```typescript
import { Splitea } from splitea

type Image = string | Buffer

type Tiles = {
  mode: "horizontal" | "vertical" | "grid",
  rows?: number,
  columns?: number,
  width?: number,
  height?: number,
  unique?: {
    distance: number,
    difference: number,
    requirement: "one" | "both"
  }
}

type Output = {
  response: "buffer" | "path",
  store?: {
    path: string,
    name: string,
    extension?: "jpg" | "jpeg" | "png" | "bmp" | "gif" | "tiff"
  }
}

const tiles: Promise<Image[]> = await Splitea(image: Image, tiles: Tiles, output: Output)
```
