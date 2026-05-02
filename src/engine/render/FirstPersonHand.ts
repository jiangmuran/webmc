import * as THREE from 'three';
import { onMouseDelta, reset, settle, type SwayState } from '../held_item_sway';

export class FirstPersonHand {
  readonly group: THREE.Group;
  private mesh: THREE.Mesh | null = null;
  private readonly geom: THREE.BoxGeometry;
  private readonly color = new THREE.Color(0xffffff);
  // Diff-cache for the per-frame setHeldBlockColor write — held color
  // only changes when the player swaps hotbar slots or picks up a new
  // placeable. Was doing 3 divides + 3 setRGB writes + a Color.copy
  // every frame for the same value.
  private lastColorR = -1;
  private lastColorG = -1;
  private lastColorB = -1;
  // Diff cache for the group's rotation.z. Idle (swingSec <= 0) writes
  // 0.2 every frame, firing Euler._onChangeCallback for nothing. NaN
  // sentinel guarantees a write on the first call.
  private lastRotZ = NaN;
  // Diff caches for position.x/y. Sway settles to 0 → position values
  // become constants every frame; the per-axis assignment still fires
  // Vector3.onChange (matrixWorldNeedsUpdate flag) for each set.
  private lastPosX = NaN;
  private lastPosY = NaN;
  private swingSec = 0;
  private sway: SwayState = reset();

  constructor() {
    this.group = new THREE.Group();
    this.geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.group.position.set(0.45, -0.45, -0.75);
    this.group.rotation.set(-0.15, 0.45, 0.2);
    this.group.renderOrder = 50;
  }

  setHeldBlockColor(rgb: readonly [number, number, number]): void {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    if (r === this.lastColorR && g === this.lastColorG && b === this.lastColorB && this.mesh) {
      return;
    }
    this.lastColorR = r;
    this.lastColorG = g;
    this.lastColorB = b;
    this.color.setRGB(r / 255, g / 255, b / 255);
    if (this.mesh) {
      (this.mesh.material as THREE.MeshBasicMaterial).color.copy(this.color);
      return;
    }
    const mat = new THREE.MeshBasicMaterial({
      color: this.color,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geom, mat);
    this.mesh.renderOrder = 50;
    this.group.add(this.mesh);
  }

  swing(): void {
    this.swingSec = 0.25;
  }

  get isSwinging(): boolean {
    return this.swingSec > 0;
  }

  applyMouseDelta(dx: number, dy: number): void {
    this.sway = onMouseDelta(this.sway, dx, dy);
  }

  update(dtSec: number): void {
    // Skip per-frame transform writes when the hand isn't rendered
    // (third-person camera, spectator). The sway settles here too,
    // but a frame of stale sway when switching back to first-person
    // is unnoticeable.
    if (!this.group.visible) return;
    this.sway = settle(this.sway);
    const swayOffsetX = this.sway.x * 0.15;
    const swayOffsetY = this.sway.y * 0.1;
    const targetPosX = 0.45 + swayOffsetX;
    if (targetPosX !== this.lastPosX) {
      this.group.position.x = targetPosX;
      this.lastPosX = targetPosX;
    }
    let targetPosY: number;
    if (this.swingSec > 0) {
      this.swingSec = Math.max(0, this.swingSec - dtSec);
      const phase = 1 - this.swingSec / 0.25;
      // sin(phase * PI) was being computed twice per swinging frame
      // (once for rotZ angle, once for posY drop). Cache once.
      const sinPhasePi = Math.sin(phase * Math.PI);
      const angle = sinPhasePi * 0.6;
      const targetRotZ = 0.2 - angle * 0.8;
      if (targetRotZ !== this.lastRotZ) {
        this.group.rotation.z = targetRotZ;
        this.lastRotZ = targetRotZ;
      }
      targetPosY = -0.45 - sinPhasePi * 0.12 + swayOffsetY;
    } else {
      if (this.lastRotZ !== 0.2) {
        this.group.rotation.z = 0.2;
        this.lastRotZ = 0.2;
      }
      targetPosY = -0.45 + swayOffsetY;
    }
    if (targetPosY !== this.lastPosY) {
      this.group.position.y = targetPosY;
      this.lastPosY = targetPosY;
    }
  }
}
