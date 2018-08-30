import Vortex from './vortex'

const vortex = new Vortex(document.querySelector('#glCanvas'))

let fragment = document.getElementById('fragment').innerText
let vertex = document.getElementById('vertex').innerText

const simple_shader = vortex.build('shader')

simple_shader.load('fragment', fragment)
  .load('vertex', vertex)
  .compile()


function meshis() {
const triangleMesh = vortex.build('triangle')
let rnd = (n)=> (Math.random() * n) + 1

triangleMesh.mesh = [
  1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  1.0, -1.0, 0.0, -1.0, -1.0, 0.0
]

triangleMesh.position.center()
triangleMesh.position.move({x:rnd(105)-55, y:rnd(108)-58, z:rnd(38)-30 })
  return triangleMesh 
}
const scene = vortex.build('scene')
let m = []

for(let i=0; i<170; i++ ){
  let ms = meshis() 
  m.push({ms:ms, pos:Math.random() * 5})

  scene.addObject({mesh: ms, shader:simple_shader.variables()})
}


function newFrame() {
  let z = 0

  return () => {
    m.forEach((tm) => tm.ms.position.move({z: -5*Math.sin(tm.pos+=0.01)})) 

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



