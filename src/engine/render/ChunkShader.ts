import * as THREE from 'three';

const vertexShader = `
precision highp float;
attribute vec4 color;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vWorldPos;
void main() {
  vNormal = normal;
  vColor = color;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = `
precision highp float;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vWorldPos;
uniform vec3 uSunDir;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform float uAmbient;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFogColor;
uniform vec3 uCameraPosW;
uniform float uGrainStrength;
uniform float uPixelSnap;

// Hash a 3D floored position to pseudo-random in 0..1
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

// "Grain" texture: each block gets a faint speckle pattern derived from its world position
float voxelGrain(vec3 worldPos, vec3 n) {
  vec3 blockCoord = floor(worldPos + n * 0.001);
  // Sub-pixel variation across face, driven by in-face coords
  vec3 faceAbs = abs(n);
  vec2 uv;
  if (faceAbs.y > 0.5) uv = worldPos.xz;
  else if (faceAbs.x > 0.5) uv = worldPos.yz;
  else uv = worldPos.xy;
  // Snap to pixel grid — mimics 16x16 tile
  float snap = uPixelSnap;
  vec2 snapped = floor(uv * snap) / snap;
  float inner = hash3(vec3(snapped * 13.3, blockCoord.y));
  float outer = hash3(blockCoord);
  return mix(1.0 - uGrainStrength, 1.0 + uGrainStrength, 0.6 * inner + 0.4 * outer);
}

void main() {
  vec3 n = normalize(vNormal);
  float nDotSun = clamp(dot(n, uSunDir), 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, clamp(n.y * 0.5 + 0.5, 0.0, 1.0));
  float faceShade = 0.42 + 0.58 * nDotSun;
  float voxelLight = vColor.a;
  float lighting = max(voxelLight * faceShade, uAmbient);
  vec3 baseRgb = vColor.rgb;
  float g = voxelGrain(vWorldPos, n);
  vec3 lit = baseRgb * lighting * g + hemi * 0.04;
  float dist = length(vWorldPos - uCameraPosW);
  float fogT = clamp((dist - uFogNear) / max(uFogFar - uFogNear, 0.001), 0.0, 1.0);
  vec3 withFog = mix(lit, uFogColor, fogT);
  gl_FragColor = vec4(withFog, 1.0);
}
`;

export function createChunkMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uSunDir: { value: new THREE.Vector3(0.5, 0.9, 0.3).normalize() },
      uSkyColor: { value: new THREE.Color(0.55, 0.72, 0.95) },
      uGroundColor: { value: new THREE.Color(0.25, 0.22, 0.2) },
      uAmbient: { value: 0.08 },
      uFogNear: { value: 80 },
      uFogFar: { value: 260 },
      uFogColor: { value: new THREE.Color(0.55, 0.72, 0.95) },
      uCameraPosW: { value: new THREE.Vector3() },
      uGrainStrength: { value: 0.08 },
      uPixelSnap: { value: 16 },
    },
  });
}
