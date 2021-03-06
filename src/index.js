import Vortex from './vortex'
import {loadImage, XORTexture} from './api/tools'
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


function initTexture(shader){

  let texture = vortex.build('texture')

//  loadImage('sprites/star_4.png')
  //  .then((image)=>texture.load(image))

  texture.load(XORTexture(64))

  texture.setShaderTextureValue(shader.variables().texture)

  return texture
}


class Quad {

  constructor({shader, texture}) {
    this.triangleMesh = vortex.build('point')
    this.triangleMesh.mesh = [
      0.0, 0.0, 0.0
    ]

    this.triangleMesh.position.center()
    const rad_to_deg = rad => rad*180/Math.PI
    const deg_to_rad = deg => deg * Math.PI / 180
    this.polarx = (i,radius)=> Math.cos(deg_to_rad(i))*radius
    this.polary = (i,radius)=> Math.sin(deg_to_rad(i))*radius

    this.texture = texture
    this.shader = shader
  }

  moveToAngle(angleInDegrees, radius) {
    this._angle = angleInDegrees
    this._radius = radius
    this.x = this.polarx(angleInDegrees, radius)
    this.z = this.polary(angleInDegrees, radius)
    this.triangleMesh.position.move({x:this.x, y: this.y, z: this.z})
  }

  depth(value){
   this.y = value
   this.triangleMesh.position.move({x:this.x, y:this.y, z:this.z})
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
    return this.y
  }

  get mesh(){
    return {mesh: this.triangleMesh, shader:this.shader.use().variables(), texture: this.texture}
  }
}

function generateVortex(){
  const shader = initShader(vortex)
  const texture = initTexture(shader)

  const SIZE = 24
  const RADIUS = 10
  let slice = 360/SIZE
  let particles = []
  let pos = 0
  const rnd = n => (Math.random() * n)

  for(let z=0; z<SIZE; z++)
    for(let i=0; i<SIZE; i++){
      let particle = new Quad({texture, shader})
      particle.moveToAngle(pos, rnd(RADIUS))
      particle.depth(rnd(365)*-1)
      particle.speed = rnd(.9)+0.01
      particle.arc = rnd(1)

      pos += slice
      particles.push(particle)
    }
  return particles
}

let particles = generateVortex()
const scene = vortex.build('scene')
particles.forEach(particle => scene.addObject(particle.mesh))


function newFrame() {

  return () => {

    particles.forEach(particle => {
      let angle = particle.angle + particle.arc
      let z = particle.depthz + particle.speed
      if(z>365) z = -100

      let radius = particle.radius
      particle.moveToAngle(angle, radius)
      particle.depth(z)
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
