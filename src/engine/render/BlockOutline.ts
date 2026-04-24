import * as THREE from 'three';

export class BlockOutline {
  readonly group: THREE.Group;
  private readonly lines: THREE.LineSegments;
  private readonly crack: THREE.Mesh;
  private readonly crackMat: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    const geom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.001, 1.001, 1.001));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });
    this.lines = new THREE.LineSegments(geom, lineMat);
    this.group.add(this.lines);

    this.crackMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
    });
    this.crack = new THREE.Mesh(new THREE.BoxGeometry(1.012, 1.012, 1.012), this.crackMat);
    this.group.add(this.crack);
    this.group.renderOrder = 1;
  }

  setHit(bx: number, by: number, bz: number, breakProgress01 = 0): void {
    this.group.position.set(bx + 0.5, by + 0.5, bz + 0.5);
    this.group.visible = true;
    this.crackMat.opacity = breakProgress01 > 0 ? Math.min(0.65, breakProgress01 * 0.75) : 0;
    // Subtle breathing scale so the outline feels alive.
    const s = 1 + Math.sin(performance.now() * 0.005) * 0.003;
    this.group.scale.setScalar(s);
  }

  hide(): void {
    this.group.visible = false;
  }
}
