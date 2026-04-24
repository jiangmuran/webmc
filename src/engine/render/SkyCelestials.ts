import * as THREE from 'three';

function makeSunTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,240,190,1)');
  grad.addColorStop(0.55, 'rgba(255,220,120,0.85)');
  grad.addColorStop(1, 'rgba(255,180,60,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.LinearFilter;
  return t;
}

function makeMoonTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(250,250,255,1)');
  grad.addColorStop(0.6, 'rgba(220,226,255,0.9)');
  grad.addColorStop(1, 'rgba(180,190,230,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(180,190,230,0.35)';
  for (const [cx, cy, r] of [
    [24, 22, 3],
    [42, 38, 2],
    [34, 48, 2],
    [46, 20, 2],
    [20, 38, 2],
  ] as const) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.LinearFilter;
  return t;
}

export class SkyCelestials {
  readonly sun: THREE.Sprite;
  readonly moon: THREE.Sprite;
  private readonly radius: number;

  constructor(radius = 300) {
    this.radius = radius;
    this.sun = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeSunTexture(),
        transparent: true,
        depthWrite: false,
        depthTest: true,
        fog: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.sun.scale.set(60, 60, 60);
    this.sun.renderOrder = -2;

    this.moon = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeMoonTexture(),
        transparent: true,
        depthWrite: false,
        depthTest: true,
        fog: false,
      }),
    );
    this.moon.scale.set(45, 45, 45);
    this.moon.renderOrder = -2;
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.sun);
    scene.add(this.moon);
  }

  update(camPos: THREE.Vector3, sunDir: THREE.Vector3): void {
    this.sun.position.set(
      camPos.x + sunDir.x * this.radius,
      camPos.y + sunDir.y * this.radius,
      camPos.z + sunDir.z * this.radius,
    );
    this.moon.position.set(
      camPos.x - sunDir.x * this.radius,
      camPos.y - sunDir.y * this.radius,
      camPos.z - sunDir.z * this.radius,
    );
    this.sun.visible = sunDir.y > -0.05;
    this.moon.visible = sunDir.y < 0.05;
  }
}
