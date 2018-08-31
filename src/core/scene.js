import { mat4 } from 'gl-matrix'

const deg_to_rad = (deg) => (deg * Math.PI) / 180

export class Scene {
  constructor({gl}) {
    this.width = 1048
    this.height = 709 

    this.objects = []
    this.gl = gl
    this.projection_m4 = mat4.create()
    this.camera_m4 = mat4.create()

    mat4.perspective(this.projection_m4, deg_to_rad(45), 1920 / 1080 , 0.1, 1000.0)
    mat4.lookAt(this.camera_m4, [0, 0, 43], [0, 0, 0], [0, 1, 0])

    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.enable(gl.DEPTH_TEST)
  }

  addObject(object) {
    this.objects.push(object)
  }

  render() {
    let gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.objects.forEach((obj) => this.paint(obj))
  }

  paint(object) {
    let gl = this.gl

    let mvp = mat4.create()
    mat4.multiply(mvp, this.camera_m4, object.mesh.position.mat4)
    mat4.multiply(mvp, this.projection_m4, mvp)


    gl.bindBuffer(gl.ARRAY_BUFFER, object.mesh.buffer)
    gl.vertexAttribPointer(object.shader.vertex, object.mesh.count, gl.FLOAT, false, 0, 0)
    gl.uniformMatrix4fv(object.shader.MVP, false, mvp)

    gl.drawArrays(object.mesh.style, 0, object.mesh.length)
    gl.getError()
  }

}
