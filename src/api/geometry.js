import {mat4} from 'gl-matrix'

class Mesh {
  constructor(Store) {
    this.Store = Store
    this._position = new Model()
  }

  set mesh(mesh) {
    this._mesh = new Float32Array(mesh)
    this.Store.upload(this._mesh)
  }

  get mesh(){
    return this._mesh
  }

  get buffer() {
    return this.Store.buffer
  }



  get position(){
    return this._position
  }
}

export class Model {
  constructor() {
    this.m4ModelView = mat4.create()
  }

  center() {
    mat4.translate(this.m4ModelView, this.m4ModelView, [0.0, 0.0, 0.0])
  }

  move({ x, y, z}) {
    mat4.translate(this.m4ModelView, mat4.create(), [x || 0, y || 0, z || 0])
  }

  get mat4() {
    return this.m4ModelView
  }
}

const POINT_LENGTH = 3
export class PointMesh extends Mesh {
  constructor(Store){
    super(Store)
  }

  get count() {
    return TRIANGLE_LENGTH
  }

  get style() {
    return this.Store.drawStyle.strip
  }


  get length() {
    return this.mesh.length / POINT_LENGTH
  }

  get style() {
    return this.Store.drawStyle.points
  }
}

const TRIANGLE_LENGTH = 3
export class TriangleMesh extends Mesh {
  constructor(Store){
    super(Store)
  }

  get count() {
    return TRIANGLE_LENGTH
  }

  get style() {
    return this.Store.drawStyle.strip
  }

  get length() {
    return this.mesh.length / TRIANGLE_LENGTH
  }
}
