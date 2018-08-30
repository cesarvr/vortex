import {Buffer, Shader} from './core/gl'
import { Scene } from './core/scene'
import {TriangleMesh} from './api/geometry'

function TriangleBuilder(gl) {
  return new TriangleMesh(new Buffer(gl))
}

const factory = { 'buffer': Buffer, 'shader': Shader, 'triangle': TriangleBuilder, 'scene':Scene }

export default class Vortex {
  constructor({canvasElement}) {

    this.canvas = document.querySelector('#glCanvas')

    // Initialize the GL context
    this.webGL = this.canvas.getContext('webgl')

    // Only continue if WebGL is available and working
    if (this.webGL === null) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      throw('Unable to initialize WebGL. Your browser or machine may not support it.')
    }


    // handle event
    let self = this
    //self.webGL.viewport(0, 0, 1920, 1080)
    //self.webGL.viewport(0, 0, 640, 480)
    /*window.addEventListener("resize", () => {
        console.log("Resource conscious resize callback!");
        let width = self.canvas.clientWidth //offsetWidth
        let height = self.canvas.clientHeight //offsetHeight
        console.log(`width:${width} height:${height}`)
    });*/

  }

  build(name) {
    let object = factory[name]
    if(!object)
      throw 'Object not found!.'

    return new object({gl:this.webGL})
  }

}
