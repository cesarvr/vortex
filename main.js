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
        // Set clear color to black, fully opaque

        return { gl:gl, width: canvas.width, height: canvas.height }
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

            this.data.uMatrix = this.webGL.getUniformLocation(this.program, 'uPMatrix')
            this.data.mMatrix = this.webGL.getUniformLocation(this.program, 'uMVMatrix')

            console.log('error->', gl.getError())


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
            console.log('error->', gl.getError())
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

    class DObject {
        constructor() {
            this.m4ModelView = mat4.create();
        }

        center() {
          debugger
            mat4.translate(this.m4ModelView, this.m4ModelView, [2.0, 0.0, -7.0]);
        }

        getMatrix() {
            return this.m4ModelView
        }
    }


    class Scene {
        constructor(opts) {
            this.objects = []
            this.gl = opts.gl
            this.width = opts.width
            this.height = opts.height
            this.pMatrix = mat4.create();
//this.width / this.heigh
            mat4.perspective(this.pMatrix, 45, 500/500, 0.1, 100.0);
        }

        addObject(object) {
            this.objects.push(object)
        }

        render() {
          this.objects.forEach((obj)=> this.paint(obj))
        }

        paint(object) {
            let gl = this.gl

            console.log('error->', gl.getError())

          
            gl.clearColor(0.5, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);



            gl.viewport(0, 0, this.width, this.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, object.vbuffer);
            gl.vertexAttribPointer(object.shader.vertex, 3, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(object.shader.uMatrix, false, this.pMatrix);
            gl.uniformMatrix4fv(object.shader.mMatrix, false, object.position);


            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            console.log('error->', gl.getError())
        }

    }

    const {gl, width, height } = start()

    let fragment = document.getElementById('fragment').innerText
    let vertex = document.getElementById('vertex').innerText

    let shader = new Shader({
        fragment: fragment,
        vertex: vertex,
        gl: gl
    })

    shader.setup()

    let vertices = [
        1.0, 1.0, 0.0, 
       -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0, 
       -1.0, -1.0, 0.0
    ]

    let store = new Store({
        vertices: vertices,
        gl: gl
    })

   let obj = new DObject()
  obj.center()


    let scene = new Scene({
        gl: gl,
        height: height,
        width: width
    })

     scene.addObject({
        shader: shader.variables(),
        position: obj.getMatrix(),
        vbuffer: store.buffer
    })

    scene.render()


})()
