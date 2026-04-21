import * as THREE from 'three';

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
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
void main() {
  vec3 n = normalize(vNormal);
  float nDotSun = clamp(dot(n, uSunDir), 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, clamp(n.y * 0.5 + 0.5, 0.0, 1.0));
  float shade = 0.35 + 0.65 * nDotSun;
  vec3 baseRgb = vColor.rgb;
  float aoShade = vColor.a;
  vec3 lit = baseRgb * (shade * aoShade) + hemi * 0.08;
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
    },
  });
}
