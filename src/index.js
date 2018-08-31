import Vortex from './vortex'

const vortex = new Vortex(document.querySelector('#glCanvas'))

function initShader(vortex) {
  let fragment = document.getElementById('fragment').innerText
  let vertex = document.getElementById('vertex').innerText

  const simple_shader = vortex.build('shader')
  return simple_shader
    .load('fragment', fragment)
    .load('vertex', vertex)
    .compile()
}

const shader = initShader(vortex)

class Quad {

  constructor(shader){
    this.triangleMesh = vortex.build('triangle')
    this.triangleMesh.mesh = [
      1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ]
    this.triangleMesh.position.center()
    const rad_to_deg = rad => rad*180/Math.PI
    const deg_to_rad = deg => deg * Math.PI / 180
    this.polarx = (i,radius)=> Math.cos(deg_to_rad(i))*radius
    this.polary = (i,radius)=> Math.sin(deg_to_rad(i))*radius

    this.shader = shader
  }

  moveToAngle(angleInDegrees, radius) {
    this._angle = angleInDegrees
    this._radius = radius
    this.triangleMesh.position.move({x:this.polarx(angleInDegrees, radius), y: this.polary(angleInDegrees, radius)})
  }

  depth(value){
   this.triangleMesh.position.move({z:value})
  }

  get radius(){
    return this._radius
  }

  get angle(){
    return this._angle
  }
  get mesh(){

    return {mesh: this.triangleMesh, shader:this.shader.use().variables()}
  }
}

function generateVortex(){
  debugger
  const SIZE = 4
  const RADIUS = 8
  let slice = 360/SIZE
  let quads = []
  for(let i=0; i<SIZE; i++){
    let quad = new Quad(shader)
    quad.moveToAngle(slice, RADIUS)

    quads.push(quad)
  }
  return quads
}
let quads = generateVortex()
const scene = vortex.build('scene')
quads.forEach(quad => scene.addObject(quad.mesh))


function newFrame() {

  return () => {
    scene.render()
  }
}


function render(newFrame) {

  return function getNextFrame(timestamp) {

    newFrame()
    window.requestAnimationFrame(getNextFrame)
  }
}

window.requestAnimationFrame(render(newFrame()))
