import * as THREE from 'three';

export class PlayerAvatar {
  readonly group: THREE.Group;

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

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.72, 0.3), shirtMat);
    leftArm.position.set(-0.44, -0.04, 0);
    this.group.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.72, 0.3), shirtMat);
    rightArm.position.set(0.44, -0.04, 0);
    this.group.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.72, 0.3), legsMat);
    leftLeg.position.set(-0.16, -0.72, 0);
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.72, 0.3), legsMat);
    rightLeg.position.set(0.16, -0.72, 0);
    this.group.add(rightLeg);

    this.group.visible = false;
  }

  setVisible(v: boolean): void {
    this.group.visible = v;
  }

  setPose(x: number, y: number, z: number, yaw: number): void {
    this.group.position.set(x, y, z);
    this.group.rotation.y = yaw;
  }
}
