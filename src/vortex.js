import {Buffer, Shader, Texture} from './core/gl'
import { Scene } from './core/scene'
import {TriangleMesh, PointMesh} from './api/geometry'

function MeshBuilder(Mesh) {
  return function(gl){
    return new Mesh(new Buffer(gl))
  }
}

const factory = { 'buffer': Buffer,
                  'shader': Shader,
                  'texture': Texture,
                  'triangle': MeshBuilder(TriangleMesh),
                  'point': MeshBuilder(PointMesh),
                  'scene':Scene
                }

function resize_viewport({canvas, webGL}) {
  console.log("Resource conscious resize callback!")

  let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1.0
  let width  = pixelRatio * canvas.clientWidth
  let height = pixelRatio * canvas.clientHeight

  canvas.width = width
  canvas.height = height

  console.log(`width:${width} height:${height}`)
  webGL.viewport(0, 0, webGL.drawingBufferWidth, webGL.drawingBufferHeight)
}

export default class Vortex {
  constructor({canvasElement}) {

    let canvas = document.querySelector('#glCanvas')

    // Initialize the GL context
    const webGL = canvas.getContext('webgl')
    this.webGL =  webGL

    // Only continue if WebGL is available and working
    if (webGL === null) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      throw('Unable to initialize WebGL. Your browser or machine may not support it.')
    }


    // handle event
    window.addEventListener("resize", function() {
      resize_viewport({canvas: canvas, webGL:webGL })
    })

    resize_viewport({canvas: canvas, webGL:webGL })
  }

  build(name) {
    let object = factory[name]
    if(!object)
      throw 'Object not found!.'

    return new object({gl:this.webGL})
  }
}
