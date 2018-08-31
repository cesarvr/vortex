import Vortex from './vortex'

const vortex = new Vortex(document.querySelector('#glCanvas'))

let fragment = document.getElementById('fragment').innerText
let vertex = document.getElementById('vertex').innerText

const simple_shader = vortex.build('shader')

simple_shader.load('fragment', fragment)
  .load('vertex', vertex)
  .compile()

const rad_to_deg = rad => rad*180/Math.PI
const deg_to_rad = (deg)  => (deg * Math.PI) / 180
const polarx = (i,radius) => Math.cos(deg_to_rad(i)) * radius
const polary = (i,radius) => Math.sin(deg_to_rad(i)) * radius 
const polar3d = (deg,rad) =>{return  { x: polarx(deg,rad), y: polary(deg,rad), z:0 }}



function meshis(i, z) {

  let rnd = (n)=> (Math.random() * n) + 1
  const margin = (360/5) 
  const deg_to_rad = (deg) => (deg * Math.PI) / 180
  const polarx = (i,radius)=> Math.cos(deg_to_rad(i))*radius 
  const polary = (i,radius)=> Math.sin(deg_to_rad(i))*radius 

  const triangleMesh = vortex.build('triangle')
  triangleMesh.mesh = [
    1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0, -1.0, -1.0, 0.0
  ]

  let position = polar3d(i*margin,10) 
  position.z = -(z*40)

  triangleMesh.position.center()
  triangleMesh.position.move(position) //-(z*40) })
  return {model: triangleMesh, position: position  }
}

const scene = vortex.build('scene')
let m = []


for(let z=0; z<1; z++) {
  for(let i=0; i<5; i++ ){
    let ms = meshis(i,z) 
    m.push(ms)

    scene.addObject({mesh: ms.model, shader:simple_shader.variables()})
  }
}

function update(obj, z) {

 return obj 
}

function newFrame() {
  let z = 0.1

  return () => {

    m.forEach(obj  => { update(obj, z) }  )
    z+=1
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



