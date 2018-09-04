export function loadImage(imageURL) {
  let image = new Image()
  image.crossOrigin = ''
  return new Promise( (resolve, reject) => {
    image.onload = function() {
      resolve(image)
    }

    image.onerror = function(e){
      reject('Error: '+e)
    }

    image.src = imageURL
  })
}

export function XORTexture(size) {
  let pix = []

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let xor = x ^ y;
      pix.push(xor) // r
      pix.push(xor) // g
      pix.push(xor) // b 
    }
  }

  return new Uint8Array(pix)
}
