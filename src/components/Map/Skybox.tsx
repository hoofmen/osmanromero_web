import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, BackSide } from 'three'

const vertexShader = `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i),               hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * noise(p * freq);
      amp  *= 0.5;
      freq *= 2.0;
    }
    return val;
  }

  void main() {
    vec3 dir = normalize(vDir);

    // --- Stars ---
    float s = hash(floor(dir * 250.0));
    float stars       = step(0.997,  s) * smoothstep(0.997, 1.0,  s);
    float brightStars = step(0.9996, s);

    // --- Nebula layers ---
    float n1 = fbm(dir * 3.0 + vec3(1.7,  9.2, 0.3));
    float n2 = fbm(dir * 4.0 + vec3(5.1,  3.4, 8.2));
    float n3 = fbm(dir * 2.5 + vec3(2.3,  7.1, 4.8));
    float n4 = fbm(dir * 5.0 + vec3(8.4,  1.2, 6.7));

    vec3 base    = vec3(0.04, 0.01, 0.01);          // near-black deep crimson
    vec3 crimson = vec3(0.60, 0.02, 0.02) * pow(n1, 2.5);  // blood red
    vec3 orange  = vec3(0.55, 0.18, 0.00) * pow(n2, 3.0);  // burnt orange
    vec3 ember   = vec3(0.65, 0.28, 0.00) * pow(n3, 3.5);  // ember/amber
    vec3 magenta = vec3(0.45, 0.00, 0.15) * pow(n4, 4.0);  // dark magenta

    vec3 col = base
             + crimson * 0.45
             + orange  * 0.35
             + ember   * 0.25
             + magenta * 0.30;

    // --- Add stars (warm tinted) ---
    col += vec3(1.00, 0.92, 0.80) * stars       * 0.9;
    col += vec3(1.00, 0.85, 0.60) * brightStars * 1.8;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Skybox() {
  const ref = useRef<Mesh>(null)
  const { camera } = useThree()

  // Keep the sphere centered on the camera so it never gets depth-clipped
  useFrame(() => {
    if (ref.current) ref.current.position.copy(camera.position)
  })

  return (
    <mesh ref={ref} renderOrder={-1}>
      <sphereGeometry args={[480, 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
