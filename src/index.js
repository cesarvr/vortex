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
    this.triangleMesh = vortex.build('point')
    this.triangleMesh.mesh = [
      0.0, 0.0, 0.0
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
    this.x = this.polarx(angleInDegrees, radius)
    this.y = this.polary(angleInDegrees, radius)
    this.triangleMesh.position.move({x:this.x, y: this.y, z: this.z})
  }

  depth(value){
   this.z = value
   this.triangleMesh.position.move({x:this.x, y:this.y, z:value})
  }

  set speed(value) {
    this._speed = value
  }

  get speed(){
    return this._speed
  }

  get radius(){
    return this._radius
  }

  get angle(){
    return this._angle
  }

  get depthz(){
    return this.z
  }


  get mesh(){

    return {mesh: this.triangleMesh, shader:this.shader.use().variables()}
  }
}

function generateVortex(){
  const SIZE = 25
  const RADIUS = 51
  let slice = 360/SIZE
  let quads = []
  let pos = 0
  const rnd = n => (Math.random() * n)

  for(let z=0; z<SIZE; z++)
    for(let i=0; i<SIZE; i++){
      let quad = new Quad(shader)
      quad.moveToAngle(pos, RADIUS)
      quad.depth(-(z*20))
      quad.speed = rnd(2.5)+0.2

      pos += slice

      quads.push(quad)
    }
  return quads
}
let quads = generateVortex()
const scene = vortex.build('scene')
quads.forEach(quad => scene.addObject(quad.mesh))


function newFrame() {

  return () => {

    quads.forEach(quad => {
      let angle = quad.angle + quad.speed
      let z = quad.depthz + quad.speed
      if(z>65) z = -1000

      let radius = quad.radius
      quad.moveToAngle(angle, radius)
      quad.depth(z)
    })


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
