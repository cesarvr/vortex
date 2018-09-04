<script id="fragment">
 precision mediump float;

 void main(void) {
   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
 }
</script>
--------
vertex
--------
  attribute vec3 aVertexPosition;

  uniform mat4 MVP;

  void main(void) {
    gl_PointSize = 5.0;
    gl_Position = MVP * vec4(aVertexPosition, 1.0);
  }
