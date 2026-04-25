import * as THREE from 'three';
import type { BlockRegistry, RGB } from '@/blocks/registry';
import type { LoadedPackTextures } from '@/ui/ResourcePackLoader';

const NAME_ALIASES: Record<string, string> = {
  grass_block_top: 'grass_block_top',
  grass_block_side: 'grass_block_side',
  grass_block: 'grass_block_side',
  dirt: 'dirt',
  stone: 'stone',
  cobblestone: 'cobblestone',
  sand: 'sand',
  gravel: 'gravel',
  glass: 'glass',
  glowstone: 'glowstone',
};

/**
 * Compute the average RGB of an image. Fast enough for 16×16 tiles.
 */
export function averageColor(img: HTMLImageElement): RGB {
  const size = Math.min(64, Math.max(8, img.width));
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [128, 128, 128];
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, size, size);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const data = ctx.getImageData(0, 0, size, size).data;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] ?? 0;
    if (alpha < 80) continue;
    r += data[i] ?? 0;
    g += data[i + 1] ?? 0;
    b += data[i + 2] ?? 0;
    n++;
  }
  if (n === 0) return [128, 128, 128];
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

export interface ApplyResult {
  blocksRecolored: number;
  missingTextures: string[];
}

export function applyPackToRegistry(
  registry: BlockRegistry,
  pack: LoadedPackTextures,
): ApplyResult {
  let blocksRecolored = 0;
  const missing: string[] = [];
  for (const def of registry.defs) {
    if (def.name === 'webmc:air') continue;
    const id = registry.byName(def.name);
    if (id === undefined) continue;
    const shortName = def.name.replace(/^webmc:/, '');
    const topName = NAME_ALIASES[`${shortName}_top`] ?? `${shortName}_top`;
    const sideName = NAME_ALIASES[`${shortName}_side`] ?? NAME_ALIASES[shortName] ?? shortName;
    const bottomName = NAME_ALIASES[`${shortName}_bottom`] ?? `${shortName}_bottom`;
    const top = pickImage(pack, [topName, sideName, shortName]);
    const side = pickImage(pack, [sideName, shortName]);
    const bottom = pickImage(pack, [bottomName, sideName, shortName]);
    if (top || side || bottom) {
      const topRGB = top ? averageColor(top) : def.faceColors.top;
      const sideRGB = side ? averageColor(side) : def.faceColors.side;
      const bottomRGB = bottom ? averageColor(bottom) : def.faceColors.bottom;
      registry.overrideFaceColors(id, { top: topRGB, side: sideRGB, bottom: bottomRGB });
      blocksRecolored++;
    } else {
      missing.push(shortName);
    }
  }
  return { blocksRecolored, missingTextures: missing };
}

function pickImage(
  pack: LoadedPackTextures,
  names: readonly string[],
): HTMLImageElement | undefined {
  for (const n of names) {
    const img = pack.blockTextures.get(n);
    if (img) return img;
  }
  return undefined;
}

/**
 * Build a pattern texture from the pack's stone/dirt/grass/planks PNGs by averaging their
 * luminance into a single tileable grayscale. The shader multiplies this onto per-block
 * tinted colors, so you get "a texture that looks like the pack" on every block without a
 * full per-face atlas.
 */
export function buildPatternTextureFromPack(pack: LoadedPackTextures): THREE.CanvasTexture | null {
  const preferred = ['stone', 'dirt', 'cobblestone', 'grass_block_top', 'oak_planks'];
  let source: HTMLImageElement | undefined;
  for (const name of preferred) {
    const img = pack.blockTextures.get(name);
    if (img) {
      source = img;
      break;
    }
  }
  if (!source) {
    for (const [, img] of pack.blockTextures) {
      source = img;
      break;
    }
  }
  if (!source) return null;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(16, source.width);
  canvas.height = Math.max(16, source.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  // Convert to luminance-weighted grayscale to avoid double-tinting pack palette.
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = ((d[i] ?? 0) * 299 + (d[i + 1] ?? 0) * 587 + (d[i + 2] ?? 0) * 114) / 1000;
    const v = Math.max(0, Math.min(255, Math.round(lum * 0.4 + 160)));
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapNearestFilter;
  tex.generateMipmaps = true;
  return tex;
}
