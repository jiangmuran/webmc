import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import { type BitsPerIndex, bitsNeeded } from './packed-indices';

export const MAX_PALETTE_ENTRIES = 65536;

export class Palette {
  private readonly _entries: BlockState[];
  private readonly _byState: Map<BlockState, number>;

  constructor(initial: readonly BlockState[] = [AIR]) {
    this._entries = [...initial];
    this._byState = new Map();
    for (let i = 0; i < this._entries.length; i++) {
      const s = this._entries[i];
      if (s !== undefined && !this._byState.has(s)) this._byState.set(s, i);
    }
  }

  get size(): number {
    return this._entries.length;
  }

  get bitsPerIndex(): BitsPerIndex {
    return bitsNeeded(this._entries.length);
  }

  get entries(): readonly BlockState[] {
    return this._entries;
  }

  get(index: number): BlockState {
    const s = this._entries[index];
    if (s === undefined) throw new Error(`Palette: no entry at index ${String(index)}`);
    return s;
  }

  indexOf(state: BlockState): number {
    return this._byState.get(state) ?? -1;
  }

  add(state: BlockState): number {
    const existing = this._byState.get(state);
    if (existing !== undefined) return existing;
    if (this._entries.length >= MAX_PALETTE_ENTRIES) {
      throw new Error(`Palette: capacity exceeded (${String(MAX_PALETTE_ENTRIES)})`);
    }
    const idx = this._entries.length;
    this._entries.push(state);
    this._byState.set(state, idx);
    return idx;
  }

  clone(): Palette {
    return new Palette(this._entries);
  }
}
