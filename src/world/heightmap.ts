// Per-column heightmap. Tracks the highest opaque block per (x, z) to
// speed up light + structure placement + rain hitting surface.

export class Heightmap {
  private readonly map = new Map<string, number>();

  private key(x: number, z: number): string {
    return `${x.toString()},${z.toString()}`;
  }

  set(x: number, z: number, y: number): void {
    this.map.set(this.key(x, z), y);
  }

  get(x: number, z: number): number {
    return this.map.get(this.key(x, z)) ?? -1;
  }

  updateOnPlace(x: number, y: number, z: number): void {
    const cur = this.get(x, z);
    if (y > cur) this.set(x, z, y);
  }

  updateOnBreak(x: number, y: number, z: number, isSolid: (y: number) => boolean): void {
    const cur = this.get(x, z);
    if (y !== cur) return;
    let nextY = y - 1;
    while (nextY >= 0 && !isSolid(nextY)) nextY--;
    this.set(x, z, nextY);
  }

  get size(): number {
    return this.map.size;
  }
}
