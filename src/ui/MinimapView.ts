import type { World } from '@/world/World';
import type { BlockRegistry } from '@/blocks/registry';
import { AIR, stateId } from '@/blocks/state';

export interface MinimapHeightSampler {
  surfaceAt(wx: number, wz: number): number;
}

export class MinimapView {
  readonly root: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly size = 96;
  private range = 48;
  private updateAccum = 0;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('canvas');
    this.root.width = this.size;
    this.root.height = this.size;
    this.root.style.cssText = [
      'position:fixed',
      'right:8px',
      'top:40px',
      `width:${String(this.size)}px`,
      `height:${String(this.size)}px`,
      'border:1px solid rgba(255,255,255,0.22)',
      'border-radius:6px',
      'background:rgba(0,0,0,0.45)',
      'pointer-events:none',
      'image-rendering:pixelated',
      'z-index:12',
    ].join(';');
    this.ctx = this.root.getContext('2d');
    parent.appendChild(this.root);
  }

  setVisible(on: boolean): void {
    this.root.style.display = on ? '' : 'none';
  }

  zoomIn(): void {
    this.range = Math.max(16, Math.floor(this.range * 0.5));
    this.updateAccum = 1;
  }

  zoomOut(): void {
    this.range = Math.min(256, Math.floor(this.range * 2));
    this.updateAccum = 1;
  }

  get currentRange(): number {
    return this.range;
  }

  tick(
    dtSec: number,
    camX: number,
    camZ: number,
    world: World,
    registry: BlockRegistry,
    height: MinimapHeightSampler,
    markers: readonly { x: number; z: number; color: string; size?: number }[] = [],
  ): void {
    this.updateAccum += dtSec;
    if (this.updateAccum < 0.5) return;
    this.updateAccum = 0;
    const ctx = this.ctx;
    if (!ctx) return;
    const sz = this.size;
    const r = this.range;
    const pxW = Math.floor(camX);
    const pzW = Math.floor(camZ);
    const img = ctx.createImageData(sz, sz);
    const scale = r / (sz / 2);
    for (let y = 0; y < sz; y++) {
      for (let x = 0; x < sz; x++) {
        const wx = pxW + Math.floor((x - sz / 2) * scale);
        const wz = pzW + Math.floor((y - sz / 2) * scale);
        const topY = height.surfaceAt(wx, wz);
        let rr = 30, gg = 30, bb = 30;
        const s = world.get(wx, topY, wz);
        const id = s === AIR ? 0 : stateId(s);
        const def = registry.get(id);
        const shade = Math.max(0.35, Math.min(1, topY / 100));
        rr = Math.round(def.color[0] * shade);
        gg = Math.round(def.color[1] * shade);
        bb = Math.round(def.color[2] * shade);
        const idx = (y * sz + x) * 4;
        img.data[idx] = rr;
        img.data[idx + 1] = gg;
        img.data[idx + 2] = bb;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Mob markers.
    for (const m of markers) {
      const mx = (m.x - camX) / scale + sz / 2;
      const my = (m.z - camZ) / scale + sz / 2;
      if (mx < 0 || my < 0 || mx >= sz || my >= sz) continue;
      const s = m.size ?? 2;
      ctx.fillStyle = m.color;
      ctx.fillRect(Math.floor(mx - s / 2), Math.floor(my - s / 2), s, s);
    }
    // Player marker.
    ctx.fillStyle = '#ffff80';
    ctx.fillRect(sz / 2 - 2, sz / 2 - 2, 4, 4);
  }
}
