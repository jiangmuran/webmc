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

// Reused per-frame movement-delta scratch for sweepMove. sweepMove
// mutates dv.x/y/z to zero on hit, but the caller doesn't read those
// fields again — safe to share across the two sweepMove call sites
// (fly + walk are mutually exclusive per frame).
const MOVE_DV: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

export type FluidKind = 'water' | 'lava';
export type FluidSampler = (x: number, y: number, z: number) => FluidKind | null;

export interface UpdateOptions {
  isSolid?: SolidSampler;
  isFluid?: FluidSampler;
  isClimbable?: (x: number, y: number, z: number) => boolean;
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
  // Whichever fluid (if any) the player's body center is in. Used for
  // physics drag, swim mechanics, particles.
  inFluid: FluidKind | null = null;
  // Same but sampled at eye level — used for drowning, vision overlay.
  // A player walking through 1-deep water has feet in water but head in
  // air, and shouldn't drown.
  inFluidEyes: FluidKind | null = null;
  inputBlocked = false;
  passThroughBlocks = false;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private wasJumpPressed = false;
  private sprintFovBoost = 0;
  speedMultiplier = 1;
  jumpVelocityMultiplier = 1;
  groundResponseMultiplier = 1; // higher = slipperier (ice ≈ 5, honey ≈ 0.4)
  private bobPhase = 0;
  bobEnabled = true;
  invertY = false;
  sprintToggle = false;
  private lastWKeyDown = 0;
  private lastSpaceKeyDown = 0;
  canFly = true;
  private airborneStartY: number | null = null;
  lastLandFallBlocks = 0;

  private opts: FirstPersonCameraOptions;
  private canvas: HTMLCanvasElement | null = null;
  private locked = false;
  // Diff caches for the per-frame camera position + rotation writes.
  // Standing still wrote the same x/eyeY/z + pitch/yaw every frame,
  // firing Vector3 + Euler onChange callbacks for nothing.
  private lastCamPosX = NaN;
  private lastCamPosY = NaN;
  private lastCamPosZ = NaN;
  private lastCamRotX = NaN;
  private lastCamRotY = NaN;
  private lastCamRotZ = NaN;
  private readonly keyDown: (e: KeyboardEvent) => void;
  private readonly keyUp: (e: KeyboardEvent) => void;
  private readonly mouseMove: (e: MouseEvent) => void;
  private readonly lockChange: () => void;
  private readonly click: () => void;

