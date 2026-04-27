import * as THREE from 'three';

export class Stars {
  readonly points: THREE.Points;
  private readonly material: THREE.PointsMaterial;
  // Stars opacity is clamped to 0 during full daylight and 1 during
  // deep night — long stretches of identical writes. Diff-cache to
  // skip the material setter (which flags the material dirty).
  private lastOpacity = -1;
  // Position diff-cache. Vector3.copy fires onChange (matrixWorld
  // flag); when player is stationary we'd write the same camPos every
  // frame for nothing.
  private lastPosX = NaN;
  private lastPosY = NaN;
  private lastPosZ = NaN;

  constructor(count = 320, radius = 400) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random() * 0.8 + 0.15;
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.92 + Math.random() * 0.06);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.6 + radius * 0.18;
      const z = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.PointsMaterial({
      color: 0xeef3ff,
      size: 1.2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      fog: false,
    });
    this.points = new THREE.Points(geom, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = -3;
  }

  update(camPos: THREE.Vector3, sunDirY: number): void {
    // Skip per-frame writes when stars are hidden (low-tier preset
    // toggles points.visible off). Saves position.copy + setter
    // hits on already-strained hardware.
    if (!this.points.visible) return;
    // Diff-cache the camPos copy — was firing onChange every frame
    // even when the player was stationary (the dominant case for the
    // duration of dawn/dusk transitions).
    if (camPos.x !== this.lastPosX || camPos.y !== this.lastPosY || camPos.z !== this.lastPosZ) {
      this.points.position.copy(camPos);
      this.lastPosX = camPos.x;
      this.lastPosY = camPos.y;
      this.lastPosZ = camPos.z;
    }
    const op = Math.max(0, Math.min(1, (-sunDirY - 0.05) * 1.5));
    if (op !== this.lastOpacity) {
      this.material.opacity = op;
      this.lastOpacity = op;
    }
    // (was: `this.material.needsUpdate = false` — three.js's Material
    // needsUpdate setter is no-op for false; removing the per-frame
    // setter call. needsUpdate=true would re-version+recompile the
    // shader; we never need that here so just don't touch it.)
  }
}
