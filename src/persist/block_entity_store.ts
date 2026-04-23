export interface BlockEntity {
  id: string;
  x: number;
  y: number;
  z: number;
  nbt: Record<string, unknown>;
}

export interface Store {
  byKey: Map<string, BlockEntity>;
}

export function key(x: number, y: number, z: number): string {
  return `${x | 0},${y | 0},${z | 0}`;
}

export function set(s: Store, be: BlockEntity): void {
  s.byKey.set(key(be.x, be.y, be.z), be);
}

export function get(s: Store, x: number, y: number, z: number): BlockEntity | undefined {
  return s.byKey.get(key(x, y, z));
}

export function remove(s: Store, x: number, y: number, z: number): boolean {
  return s.byKey.delete(key(x, y, z));
}

export function count(s: Store): number {
  return s.byKey.size;
}
