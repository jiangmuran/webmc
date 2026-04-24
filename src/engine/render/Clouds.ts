import * as THREE from 'three';
import { DEFAULT_CLOUD_HEIGHT, cloudScrollSpeed, cloudColor } from './cloud_layer_height';

export interface CloudOptions {
  height: number;
  size: number;
  tileScale: number;
}

const DEFAULTS: CloudOptions = {
  height: DEFAULT_CLOUD_HEIGHT,
  size: 1024,
  tileScale: 14,
};

function hash2(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 13.37) * 43758.5453;
  return s - Math.floor(s);
}

function smoothNoise(nx: number, ny: number, seed: number): number {
  const x0 = Math.floor(nx);
  const y0 = Math.floor(ny);
  const fx = nx - x0;
  const fy = ny - y0;
  const a = hash2(x0, y0, seed);
  const b = hash2(x0 + 1, y0, seed);
  const c = hash2(x0, y0 + 1, seed);
  const d = hash2(x0 + 1, y0 + 1, seed);
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

function fbm(nx: number, ny: number): number {
  let amp = 0.5;
  let f = 1;
  let sum = 0;
  for (let i = 0; i < 4; i++) {
    sum += smoothNoise(nx * f, ny * f, i + 1) * amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum;
}

function makeCloudTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      const n = fbm(nx * 5, ny * 5);
      const mask = n > 0.52 ? Math.min(1, (n - 0.52) * 2.5) : 0;
      const alpha = Math.floor(mask * 220);
      const idx = (y * size + x) * 4;
      img.data[idx] = 255;
      img.data[idx + 1] = 255;
      img.data[idx + 2] = 255;
      img.data[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export class Clouds {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.MeshBasicMaterial;
  private readonly texture: THREE.CanvasTexture;
  private readonly opts: CloudOptions;
  private scrollX = 0;
  private scrollZ = 0;

  constructor(opts: Partial<CloudOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.texture = makeCloudTexture();
    this.texture.repeat.set(this.opts.tileScale, this.opts.tileScale);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    });
    const geom = new THREE.PlaneGeometry(this.opts.size, this.opts.size);
    geom.rotateX(-Math.PI / 2);
    this.mesh = new THREE.Mesh(geom, this.material);
    this.mesh.position.y = this.opts.height;
    this.mesh.renderOrder = -1;
  }

  update(dtSec: number, camX: number, camZ: number, weather: 'clear' | 'rain' | 'thunder'): void {
    const speed = cloudScrollSpeed() * 50;
    this.scrollX += dtSec * speed * 0.1;
    this.scrollZ += dtSec * speed * 0.035;
    this.texture.offset.set(this.scrollX * 0.01, this.scrollZ * 0.01);
    this.mesh.position.x = Math.floor(camX / 16) * 16;
    this.mesh.position.z = Math.floor(camZ / 16) * 16;
    const c = cloudColor(weather);
    this.material.color.setRGB(c[0], c[1], c[2]);
    this.material.opacity = weather === 'clear' ? 0.82 : weather === 'rain' ? 0.93 : 0.98;
  }
}
