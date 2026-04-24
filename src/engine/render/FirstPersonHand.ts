import * as THREE from 'three';

export class FirstPersonHand {
  readonly group: THREE.Group;
  private mesh: THREE.Mesh | null = null;
  private readonly geom: THREE.BoxGeometry;
  private readonly color = new THREE.Color(0xffffff);
  private swingSec = 0;

  constructor() {
    this.group = new THREE.Group();
    this.geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.group.position.set(0.45, -0.45, -0.75);
    this.group.rotation.set(-0.15, 0.45, 0.2);
    this.group.renderOrder = 50;
  }

  setHeldBlockColor(rgb: readonly [number, number, number]): void {
    this.color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
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

  update(dtSec: number): void {
    if (this.swingSec > 0) {
      this.swingSec = Math.max(0, this.swingSec - dtSec);
      const phase = 1 - this.swingSec / 0.25;
      const angle = Math.sin(phase * Math.PI) * 0.6;
      this.group.rotation.z = 0.2 - angle * 0.8;
      this.group.position.y = -0.45 - Math.sin(phase * Math.PI) * 0.12;
    } else {
      this.group.rotation.z = 0.2;
      this.group.position.y = -0.45;
    }
  }
}
