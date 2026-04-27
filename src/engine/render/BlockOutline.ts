import * as THREE from 'three';
import { crackStage } from '../../game/block_break_progress';

export class BlockOutline {
  readonly group: THREE.Group;
  private readonly lines: THREE.LineSegments;
  private readonly crack: THREE.Mesh;
  private readonly crackMat: THREE.MeshBasicMaterial;
  // Diff-caches. setHit/hide fire every frame; group.visible and
  // crackMat.opacity often hold the same value across frames. Skipping
  // the writes avoids three.js Object3D + Material setter overhead.
  private lastVisible = false;
  private lastCrackOpacity = -1;
  // Position diff-cache. Aiming at the same block while mining writes
  // the same x/y/z every frame, firing matrixWorldNeedsUpdate for
  // nothing.
  private lastBx = NaN;
  private lastBy = NaN;
  private lastBz = NaN;

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
    if (bx !== this.lastBx || by !== this.lastBy || bz !== this.lastBz) {
      this.group.position.set(bx + 0.5, by + 0.5, bz + 0.5);
      this.lastBx = bx;
      this.lastBy = by;
      this.lastBz = bz;
    }
    if (!this.lastVisible) {
      this.group.visible = true;
      this.lastVisible = true;
    }
    // Snap to 10 MC-style crack stages so the visual ticks visibly forward.
    const stage = crackStage(breakProgress01);
    const targetOpacity = stage > 0 ? Math.min(0.65, (stage / 9) * 0.7) : 0;
    if (targetOpacity !== this.lastCrackOpacity) {
      this.crackMat.opacity = targetOpacity;
      this.lastCrackOpacity = targetOpacity;
    }
    // Subtle breathing scale so the outline feels alive.
    const s = 1 + Math.sin(performance.now() * 0.005) * 0.003;
    this.group.scale.setScalar(s);
  }

  hide(): void {
    if (this.lastVisible) {
      this.group.visible = false;
      this.lastVisible = false;
    }
  }
}
