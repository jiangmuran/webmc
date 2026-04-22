// Block-entity registry. Holds the per-position state for blocks that
// carry extra data (chest contents, furnace progress, sign text, etc.).
// The world stores BlockStates (id + props); this sidecar stores the rich
// state and is keyed by world position.

export type BlockEntityKind =
  | 'chest'
  | 'trapped_chest'
  | 'shulker_box'
  | 'barrel'
  | 'furnace'
  | 'blast_furnace'
  | 'smoker'
  | 'brewing_stand'
  | 'hopper'
  | 'dispenser'
  | 'dropper'
  | 'beacon'
  | 'sign'
  | 'hanging_sign'
  | 'banner'
  | 'jukebox'
  | 'note_block'
  | 'spawner'
  | 'lectern'
  | 'enchanting_table'
  | 'conduit'
  | 'bell'
  | 'campfire'
  | 'soul_campfire'
  | 'crafter'
  | 'bed';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BlockEntity<T = unknown> {
  kind: BlockEntityKind;
  pos: Vec3;
  state: T;
}

function key(pos: Vec3): string {
  return `${pos.x.toString()},${pos.y.toString()},${pos.z.toString()}`;
}

export class BlockEntityWorld {
  private readonly entities = new Map<string, BlockEntity>();

  place(kind: BlockEntityKind, pos: Vec3, state: unknown): void {
    this.entities.set(key(pos), { kind, pos: { ...pos }, state });
  }

  remove(pos: Vec3): void {
    this.entities.delete(key(pos));
  }

  get<T>(pos: Vec3): BlockEntity<T> | null {
    return (this.entities.get(key(pos)) as BlockEntity<T> | undefined) ?? null;
  }

  all(): IterableIterator<BlockEntity> {
    return this.entities.values();
  }

  get size(): number {
    return this.entities.size;
  }

  serialize(): { k: BlockEntityKind; p: Vec3; s: unknown }[] {
    return Array.from(this.entities.values()).map((e) => ({ k: e.kind, p: e.pos, s: e.state }));
  }

  hydrate(entries: readonly { k: BlockEntityKind; p: Vec3; s: unknown }[]): void {
    this.entities.clear();
    for (const e of entries) this.place(e.k, e.p, e.s);
  }
}
