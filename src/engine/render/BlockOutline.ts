import * as THREE from 'three';

export class BlockOutline {
  readonly group: THREE.LineSegments;

  constructor() {
    const geom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.001, 1.001, 1.001));
    const mat = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });
    this.group = new THREE.LineSegments(geom, mat);
    this.group.visible = false;
    this.group.renderOrder = 1;
  }

  setHit(bx: number, by: number, bz: number): void {
    this.group.position.set(bx + 0.5, by + 0.5, bz + 0.5);
    this.group.visible = true;
  }

  hide(): void {
    this.group.visible = false;
  }
}
