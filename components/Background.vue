<template>
  <ClientOnly>
    <TresCanvas window-size>
      <TresPerspectiveCamera :position="[0, 0, 5]" />
      <TresScene>
        <TresMesh>
          <TresPlaneGeometry :args="[10, 10, 32, 32]" />
          <TresShaderMaterial 
            :uniforms="uniforms" 
            :fragment-shader="fragmentShader" 
            :vertex-shader="vertexShader" 
            transparent
          />
        </TresMesh>
      </TresScene>
    </TresCanvas>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useColorStore } from '~/stores/color'

const colorStore = useColorStore()

const uniforms = ref({
  u_time: { value: 0 },
  u_resolution: { value: [1, 1] },
  u_mouse: { value: [0, 0] },
  u_point: { value: [0.5, 0.5] },
  u_ratio: { value: 1 },
  u_mouseInteraction: { value: 1 },
  u_color1: { value: [colorStore.color1.r, colorStore.color1.g, colorStore.color1.b] },
  u_color2: { value: [colorStore.color2.r, colorStore.color2.g, colorStore.color2.b] }
})

// Watch for color changes
watch(() => colorStore.color1, (newColor) => {
  uniforms.value.u_color1.value = [newColor.r, newColor.g, newColor.b]
}, { deep: true })

watch(() => colorStore.color2, (newColor) => {
  uniforms.value.u_color2.value = [newColor.r, newColor.g, newColor.b]
}, { deep: true })

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_point;
  uniform float u_ratio;
  uniform float u_mouseInteraction;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  varying vec2 vUv;

  float circle_s(vec2 dist, float radius) {
    return smoothstep(0., radius, pow(dot(dist,dist), .6) * .1);
  }

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                       0.366025403784439,
                      -0.577350269189626,
                       0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.);
    vec2 uv = vUv * aspect;
    vec2 mouse = vUv - u_point;

    mouse.y /= u_ratio;
    
    float noise = snoise(vec2(uv.x * 3.0 + u_time * 0.2, uv.y * 3.0));
    float noise1 = snoise(vec2(uv.x * 3.0 + 0.1 + u_time * 0.2, uv.y * 3.0 + 0.1));
    float noise2 = snoise(vec2(uv.x * 3.0 - 0.1 + u_time * 0.2, uv.y * 3.0 - 0.1));
    
    float alpha = (noise + noise1 + noise2) / 3.0;
    alpha *= circle_s(mouse, .015 * u_mouseInteraction);
    float x = 1. - noise;
    
    vec3 color1 = vec3(u_color1.x/255., u_color1.y/255., u_color1.z/255.);
    vec3 color2 = vec3(u_color2.x/255., u_color2.y/255., u_color2.z/255.);
    
    float blendFactor = smoothstep(.1, 1., x * 1.);
    vec3 blendedColor = mix(color1, color2, blendFactor);

    gl_FragColor = vec4(blendedColor, alpha * 0.5);
  }
`

const mousePosition = ref({ x: 0, y: 0 })

onMounted(() => {
  if (typeof window === 'undefined') return

  const handleMouseMove = (e) => {
    mousePosition.value = {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight
    }
    uniforms.value.u_point.value = [mousePosition.value.x, mousePosition.value.y]
  }

  const updateResolution = () => {
    uniforms.value.u_resolution.value = [window.innerWidth, window.innerHeight]
    uniforms.value.u_ratio.value = window.innerWidth / window.innerHeight
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', updateResolution)
  updateResolution()

  const animate = () => {
    uniforms.value.u_time.value += 0.01
    requestAnimationFrame(animate)
  }
  animate()

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', updateResolution)
  })
})
</script>