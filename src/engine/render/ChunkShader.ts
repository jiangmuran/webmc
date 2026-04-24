import * as THREE from 'three';

const vertexShader = `
precision highp float;
attribute vec4 color;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vWorldPos;
varying vec3 vLocal;
void main() {
  vNormal = normal;
  vColor = color;
  vLocal = position;
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
varying vec3 vLocal;
uniform vec3 uSunDir;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform float uAmbient;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFogColor;
uniform vec3 uCameraPosW;
uniform float uPatternStrength;
uniform sampler2D uPattern;

vec2 faceUV(vec3 worldPos, vec3 n) {
  vec3 faceAbs = abs(n);
  if (faceAbs.y > 0.5) return worldPos.xz;
  if (faceAbs.x > 0.5) return worldPos.zy;
  return worldPos.xy;
}

void main() {
  vec3 n = normalize(vNormal);
  float nDotSun = clamp(dot(n, uSunDir), 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, clamp(n.y * 0.5 + 0.5, 0.0, 1.0));
  float faceShade = 0.42 + 0.58 * nDotSun;
  float voxelLight = vColor.a;
  float lighting = max(voxelLight * faceShade, uAmbient);
  vec3 baseRgb = vColor.rgb;
  vec2 uv = fract(faceUV(vWorldPos, n));
  vec4 patternSample = texture2D(uPattern, uv);
  float pattern = mix(1.0, patternSample.r, clamp(uPatternStrength, 0.0, 1.0));
  vec3 lit = baseRgb * lighting * pattern + hemi * 0.04;
  float dist = length(vWorldPos - uCameraPosW);
  float fogT = clamp((dist - uFogNear) / max(uFogFar - uFogNear, 0.001), 0.0, 1.0);
  vec3 withFog = mix(lit, uFogColor, fogT);
  gl_FragColor = vec4(withFog, 1.0);
}
`;

export function buildDefaultPatternTexture(): THREE.Texture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('pattern: 2d context unavailable');
  const img = ctx.createImageData(size, size);
  // Deterministic "pebble" value pattern — stone-ish speckle
  let seed = 0x1a2b3c;
  const rand = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5) / size;
      const dy = (y + 0.5) / size;
      const n = 0.85 + 0.3 * rand();
      const blockEdge = Math.min(dx, dy, 1 - dx, 1 - dy) < 0.03 ? 0.72 : 1;
      const v = Math.max(0, Math.min(255, Math.floor(n * blockEdge * 255)));
      const i = (y * size + x) * 4;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapNearestFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function createChunkMaterial(): THREE.ShaderMaterial {
  const pattern = buildDefaultPatternTexture();
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
      uPatternStrength: { value: 0.5 },
      uPattern: { value: pattern },
    },
  });
}
