import * as THREE from 'three';
import type { BlockRegistry, RGB } from '@/blocks/registry';

export const ATLAS_TILES_PER_ROW = 16;
export const ATLAS_TILE_PX = 16;
export const ATLAS_PX = ATLAS_TILES_PER_ROW * ATLAS_TILE_PX;

export interface BlockTiles {
  top: number;
  side: number;
  bottom: number;
}

export class Atlas {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly texture: THREE.CanvasTexture;
  private readonly tileIndexByName = new Map<string, number>();
  private nextIndex = 1; // 0 reserved for air / "missing"

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = ATLAS_PX;
    this.canvas.height = ATLAS_PX;
    const ctx = this.canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) throw new Error('Atlas: canvas 2d context unavailable');
    ctx.imageSmoothingEnabled = false;
    this.ctx = ctx;
    this.drawMissingTile(0);
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestMipmapNearestFilter;
    this.texture.generateMipmaps = true;
  }

  indexFor(name: string): number {
    const existing = this.tileIndexByName.get(name);
    if (existing !== undefined) return existing;
    const idx = this.nextIndex++;
    if (idx >= ATLAS_TILES_PER_ROW * ATLAS_TILES_PER_ROW) {
      // Overflow: reuse 0 (missing) — atlas size is capped at 256 tiles total.
      return 0;
    }
    this.tileIndexByName.set(name, idx);
    return idx;
  }

  setTileFromColor(name: string, color: RGB): number {
    const idx = this.indexFor(name);
    this.drawProceduralTile(idx, color, name);
    return idx;
  }

  setTileFromImage(name: string, img: HTMLImageElement): number {
    const idx = this.indexFor(name);
    this.drawImageTile(idx, img);
    return idx;
  }

  flush(): void {
    this.texture.needsUpdate = true;
  }

  tileXY(idx: number): { x: number; y: number } {
    return {
      x: idx % ATLAS_TILES_PER_ROW,
      y: Math.floor(idx / ATLAS_TILES_PER_ROW),
    };
  }

  private drawProceduralTile(idx: number, color: RGB, seed: string): void {
    const { x, y } = this.tileXY(idx);
    const pxX = x * ATLAS_TILE_PX;
    const pxY = y * ATLAS_TILE_PX;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
    const img = this.ctx.createImageData(ATLAS_TILE_PX, ATLAS_TILE_PX);
    for (let j = 0; j < ATLAS_TILE_PX; j++) {
      for (let i = 0; i < ATLAS_TILE_PX; i++) {
        h = Math.imul(h ^ (i * 73 + j * 19), 16777619);
        const n = ((h >>> 24) & 0xff) / 255;
        const tint = 0.82 + 0.18 * n;
        const r = Math.min(255, Math.round(color[0] * tint));
        const g = Math.min(255, Math.round(color[1] * tint));
        const b = Math.min(255, Math.round(color[2] * tint));
        const edge =
          i === 0 || i === ATLAS_TILE_PX - 1 || j === 0 || j === ATLAS_TILE_PX - 1 ? 0.72 : 1;
        const k = (j * ATLAS_TILE_PX + i) * 4;
        img.data[k] = Math.round(r * edge);
        img.data[k + 1] = Math.round(g * edge);
        img.data[k + 2] = Math.round(b * edge);
        img.data[k + 3] = 255;
      }
    }
    this.ctx.putImageData(img, pxX, pxY);
  }

  private drawImageTile(idx: number, img: HTMLImageElement): void {
    const { x, y } = this.tileXY(idx);
    const pxX = x * ATLAS_TILE_PX;
    const pxY = y * ATLAS_TILE_PX;
    this.ctx.clearRect(pxX, pxY, ATLAS_TILE_PX, ATLAS_TILE_PX);
    this.ctx.drawImage(img, pxX, pxY, ATLAS_TILE_PX, ATLAS_TILE_PX);
  }

  private drawMissingTile(idx: number): void {
    const { x, y } = this.tileXY(idx);
    const pxX = x * ATLAS_TILE_PX;
    const pxY = y * ATLAS_TILE_PX;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(pxX, pxY, ATLAS_TILE_PX, ATLAS_TILE_PX);
    this.ctx.fillStyle = '#ff00ff';
    for (let j = 0; j < ATLAS_TILE_PX; j += 2) {
      for (let i = 0; i < ATLAS_TILE_PX; i += 2) {
        if (((i + j) & 2) === 0) this.ctx.fillRect(pxX + i, pxY + j, 2, 2);
      }
    }
  }

  /**
   * Populate default procedural tiles for every block in the registry.
   * Stores top/side/bottom tile indices per block.
   */
  buildDefaultsFromRegistry(registry: BlockRegistry): ReadonlyMap<number, BlockTiles> {
    const out = new Map<number, BlockTiles>();
    for (const def of registry.defs) {
      if (def.name === 'webmc:air') continue;
      const id = registry.byName(def.name);
      if (id === undefined) continue;
      const short = def.name.replace(/^webmc:/, '');
      const top = this.setTileFromColor(`${short}_top`, def.faceColors.top);
      const side = this.setTileFromColor(`${short}_side`, def.faceColors.side);
      const bottom = this.setTileFromColor(`${short}_bottom`, def.faceColors.bottom);
      out.set(id, { top, side, bottom });
    }
    this.flush();
    return out;
  }

  applyPack(
    registry: BlockRegistry,
    blockTextures: ReadonlyMap<string, HTMLImageElement>,
  ): { recolored: number; tilesByBlock: ReadonlyMap<number, BlockTiles> } {
    const out = new Map<number, BlockTiles>();
    let recolored = 0;
    for (const def of registry.defs) {
      if (def.name === 'webmc:air') continue;
      const id = registry.byName(def.name);
      if (id === undefined) continue;
      const short = def.name.replace(/^webmc:/, '');
      const topName = `${short}_top`;
      const sideName = `${short}_side`;
      const bottomName = `${short}_bottom`;
      const topImg = blockTextures.get(topName) ?? blockTextures.get(short);
      const sideImg = blockTextures.get(sideName) ?? blockTextures.get(short) ?? topImg;
      const bottomImg = blockTextures.get(bottomName) ?? blockTextures.get(short) ?? topImg;
      let top: number;
      let side: number;
      let bottom: number;
      if (topImg) top = this.setTileFromImage(topName, topImg);
      else top = this.setTileFromColor(topName, def.faceColors.top);
      if (sideImg) side = this.setTileFromImage(sideName, sideImg);
      else side = this.setTileFromColor(sideName, def.faceColors.side);
      if (bottomImg) bottom = this.setTileFromImage(bottomName, bottomImg);
      else bottom = this.setTileFromColor(bottomName, def.faceColors.bottom);
      if (topImg || sideImg || bottomImg) recolored++;
      out.set(id, { top, side, bottom });
    }
    this.flush();
    return { recolored, tilesByBlock: out };
  }
}
