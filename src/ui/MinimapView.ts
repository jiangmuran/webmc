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
  private readonly range = 48;
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

  tick(
    dtSec: number,
    camX: number,
    camZ: number,
    world: World,
    registry: BlockRegistry,
    height: MinimapHeightSampler,
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
    ctx.fillStyle = '#ffff80';
    ctx.fillRect(sz / 2 - 2, sz / 2 - 2, 4, 4);
  }
}
