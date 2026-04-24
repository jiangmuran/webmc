import type * as THREE from 'three';
import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import type { World } from '@/world/World';
import type { SolidSampler } from '@/physics/collision';
import { type RayHit, faceNormal, raycastVoxels } from '@/physics/raycast';

export interface InteractionOptions {
  reach: number;
  repeatMs: number;
  breakDurationSec: number;
  onBreak?: (bx: number, by: number, bz: number) => void;
  onPlace?: (bx: number, by: number, bz: number) => void;
  onBreakProgress?: (bx: number, by: number, bz: number, p01: number) => void;
  onBreakCancel?: () => void;
}

const DEFAULTS: InteractionOptions = {
  reach: 6,
  repeatMs: 220,
  breakDurationSec: 0.4,
};

export interface BreakProgress {
  bx: number;
  by: number;
  bz: number;
  progress01: number;
}

export class InteractionController {
  private canvas: HTMLCanvasElement | null = null;
  private held: 'break' | 'place' | null = null;
  private lastActionAt = 0;
  private readonly opts: InteractionOptions;
  selectedBlock: BlockState = AIR;
  breaking: BreakProgress | null = null;
  breakDurationSec: number;

  setHeld(kind: 'break' | 'place' | null): void {
    const prev = this.held;
    this.held = kind;
    if (prev === 'break' && kind !== 'break') this.cancelBreak();
    if (kind === 'place' && prev !== 'place') this.act();
  }

  private readonly onMouseDown: (e: MouseEvent) => void;
  private readonly onMouseUp: (e: MouseEvent) => void;
  private readonly onContextMenu: (e: MouseEvent) => void;

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly getLook: () => { x: number; y: number; z: number },
    private readonly world: World,
    private readonly isSolid: SolidSampler,
    opts: Partial<InteractionOptions> = {},
  ) {
    this.opts = { ...DEFAULTS, ...opts };
    this.breakDurationSec = this.opts.breakDurationSec;
    this.onMouseDown = (e) => {
      if (document.pointerLockElement !== this.canvas) return;
      if (e.button === 0) {
        this.held = 'break';
      } else if (e.button === 2) {
        this.held = 'place';
        this.act();
      }
    };
    this.onMouseUp = (e) => {
      if (e.button === 0 && this.held === 'break') {
        this.held = null;
        this.cancelBreak();
      } else if (e.button === 2 && this.held === 'place') {
        this.held = null;
      }
    };
    this.onContextMenu = (e) => {
      e.preventDefault();
    };
  }

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  detach(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onMouseDown);
      this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    }
    window.removeEventListener('mouseup', this.onMouseUp);
    this.canvas = null;
  }

  tick(nowMs: number): void {
    if (this.held === null) return;
    if (this.held === 'place') {
      if (nowMs - this.lastActionAt < this.opts.repeatMs) return;
      this.act(nowMs);
    }
  }

  tickBreak(dtSec: number): void {
    if (this.held !== 'break') {
      this.cancelBreak();
      return;
    }
    const hit = this.castRay();
    if (!hit || hit.distance === 0) {
      this.cancelBreak();
      return;
    }
    if (
      this.breaking === null ||
      this.breaking.bx !== hit.bx ||
      this.breaking.by !== hit.by ||
      this.breaking.bz !== hit.bz
    ) {
      this.breaking = { bx: hit.bx, by: hit.by, bz: hit.bz, progress01: 0 };
    }
    const duration = Math.max(0.0001, this.breakDurationSec);
    this.breaking.progress01 = Math.min(1, this.breaking.progress01 + dtSec / duration);
    this.opts.onBreakProgress?.(hit.bx, hit.by, hit.bz, this.breaking.progress01);
    if (this.breaking.progress01 >= 1) {
      this.world.set(hit.bx, hit.by, hit.bz, AIR);
      this.opts.onBreak?.(hit.bx, hit.by, hit.bz);
      this.breaking = null;
    }
  }

  private cancelBreak(): void {
    if (this.breaking !== null) {
      this.opts.onBreakCancel?.();
      this.breaking = null;
    }
  }

  castRay(): RayHit | null {
    const origin = this.camera.position;
    const look = this.getLook();
    return raycastVoxels(origin, look, this.opts.reach, this.isSolid);
  }

  private act(nowMs = performance.now()): void {
    this.lastActionAt = nowMs;
    const hit = this.castRay();
    if (!hit || hit.distance === 0) return;
    if (this.held === 'place' && this.selectedBlock !== AIR) {
      const n = faceNormal(hit.face);
      const tx = hit.bx + n[0];
      const ty = hit.by + n[1];
      const tz = hit.bz + n[2];
      if (this.world.get(tx, ty, tz) !== AIR) return;
      if (this.collidesWithPlayer(tx, ty, tz)) return;
      this.world.set(tx, ty, tz, this.selectedBlock);
      this.opts.onPlace?.(tx, ty, tz);
    }
  }

  private collidesWithPlayer(bx: number, by: number, bz: number): boolean {
    const p = this.camera.position;
    const minX = bx;
    const maxX = bx + 1;
    const minY = by;
    const maxY = by + 1;
    const minZ = bz;
    const maxZ = bz + 1;
    return (
      p.x + 0.3 > minX &&
      p.x - 0.3 < maxX &&
      p.y + 0.9 > minY &&
      p.y - 1.62 < maxY &&
      p.z + 0.3 > minZ &&
      p.z - 0.3 < maxZ
    );
  }
}
