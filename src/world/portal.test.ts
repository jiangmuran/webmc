import { describe, it, expect } from 'vitest';
import { findPortalFrame, type PortalLookup } from './portal';

class Grid implements PortalLookup {
  readonly obs = new Set<string>();
  readonly air = new Set<string>();
  k(x: number, y: number, z: number): string {
    return `${x.toString()},${y.toString()},${z.toString()}`;
  }
  addObsidian(x: number, y: number, z: number): void {
    this.obs.add(this.k(x, y, z));
  }
  addAir(x: number, y: number, z: number): void {
    this.air.add(this.k(x, y, z));
  }
  isObsidian(x: number, y: number, z: number): boolean {
    return this.obs.has(this.k(x, y, z));
  }
  isAir(x: number, y: number, z: number): boolean {
    return this.air.has(this.k(x, y, z));
  }
}

function buildFrameX(g: Grid, x0: number, y0: number, z: number): void {
  for (let w = 0; w < 4; w++) {
    g.addObsidian(x0 + w, y0, z);
    g.addObsidian(x0 + w, y0 + 4, z);
  }
  for (let h = 1; h <= 3; h++) {
    g.addObsidian(x0, y0 + h, z);
    g.addObsidian(x0 + 3, y0 + h, z);
  }
  for (let w = 1; w <= 2; w++) {
    for (let h = 1; h <= 3; h++) {
      g.addAir(x0 + w, y0 + h, z);
    }
  }
}

describe('portal frame detection', () => {
  it('finds a valid x-axis frame from any inner cell', () => {
    const g = new Grid();
    buildFrameX(g, 10, 64, 5);
    const f = findPortalFrame(g, 11, 65, 5);
    expect(f).not.toBeNull();
    expect(f?.axis).toBe('x');
    expect(f?.inner.length).toBe(6);
  });

  it('returns null when obsidian is missing', () => {
    const g = new Grid();
    buildFrameX(g, 0, 0, 0);
    g.obs.delete(g.k(0, 2, 0)); // knock out a left pillar
    expect(findPortalFrame(g, 1, 2, 0)).toBeNull();
  });

  it('returns null when interior is not air', () => {
    const g = new Grid();
    buildFrameX(g, 0, 0, 0);
    g.air.delete(g.k(1, 2, 0));
    expect(findPortalFrame(g, 1, 2, 0)).toBeNull();
  });
});