  constructor(camera: THREE.PerspectiveCamera, opts: Partial<FirstPersonCameraOptions> = {}) {
    this.camera = camera;
    this.opts = { ...DEFAULTS, ...opts };
    // Initialize stable camera state once. update() was writing
    // camera.up.copy(UP) and camera.rotation.order='YXZ' every frame —
    // both are constant, but Vector3.copy fires _onChangeCallback
    // and Euler.order has its own setter that flags the quaternion.
    this.camera.up.copy(UP);
    this.camera.rotation.order = 'YXZ';

    this.keyDown = (e) => {
      if (this.inputBlocked) return;
      this.handleKey(e.code, true);
    };
    this.keyUp = (e) => {
      this.handleKey(e.code, false);
    };
    this.mouseMove = (e) => {
      if (!this.locked || this.inputBlocked) return;
      const sensScale = this.input.sneak ? 0.45 : 1;
      this.yaw -= e.movementX * this.opts.lookSensitivity * sensScale;
      const pitchDelta = e.movementY * this.opts.lookSensitivity * sensScale;
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
        if (down) {
          const now = performance.now();
          if (this.canFly && now - this.lastSpaceKeyDown < 260) this.toggleFly();
          this.lastSpaceKeyDown = now;
        }
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
        // Was an unconditional toggleFly() — let survival players turn on
        // creative-mode flight by tapping R. Gate on canFly to match the
        // double-tap-space path (and vanilla, which has no key for fly
        // toggle outside creative).
        if (down && this.canFly) this.toggleFly();
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
    const speed =
      baseSpeed * (this.input.sprint ? this.opts.sprintMultiplier : 1) * this.speedMultiplier;

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

    // Hoist Math.floor of position once — was being recomputed 8+ times
    // across inFluid + inFluidEyes + climbing(2) sampling. Each call to
    // a probe function passed three Math.floor() expressions, which the
    // JIT can't fold across function calls.
    const blockX = Math.floor(this.position.x);
    const blockY = Math.floor(this.position.y);
    const blockZ = Math.floor(this.position.z);
    const eyeBlockY = Math.floor(this.position.y + 0.72);
    const climbHeadBlockY = Math.floor(this.position.y + 0.5);
    this.inFluid = opts.isFluid?.(blockX, blockY, blockZ) ?? null;
    // Eye sampling: position.y is body center (halfY=0.9), eyes sit
    // ~0.72 above (eyeHeight 1.62 from feet, feet = position.y - 0.9).
    this.inFluidEyes = opts.isFluid?.(blockX, eyeBlockY, blockZ) ?? null;
    const climbing = opts.isClimbable
      ? opts.isClimbable(blockX, blockY, blockZ) ||
        opts.isClimbable(blockX, climbHeadBlockY, blockZ)
      : false;

    if (this.passThroughBlocks || !opts.isSolid) {
      // True noclip — only spectator (passThroughBlocks=true). Creative
      // flyers in vanilla still collide with blocks; the previous
      // implementation noclipped on `fly || !isSolid`, letting creative
      // mode phase straight through walls.
      this.position.x += hx * dtSec;
      this.position.z += hz * dtSec;
      this.position.y += this.input.vertical * speed * dtSec;
      this.velocity.set(0, 0, 0);
      this.onGround = false;
    } else if (fly) {
      // Creative-mode fly: no gravity, vertical input drives Y, but
      // collision still applies — sweepMove blocks against walls.
      MOVE_DV.x = hx * dtSec;
      MOVE_DV.y = this.input.vertical * speed * dtSec;
      MOVE_DV.z = hz * dtSec;
      const result = sweepMove(this.position, this.opts.box, MOVE_DV, opts.isSolid, 0);
      if (result.hitX) this.velocity.x = 0;
      if (result.hitY) this.velocity.y = 0;
      if (result.hitZ) this.velocity.z = 0;
      this.onGround = false;
    } else {
      const submerged = this.inFluid !== null;
      const drag = submerged ? (this.inFluid === 'water' ? 0.8 : 0.5) : 1;
      const targetX = hx * (submerged ? 0.5 : 1);
      const targetZ = hz * (submerged ? 0.5 : 1);
      const ground = this.onGround && !submerged;
      const baseResponseTime = ground ? 0.1 : submerged ? 0.25 : 0.5;
      const responseTime = ground
        ? baseResponseTime * this.groundResponseMultiplier
        : baseResponseTime;
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
      } else if (climbing) {
        // Ladder / vine physics: climb up with jump, slow fall otherwise.
        if (this.input.jump) {
          this.velocity.y = 3.5;
        } else if (this.input.sneak) {
          this.velocity.y = 0;
        } else {
          this.velocity.y = Math.max(this.velocity.y - this.opts.gravity * 0.2 * dtSec, -1.5);
        }
      } else {
        const jumpPressedNow = this.input.jump && !this.wasJumpPressed;
        if (jumpPressedNow) this.jumpBufferTimer = JUMP_BUFFER_SEC;
        if (this.onGround) this.coyoteTimer = COYOTE_TIME_SEC;
        else this.coyoteTimer = Math.max(0, this.coyoteTimer - dtSec);
        this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dtSec);

        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
          this.velocity.y = this.opts.jumpVelocity * this.jumpVelocityMultiplier;
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
      const dvy = this.velocity.y * dtSec;
      let dvz = this.velocity.z * dtSec;

      // Sneak edge cling: prevent walking off ledges per axis. Inner
      // ground probe was a fresh arrow closure allocated every frame the
      // player was sneaking on ground (capturing opts/box/probeY/this) —
      // a player sneaking around their base for minutes pays for one
      // closure per frame for nothing. Hoisted to a private method.
      if (this.input.sneak && this.onGround) {
        const box = this.opts.box;
        const probeY = this.position.y - box.halfY - 0.05;
        const isSolid = opts.isSolid;
        if (
          dvx !== 0 &&
          !this.hasGroundAtSneak(this.position.x + dvx, this.position.z, probeY, isSolid, box)
        )
          dvx = 0;
        if (
          dvz !== 0 &&
          !this.hasGroundAtSneak(this.position.x, this.position.z + dvz, probeY, isSolid, box)
        )
          dvz = 0;
        this.velocity.x = dvx / Math.max(dtSec, 0.0001);
        this.velocity.z = dvz / Math.max(dtSec, 0.0001);
      }

      const wasOnGround = this.onGround;
      const stepH = this.input.sneak ? 0 : 0.6;
      MOVE_DV.x = dvx;
      MOVE_DV.y = dvy;
      MOVE_DV.z = dvz;
      const result = sweepMove(this.position, this.opts.box, MOVE_DV, opts.isSolid, stepH);
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

    // Diff-cache the camera position write — Vector3.set fires the
    // onChange callback (matrixWorldNeedsUpdate); standing still
    // (no bob, no sneak transition) writes the same eye-y every frame.
    const camY =
      this.position.y + this.opts.eyeHeight - this.opts.box.halfY - sneakDrop + bobOffset;
    if (
      this.position.x !== this.lastCamPosX ||
      camY !== this.lastCamPosY ||
      this.position.z !== this.lastCamPosZ
    ) {
      this.camera.position.set(this.position.x, camY, this.position.z);
      this.lastCamPosX = this.position.x;
      this.lastCamPosY = camY;
      this.lastCamPosZ = this.position.z;
    }
    if (this.damageTiltSec > 0) {
      this.damageTiltSec = Math.max(0, this.damageTiltSec - dtSec);
      const k = this.damageTiltSec / 0.4;
      const roll = Math.sin(k * Math.PI) * 0.35 * this.damageTiltSign;
      this.camera.rotation.set(this.pitch, this.yaw, roll, 'YXZ');
      this.lastCamRotX = this.pitch;
      this.lastCamRotY = this.yaw;
      this.lastCamRotZ = roll;
    } else if (
      this.pitch !== this.lastCamRotX ||
      this.yaw !== this.lastCamRotY ||
      this.lastCamRotZ !== 0
    ) {
      this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
      this.lastCamRotX = this.pitch;
      this.lastCamRotY = this.yaw;
      this.lastCamRotZ = 0;
    }

    // Sprint FOV kick — eased
    const actuallySprinting =
      this.input.sprint && Math.abs(this.velocity.x) + Math.abs(this.velocity.z) > 0.5;
    const targetBoost = actuallySprinting ? 10 : 0;
    const fovAlpha = 1 - Math.exp(-dtSec / 0.15);
    this.sprintFovBoost += (targetBoost - this.sprintFovBoost) * fovAlpha;
    const baseFov = this.camera.userData['baseFov'] as number | undefined;
    if (baseFov !== undefined) {
      const targetFov = baseFov + this.sprintFovBoost + this.effectFovBoost;
      // Diff-cache fov + projectionMatrix recompute. After sprint
      // boost has settled (~0.5s), targetFov is stable to many decimal
      // places, but the per-frame write still fired updateProjectionMatrix
      // (matrix recomputation is non-trivial). Skip when delta < 0.001 deg.
      if (Math.abs(targetFov - this.camera.fov) > 0.001) {
        this.camera.fov = targetFov;
        this.camera.updateProjectionMatrix();
      }
    }
  }

  setBaseFov(deg: number): void {
    this.camera.userData['baseFov'] = deg;
    this.camera.fov = deg + this.sprintFovBoost + this.effectFovBoost;
    this.camera.updateProjectionMatrix();
  }

  effectFovBoost = 0;
  setEffectFovBoost(deg: number): void {
    this.effectFovBoost = deg;
  }

  private damageTiltSec = 0;
  private damageTiltSign = 1;
  pulseDamageTilt(angleRad: number): void {
    this.damageTiltSec = 0.4;
    this.damageTiltSign = angleRad > 0 ? 1 : -1;
  }

  private hasGroundAtSneak(
    cx: number,
    cz: number,
    probeY: number,
    isSolid: SolidSampler,
    box: AABB,
  ): boolean {
    const flooredY = Math.floor(probeY);
    const minX = Math.floor(cx - box.halfX + 0.01);
    const maxX = Math.floor(cx + box.halfX - 0.01);
    const minZ = Math.floor(cz - box.halfZ + 0.01);
    const maxZ = Math.floor(cz + box.halfZ - 0.01);
    return (
      isSolid(minX, flooredY, minZ) ||
      isSolid(maxX, flooredY, minZ) ||
      isSolid(minX, flooredY, maxZ) ||
      isSolid(maxX, flooredY, maxZ)
    );
  }
}
