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
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT)

        return gl
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

        constructor(opts) {
            this.program = null
            this.webGL = opts.gl
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
      constructor (opts) {
        let gl = opts.gl
        this.buffer = gl.createBuffer() 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(opts.vertices), gl.STATIC_DRAW)
      }
    
    
    }


    const gl = start()

    let fragment = document.getElementById('fragment').innerText
    let vertex = document.getElementById('vertex').innerText

    let shader = new Shader({
        fragment: fragment
        vertex: vertex,
        gl: gl
    })

    let vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ]

    let buffer = new Store() 



})()
