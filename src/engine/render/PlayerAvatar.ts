import * as THREE from 'three';

export class PlayerAvatar {
  readonly group: THREE.Group;
  private readonly leftArm: THREE.Group;
  private readonly rightArm: THREE.Group;
  private readonly leftLeg: THREE.Group;
  private readonly rightLeg: THREE.Group;
  private walkPhase = 0;

  constructor() {
    this.group = new THREE.Group();
    const skinMat = new THREE.MeshBasicMaterial({ color: 0xf2c8a0 });
    const shirtMat = new THREE.MeshBasicMaterial({ color: 0x4d78c2 });
    const legsMat = new THREE.MeshBasicMaterial({ color: 0x2a3e6b });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.72, 0.32), shirtMat);
    body.position.y = 0;
    this.group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), skinMat);
    head.position.y = 0.6;
    this.group.add(head);

    this.leftArm = this.makeLimb(new THREE.BoxGeometry(0.28, 0.72, 0.3), shirtMat, -0.44, 0.24, 0);
    this.rightArm = this.makeLimb(new THREE.BoxGeometry(0.28, 0.72, 0.3), shirtMat, 0.44, 0.24, 0);
    this.leftLeg = this.makeLimb(new THREE.BoxGeometry(0.3, 0.72, 0.3), legsMat, -0.16, -0.44, 0);
    this.rightLeg = this.makeLimb(new THREE.BoxGeometry(0.3, 0.72, 0.3), legsMat, 0.16, -0.44, 0);

    this.group.visible = false;
  }

  private makeLimb(geom: THREE.BoxGeometry, mat: THREE.Material, px: number, py: number, pz: number): THREE.Group {
    const pivot = new THREE.Group();
    pivot.position.set(px, py, pz);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = -0.36;
    pivot.add(mesh);
    this.group.add(pivot);
    return pivot;
  }

  setVisible(v: boolean): void {
    this.group.visible = v;
  }

  setPose(x: number, y: number, z: number, yaw: number): void {
    this.group.position.set(x, y, z);
    this.group.rotation.y = yaw;
  }

  animate(dtSec: number, walkSpeed: number): void {
    if (walkSpeed > 0.4) {
      this.walkPhase += dtSec * (6 + walkSpeed * 0.5);
      const swing = Math.sin(this.walkPhase) * Math.min(1, walkSpeed / 5);
      this.leftArm.rotation.x = swing * 0.8;
      this.rightArm.rotation.x = -swing * 0.8;
      this.leftLeg.rotation.x = -swing * 0.9;
      this.rightLeg.rotation.x = swing * 0.9;
    } else {
      this.walkPhase = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
    }
  }
}
