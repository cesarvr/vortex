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
