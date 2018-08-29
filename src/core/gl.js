export class Buffer {
  constructor({gl}) {
    this.gl = gl
  }

  upload(vertices) {
   let gl = this.gl
   this._buffer = gl.createBuffer()
   gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  }

  get drawStyle() {
    return {'strip': this.gl.TRIANGLE_STRIP}
  }

  get buffer() {
    return this._buffer
  }

  set buffer(buffer) {
    this._buffer = buffer
  }

}


export class Shader {

  create(shader_type, code) {
    let gl = this.gl
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
    this.data.vertex = this.gl.getAttribLocation(this.program, 'aVertexPosition')
    this.gl.enableVertexAttribArray(this.data.vertex)

    this.data.MVP = this.gl.getUniformLocation(this.program, 'MVP')
  }

  variables() {
    return this.data
  }

  loadFragmentShader(source) {
    this.fragment = this.create(this.gl.FRAGMENT_SHADER, source)
    return this
  }

  loadVertexShader(source) {
    this.vertex = this.create(this.gl.VERTEX_SHADER, source)
    return this
  }

  load(type, source) {
    let shaderType = {'vertex':this.gl.VERTEX_SHADER, 'fragment': this.gl.FRAGMENT_SHADER}
    this.shader_code[type] = this.create(shaderType[type], source)
    return this
  }

  compile() {
    let gl = this.gl
    let _program = gl.createProgram()
    gl.attachShader(_program, this.shader_code.vertex)
    gl.attachShader(_program, this.shader_code.fragment)
    gl.linkProgram(_program)

    if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
      alert('Could not initialise shaders')
    }

    gl.useProgram(_program)
    this.program = _program
    this.setup()
    return this
  }

  constructor({gl}) {
    this.program = null
    this.data = {}
    this.gl = gl
    this.shader_code = {}
  }
}
