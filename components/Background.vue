<template>
  <div class="background">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const canvas = ref(null)
let gl
let program
let lastTime = 0
let animationFrame
let mouseX = 0.5
let mouseY = 0.5

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse;
    
    // Time varying pixel color
    float t = uTime * 0.2;
    
    // Create smooth waves
    float wave1 = sin(uv.x * 4.0 + t) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 5.0 - t * 1.5) * 0.5 + 0.5;
    
    // Mouse influence on waves
    float dist = length(uv - mouse);
    float mouseFactor = smoothstep(0.4, 0.0, dist);
    
    vec3 color1 = vec3(0.07, 0.09, 0.15); // Dark blue
    vec3 color2 = vec3(0.13, 0.07, 0.15); // Dark purple
    
    // Create gradient with waves
    vec3 color = mix(
      color1,
      color2,
      wave1 * wave2 + mouseFactor
    );
    
    // Add subtle vignette
    float vignette = smoothstep(1.2, 0.5, length(uv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`

const createShader = (type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

const initGL = () => {
  gl = canvas.value.getContext('webgl')
  program = gl.createProgram()

  // Compile shaders
  const vs = createShader(gl.VERTEX_SHADER, vertexShader)
  const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader)

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)

  // Create vertices
  const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // Set attributes and uniforms
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
}

const resize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
  gl.viewport(0, 0, width, height)

  const uResolution = gl.getUniformLocation(program, 'uResolution')
  gl.uniform2f(uResolution, width, height)
}

const render = (time = 0) => {
  const uTime = gl.getUniformLocation(program, 'uTime')
  gl.uniform1f(uTime, time * 0.001)

  const uMouse = gl.getUniformLocation(program, 'uMouse')
  gl.uniform2f(uMouse, mouseX, mouseY)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
  animationFrame = requestAnimationFrame(render)
}

const handleMouseMove = (e) => {
  mouseX = e.clientX / window.innerWidth
  mouseY = 1 - e.clientY / window.innerHeight
}

onMounted(() => {
  initGL()
  resize()
  render()
  
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(animationFrame)
})
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

canvas {
  display: block;
  background: #07090f;
}
</style>