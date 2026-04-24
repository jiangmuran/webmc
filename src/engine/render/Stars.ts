import * as THREE from 'three';

export class Stars {
  readonly points: THREE.Points;
  private readonly material: THREE.PointsMaterial;

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
    this.points.position.copy(camPos);
    this.material.opacity = Math.max(0, Math.min(1, (-sunDirY - 0.05) * 1.5));
    this.material.needsUpdate = false;
  }
}
