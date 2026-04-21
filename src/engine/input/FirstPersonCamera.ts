import * as THREE from 'three';
import { type AABB, type SolidSampler, sweepMove } from '@/physics/collision';

export interface FirstPersonCameraOptions {
  walkSpeed: number;
  flySpeed: number;
  sprintMultiplier: number;
  lookSensitivity: number;
  gravity: number;
  jumpVelocity: number;
  terminalVelocity: number;
  box: AABB;
  eyeHeight: number;
}

const DEFAULTS: FirstPersonCameraOptions = {
  walkSpeed: 4.3,
  flySpeed: 10,
  sprintMultiplier: 1.8,
  lookSensitivity: 0.0022,
  gravity: 32,
  jumpVelocity: 8.4,
  terminalVelocity: 78.4,
  box: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
  eyeHeight: 1.62,
};

const UP = new THREE.Vector3(0, 1, 0);
const PITCH_MAX = Math.PI / 2 - 0.0001;

export interface UpdateOptions {
  isSolid?: SolidSampler;
}

export class FirstPersonCamera {
  readonly camera: THREE.PerspectiveCamera;
  readonly position = new THREE.Vector3(8, 40, 8);
  readonly velocity = new THREE.Vector3();
  readonly input = {
    forward: 0,
    strafe: 0,
    vertical: 0,
    sprint: false,
    fly: true,
    jump: false,
  };
  yaw = 0;
  pitch = 0;
  onGround = false;

  private opts: FirstPersonCameraOptions;
  private canvas: HTMLCanvasElement | null = null;
  private locked = false;
  private readonly keyDown: (e: KeyboardEvent) => void;
  private readonly keyUp: (e: KeyboardEvent) => void;
  private readonly mouseMove: (e: MouseEvent) => void;
  private readonly lockChange: () => void;
  private readonly click: () => void;

  constructor(camera: THREE.PerspectiveCamera, opts: Partial<FirstPersonCameraOptions> = {}) {
    this.camera = camera;
    this.opts = { ...DEFAULTS, ...opts };

    this.keyDown = (e) => {
      this.handleKey(e.code, true);
    };
    this.keyUp = (e) => {
      this.handleKey(e.code, false);
    };
    this.mouseMove = (e) => {
      if (!this.locked) return;
      this.yaw -= e.movementX * this.opts.lookSensitivity;
      this.pitch -= e.movementY * this.opts.lookSensitivity;
      this.pitch = Math.max(-PITCH_MAX, Math.min(PITCH_MAX, this.pitch));
    };
    this.lockChange = () => {
      this.locked = document.pointerLockElement === this.canvas;
    };
    this.click = () => {
      if (!this.locked) void this.canvas?.requestPointerLock();
    };
  }

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('pointerlockchange', this.lockChange);
    canvas.addEventListener('click', this.click);
  }

  detach(): void {
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('pointerlockchange', this.lockChange);
    if (this.canvas) this.canvas.removeEventListener('click', this.click);
    this.canvas = null;
  }

  toggleFly(): void {
    this.input.fly = !this.input.fly;
    this.velocity.set(0, 0, 0);
  }

  private handleKey(code: string, down: boolean): void {
    const v = down ? 1 : 0;
    switch (code) {
      case 'KeyW':
        this.input.forward = down ? 1 : Math.max(this.input.forward - 1, 0);
        break;
      case 'KeyS':
        this.input.forward = down ? -1 : Math.min(this.input.forward + 1, 0);
        break;
      case 'KeyA':
        this.input.strafe = down ? -1 : Math.min(this.input.strafe + 1, 0);
        break;
      case 'KeyD':
        this.input.strafe = down ? 1 : Math.max(this.input.strafe - 1, 0);
        break;
      case 'Space':
        this.input.vertical = down ? 1 : Math.max(this.input.vertical - 1, 0);
        this.input.jump = down;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        if (this.input.fly) {
          this.input.vertical = down ? -1 : Math.min(this.input.vertical + 1, 0);
        } else {
          this.input.sprint = down;
        }
        break;
      case 'KeyR':
        if (down) this.toggleFly();
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.input.sprint = down;
        break;
      default:
        void v;
        break;
    }
  }

  lookVector(out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    const cp = Math.cos(this.pitch);
    out.set(Math.sin(this.yaw) * cp * -1, Math.sin(this.pitch), Math.cos(this.yaw) * cp * -1);
    return out;
  }

  update(dtSec: number, opts: UpdateOptions = {}): void {
    const fly = this.input.fly;
    const baseSpeed = fly ? this.opts.flySpeed : this.opts.walkSpeed;
    const speed = baseSpeed * (this.input.sprint ? this.opts.sprintMultiplier : 1);

    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const fwdX = -sinY;
    const fwdZ = -cosY;
    const rightX = cosY;
    const rightZ = -sinY;

    const mx = fwdX * this.input.forward + rightX * this.input.strafe;
    const mz = fwdZ * this.input.forward + rightZ * this.input.strafe;
    const len = Math.hypot(mx, mz);
    const hx = len > 0 ? (mx / len) * speed : 0;
    const hz = len > 0 ? (mz / len) * speed : 0;

    if (fly || !opts.isSolid) {
      this.position.x += hx * dtSec;
      this.position.z += hz * dtSec;
      this.position.y += this.input.vertical * speed * dtSec;
      this.velocity.set(0, 0, 0);
      this.onGround = false;
    } else {
      this.velocity.x = hx;
      this.velocity.z = hz;
      if (this.input.jump && this.onGround) {
        this.velocity.y = this.opts.jumpVelocity;
        this.onGround = false;
      }
      this.velocity.y = Math.max(
        this.velocity.y - this.opts.gravity * dtSec,
        -this.opts.terminalVelocity,
      );
      const dv = {
        x: this.velocity.x * dtSec,
        y: this.velocity.y * dtSec,
        z: this.velocity.z * dtSec,
      };
      const result = sweepMove(this.position, this.opts.box, dv, opts.isSolid);
      if (result.hitX) this.velocity.x = 0;
      if (result.hitY) this.velocity.y = 0;
      if (result.hitZ) this.velocity.z = 0;
      this.onGround = result.onGround || (this.onGround && !result.hitY && this.velocity.y <= 0);
    }

    this.camera.position.set(
      this.position.x,
      this.position.y + this.opts.eyeHeight - this.opts.box.halfY,
      this.position.z,
    );
    const look = this.lookVector();
    this.camera.lookAt(
      this.camera.position.x + look.x,
      this.camera.position.y + look.y,
      this.camera.position.z + look.z,
    );
    this.camera.up.copy(UP);
  }
}
