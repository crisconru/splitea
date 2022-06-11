import * as Splitea from './splitea'

const IMG = './src/Ericsatie.jpg'

// Splitea.getSize(IMG)
//   .then(size => {
//     console.log(`width: ${size.width}\nheight: ${size.height}`)
//   })
//   .catch(err => console.log(err))

// console.log('--------------------------------------------------------------')

// Splitea.getSlicesVertical(IMG, 2)
//   .then(slices => {
//     if (slices.length > 0) {
//       slices.map((slice, index) => {
//         console.log(`${index} - width: ${slice.bitmap.width} px | height: ${slice.bitmap.height} px`)
//         return 1
//       })
//     }
//   })
//   .catch(error => console.log(error))

// console.log('--------------------------------------------------------------')
// (async () => {
//   try {
//     const imgs = await Splitea.splitImageVertical(IMG, 2)
    
//   } catch (error) {
//     console.error(error)
//   }
// })()
Splitea.splitImageVertical(IMG, 2)
  .then(imgs => {
    console.log('Images Vertical')
    imgs.map(img => console.log(img))
  })
  .catch(err => console.log(err))

console.log('--------------------------------------------------------------')

Splitea.splitImageHorizontal(IMG, 2)
  .then(imgs => {
    console.log('Images Horizontal')
    imgs.forEach(img => console.log(img))
  })
  .catch(err => console.log(err))
