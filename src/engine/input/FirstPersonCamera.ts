import * as THREE from 'three';
import { type AABB, type SolidSampler, sweepMove } from '@/physics/collision';
import { bobY } from '@/engine/render/camera_bob_intensity';

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
  walkSpeed: 4.317,
  flySpeed: 10,
  sprintMultiplier: 1.3,
  lookSensitivity: 0.0022,
  gravity: 28,
  jumpVelocity: 8.4,
  terminalVelocity: 78.4,
  box: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
  eyeHeight: 1.62,
};

export const COYOTE_TIME_SEC = 0.1;
export const JUMP_BUFFER_SEC = 0.12;

const UP = new THREE.Vector3(0, 1, 0);
const PITCH_MAX = Math.PI / 2 - 0.0001;

export type FluidKind = 'water' | 'lava';
export type FluidSampler = (x: number, y: number, z: number) => FluidKind | null;

export interface UpdateOptions {
  isSolid?: SolidSampler;
  isFluid?: FluidSampler;
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
    sneak: false,
    fly: true,
    jump: false,
  };
  yaw = 0;
  pitch = 0;
  onGround = false;
  inFluid: FluidKind | null = null;
  inputBlocked = false;
  passThroughBlocks = false;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private wasJumpPressed = false;
  private sprintFovBoost = 0;
  private bobPhase = 0;
  bobEnabled = true;
  invertY = false;
  sprintToggle = false;
  private lastWKeyDown = 0;
  private airborneStartY: number | null = null;
  lastLandFallBlocks = 0;

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
      if (this.inputBlocked) return;
      this.handleKey(e.code, true);
    };
    this.keyUp = (e) => {
      this.handleKey(e.code, false);
    };
    this.mouseMove = (e) => {
      if (!this.locked || this.inputBlocked) return;
      this.yaw -= e.movementX * this.opts.lookSensitivity;
      const pitchDelta = e.movementY * this.opts.lookSensitivity;
      this.pitch -= this.invertY ? -pitchDelta : pitchDelta;
      this.pitch = Math.max(-PITCH_MAX, Math.min(PITCH_MAX, this.pitch));
    };
    this.lockChange = () => {
      this.locked = document.pointerLockElement === this.canvas;
    };
    this.click = () => {
      if (this.locked || !this.canvas) return;
      const res = this.canvas.requestPointerLock() as Promise<void> | undefined;
      if (res && typeof res.catch === 'function') {
        res.catch(() => {
          /* pointer lock can fail in headless/embedded contexts; non-fatal */
        });
      }
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
    switch (code) {
      case 'KeyW':
        if (down) {
          const now = performance.now();
          if (now - this.lastWKeyDown < 260) this.input.sprint = true;
          this.lastWKeyDown = now;
        } else {
          this.input.sprint = false;
        }
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
          this.input.sneak = down;
        }
        break;
      case 'KeyR':
        if (down) this.toggleFly();
        break;
      case 'ControlLeft':
      case 'ControlRight':
        if (this.sprintToggle) {
          if (down) this.input.sprint = !this.input.sprint;
        } else {
          this.input.sprint = down;
        }
        break;
      default:
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

    this.inFluid =
      opts.isFluid?.(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.position.z),
      ) ?? null;

    if (fly || !opts.isSolid) {
      this.position.x += hx * dtSec;
      this.position.z += hz * dtSec;
      this.position.y += this.input.vertical * speed * dtSec;
      this.velocity.set(0, 0, 0);
      this.onGround = false;
    } else {
      const submerged = this.inFluid !== null;
      const drag = submerged ? (this.inFluid === 'water' ? 0.8 : 0.5) : 1;
      const targetX = hx * (submerged ? 0.5 : 1);
      const targetZ = hz * (submerged ? 0.5 : 1);
      const ground = this.onGround && !submerged;
      const responseTime = ground ? 0.1 : submerged ? 0.25 : 0.5;
      const alpha = 1 - Math.exp(-dtSec / responseTime);
      this.velocity.x += (targetX - this.velocity.x) * alpha;
      this.velocity.z += (targetZ - this.velocity.z) * alpha;
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
      if (submerged) {
        if (this.input.jump) {
          this.velocity.y = this.inFluid === 'water' ? 4 : 2;
        } else {
          this.velocity.y = Math.max(
            this.velocity.y * drag - (this.inFluid === 'water' ? 4 : 8) * dtSec,
            -4,
          );
        }
      } else {
        const jumpPressedNow = this.input.jump && !this.wasJumpPressed;
        if (jumpPressedNow) this.jumpBufferTimer = JUMP_BUFFER_SEC;
        if (this.onGround) this.coyoteTimer = COYOTE_TIME_SEC;
        else this.coyoteTimer = Math.max(0, this.coyoteTimer - dtSec);
        this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dtSec);

        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
          this.velocity.y = this.opts.jumpVelocity;
          // Sprint-jump forward boost — small fwd kick in look direction
          if (this.input.sprint) {
            const sinY2 = Math.sin(this.yaw);
            const cosY2 = Math.cos(this.yaw);
            this.velocity.x += -sinY2 * 2.2;
            this.velocity.z += -cosY2 * 2.2;
          }
          this.onGround = false;
          this.coyoteTimer = 0;
          this.jumpBufferTimer = 0;
        }
        // Variable-height jump: releasing jump key while rising cuts upward velocity
        const jumpReleasedNow = this.wasJumpPressed && !this.input.jump;
        if (jumpReleasedNow && this.velocity.y > 0) {
          this.velocity.y *= 0.55;
        }
        this.velocity.y = Math.max(
          this.velocity.y - this.opts.gravity * dtSec,
          -this.opts.terminalVelocity,
        );
      }
      this.wasJumpPressed = this.input.jump;
      // Sneak slows horizontal motion and enables edge cling
      if (this.input.sneak && this.onGround) {
        this.velocity.x *= 0.3;
        this.velocity.z *= 0.3;
      }
      let dvx = this.velocity.x * dtSec;
      let dvy = this.velocity.y * dtSec;
      let dvz = this.velocity.z * dtSec;

      // Sneak edge cling: prevent walking off ledges per axis
      if (this.input.sneak && this.onGround) {
        const box = this.opts.box;
        const probeY = this.position.y - box.halfY - 0.05;
        const hasGroundAt = (cx: number, cz: number): boolean => {
          return (
            opts.isSolid!(Math.floor(cx - box.halfX + 0.01), Math.floor(probeY), Math.floor(cz - box.halfZ + 0.01)) ||
            opts.isSolid!(Math.floor(cx + box.halfX - 0.01), Math.floor(probeY), Math.floor(cz - box.halfZ + 0.01)) ||
            opts.isSolid!(Math.floor(cx - box.halfX + 0.01), Math.floor(probeY), Math.floor(cz + box.halfZ - 0.01)) ||
            opts.isSolid!(Math.floor(cx + box.halfX - 0.01), Math.floor(probeY), Math.floor(cz + box.halfZ - 0.01))
          );
        };
        if (dvx !== 0 && !hasGroundAt(this.position.x + dvx, this.position.z)) dvx = 0;
        if (dvz !== 0 && !hasGroundAt(this.position.x, this.position.z + dvz)) dvz = 0;
        this.velocity.x = dvx / Math.max(dtSec, 0.0001);
        this.velocity.z = dvz / Math.max(dtSec, 0.0001);
      }

      const wasOnGround = this.onGround;
      const result = sweepMove(this.position, this.opts.box, { x: dvx, y: dvy, z: dvz }, opts.isSolid, 0.6);
      if (result.hitX) this.velocity.x = 0;
      if (result.hitY) this.velocity.y = 0;
      if (result.hitZ) this.velocity.z = 0;
      this.onGround = result.onGround;
      if (!wasOnGround && this.onGround && this.airborneStartY !== null) {
        const fallDistance = this.airborneStartY - this.position.y;
        if (fallDistance > 0 && this.inFluid === null) {
          this.lastLandFallBlocks = fallDistance;
        }
        this.airborneStartY = null;
      } else if (!this.onGround) {
        if (this.airborneStartY === null || this.position.y > this.airborneStartY) {
          this.airborneStartY = this.position.y;
        }
      } else if (this.onGround) {
        this.airborneStartY = null;
      }
    }

    const sneakDrop = this.input.sneak && this.onGround ? 0.3 : 0;

    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const bobActive = this.bobEnabled && this.onGround && !this.input.fly && horizSpeed > 0.5;
    if (bobActive) {
      this.bobPhase += dtSec * (8 + horizSpeed * 0.8);
    } else {
      this.bobPhase = this.bobPhase * Math.exp(-dtSec / 0.2);
    }
    const normalizedSpeed = Math.min(1, horizSpeed / this.opts.walkSpeed);
    const bobOffset = bobActive ? bobY(this.bobPhase, normalizedSpeed, true) : 0;

    this.camera.position.set(
      this.position.x,
      this.position.y + this.opts.eyeHeight - this.opts.box.halfY - sneakDrop + bobOffset,
      this.position.z,
    );
    this.camera.up.copy(UP);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');

    // Sprint FOV kick — eased
    const actuallySprinting =
      this.input.sprint && (Math.abs(this.velocity.x) + Math.abs(this.velocity.z)) > 0.5;
    const targetBoost = actuallySprinting ? 10 : 0;
    const fovAlpha = 1 - Math.exp(-dtSec / 0.15);
    this.sprintFovBoost += (targetBoost - this.sprintFovBoost) * fovAlpha;
    const baseFov = this.camera.userData['baseFov'] as number | undefined;
    if (baseFov !== undefined) {
      this.camera.fov = baseFov + this.sprintFovBoost;
      this.camera.updateProjectionMatrix();
    }
  }

  setBaseFov(deg: number): void {
    this.camera.userData['baseFov'] = deg;
    this.camera.fov = deg + this.sprintFovBoost;
    this.camera.updateProjectionMatrix();
  }
}
