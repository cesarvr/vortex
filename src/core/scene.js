import { mat4 } from 'gl-matrix'

export class Scene {
  constructor({gl}) {
    this.width = 640
    this.height = 480

    this.objects = []
    this.gl = gl
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
    mat4.multiply(mvp, this.camera_m4, object.mesh.position.mat4)
    mat4.multiply(mvp, this.projection_m4, mvp)


    gl.clearColor(0.2, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    gl.viewport(0, 0, this.width, this.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.buffer)
    gl.vertexAttribPointer(object.shader.vertex, object.mesh.count, gl.FLOAT, false, 0, 0)

    gl.uniformMatrix4fv(object.shader.MVP, false, mvp)

    gl.drawArrays(object.mesh.style, 0, object.mesh.length)
    gl.getError()
  }

}
