(function() {
  const start = () => {
    const canvas = document.querySelector('#glCanvas')

    // Initialize the GL context
    const gl = canvas.getContext('webgl')

    // Only continue if WebGL is available and working
    if (gl === null) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      return
    }

    // Set clear color to black, fully opaque

    return {
      gl: gl,
      width: canvas.width,
      height: canvas.height
    }
  }

  class Shader {

    create(shader_type, code) {
      let shader = gl.createShader(shader_type)
      gl.shaderSource(shader, code)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader))
        throw gl.getShaderInfoLog(shader)
      }

      return shader
    }

    setup() {
      this.data.vertex = this.webGL.getAttribLocation(this.program, 'aVertexPosition')
      this.webGL.enableVertexAttribArray(this.data.vertex)

      this.data.MVP = this.webGL.getUniformLocation(this.program, 'MVP')
    }

    variables() {
      return this.data
    }

    constructor(opts) {
      this.program = null
      this.webGL = opts.gl
      this.data = {}

      let gl = opts.gl

      let fragment = this.create(gl.FRAGMENT_SHADER, opts.fragment)
      let vertex = this.create(gl.VERTEX_SHADER, opts.vertex)

      let _program = gl.createProgram()
      gl.attachShader(_program, vertex)
      gl.attachShader(_program, fragment)
      gl.linkProgram(_program)

      if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
        alert('Could not initialise shaders')
      }

      gl.useProgram(_program)

      this.program = _program
    }
  }

  class Store {
    constructor(opts) {
      let gl = opts.gl
      this.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(opts.vertices), gl.STATIC_DRAW)
    }

    buffer() {
      return this.buffer
    }
  }

  function TriangleMesh({ gl, vertices }) {
    let store = new Store({  gl, vertices })

    let count = vertices.length / 3
    let length = 3

    return {
      get buffer() {
        return store.buffer
      },

      get count() {
        return count 
      },

      get length() {
        return length
      },

      get glDrawMethod() {
        return gl.TRIANGLE_STRIP
      }
    }
  }



  class Model {
    constructor() {
      this.m4ModelView = mat4.create()

    }

    center() {
      mat4.translate(this.m4ModelView, this.m4ModelView, [0.0, 0.0, 0.0])
    }

    move({ x, y, z}) {
      mat4.translate(this.m4ModelView, this.m4ModelView, [x || 0, y || 0, z || 0])
    }

    matrix() {
      return this.m4ModelView
    }
  }


  class Scene {
    constructor(opts) {
      this.width = opts.width
      this.height = opts.height

      this.objects = []
      this.gl = opts.gl
      this.projection_m4 = mat4.create()
      this.camera_m4 = mat4.create()

      //this.width / this.heigh
      mat4.perspective(this.projection_m4, 45, this.width / this.height, 0.1, 300.0)
      mat4.lookAt(this.camera_m4, [0, 0, -6], [0, 0, 0], [0, 10, -20])

    }

    addObject(object) {
      this.objects.push(object)
    }

    render() {
      this.objects.forEach((obj) => this.paint(obj))
    }

    paint(object) {
      let gl = this.gl

      let mvp = mat4.create()
      mat4.multiply(mvp, this.camera_m4, object.model.matrix())
      mat4.multiply(mvp, this.projection_m4, mvp)


      gl.clearColor(0.2, 0.0, 0.0, 1.0)
      gl.enable(gl.DEPTH_TEST)

      gl.viewport(0, 0, this.width, this.height)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.bindBuffer(gl.ARRAY_BUFFER, object.geometry.buffer)
      gl.vertexAttribPointer(object.shader.vertex, object.geometry.length, gl.FLOAT, false, 0, 0)

      gl.uniformMatrix4fv(object.shader.MVP, false, mvp)

      gl.drawArrays(object.geometry.glDrawMethod, 0, object.geometry.count)
    }

  }

  const { gl, width, height } = start()

  let fragment = document.getElementById('fragment').innerText
  let vertex = document.getElementById('vertex').innerText

  let shader = new Shader({
    fragment: fragment,
    vertex: vertex,
    gl: gl
  })

  shader.setup()



  let vertices = [
    1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0, -1.0, -1.0, 0.0
  ]

  this.quad = new TriangleMesh({ vertices: vertices, gl: gl })


  let obj = new Model()
  obj.center()


  let scene = new Scene({
    gl: gl,
    height: height,
    width: width
  })

  scene.addObject({
    shader: shader.variables(),
    model: obj,
    geometry: quad
  })


  function newFrame() {
    let z = 0

    return () => {
      obj.move({
        z: Math.sin(z += 0.01)
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
})()
