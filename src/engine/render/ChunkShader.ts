import * as THREE from 'three';

const vertexShader = `
precision highp float;
attribute vec4 color;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
  vNormal = normal;
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec3 vNormal;
varying vec4 vColor;
uniform vec3 uSunDir;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform float uAmbient;
void main() {
  vec3 n = normalize(vNormal);
  float nDotSun = clamp(dot(n, uSunDir), 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, clamp(n.y * 0.5 + 0.5, 0.0, 1.0));
  float faceShade = 0.45 + 0.55 * nDotSun;
  float voxelLight = vColor.a;
  float lighting = max(voxelLight * faceShade, uAmbient);
  vec3 baseRgb = vColor.rgb;
  vec3 lit = baseRgb * lighting + hemi * 0.04;
  gl_FragColor = vec4(lit, 1.0);
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
    },
  });
}
