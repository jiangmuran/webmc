import {
  type BlockLookup,
  type PosKey,
  type PowerLevel,
  type RedstoneBlock,
  type RedstoneKind,
  computePower,
  keyOf,
} from './signal';

export interface RedstoneTickOptions {
  tickHz: number;
  buttonHoldSec: number;
}

const DEFAULTS: RedstoneTickOptions = {
  tickHz: 10,
  buttonHoldSec: 1.0,
};

interface ButtonEvent {
  key: string;
  pos: PosKey;
  releaseAt: number;
}

// RedstoneWorld holds the interactive state for redstone sources (lever
// position, button press timers, torch on/off based on mount power) and,
// every redstone tick, recomputes the BFS power map for all loaded dust +
// conductors.
export class RedstoneWorld {
  // Store PosKey alongside the string key so recomputePower can push
  // the existing reference into `sources` instead of re-parsing the
  // string into a fresh {x,y,z} per tick.
  private readonly leverOn = new Map<string, PosKey>();
  private readonly buttonPress: ButtonEvent[] = [];
  private readonly torches = new Map<string, PosKey>();
  private readonly plates = new Map<string, PosKey>();
  private readonly doors = new Set<string>();
  private readonly doorOpen = new Set<string>();
  private accumulator = 0;
  private nowSec = 0;
  private readonly opts: RedstoneTickOptions;
  // Reused per-tick sources array. computePower iterates synchronously
  // and doesn't retain the reference; refilling in place across ticks
  // avoids the per-tick array literal at 10Hz baseline.
  private readonly sourcesScratch: PosKey[] = [];

  constructor(opts: Partial<RedstoneTickOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  get tickPeriodSec(): number {
    return 1 / this.opts.tickHz;
  }

  registerTorch(pos: PosKey): void {
    this.torches.set(keyOf(pos), pos);
  }

  registerPlate(pos: PosKey): void {
    this.plates.set(keyOf(pos), pos);
  }

  registerDoor(pos: PosKey): void {
    this.doors.add(keyOf(pos));
  }

  unregister(pos: PosKey): void {
    const k = keyOf(pos);
    this.leverOn.delete(k);
    this.torches.delete(k);
    this.plates.delete(k);
    this.doors.delete(k);
    this.doorOpen.delete(k);
  }

  toggleLever(pos: PosKey): boolean {
    const k = keyOf(pos);
    if (this.leverOn.has(k)) {
      this.leverOn.delete(k);
      return false;
    }
    this.leverOn.set(k, pos);
    return true;
  }

  pressButton(pos: PosKey): void {
    this.buttonPress.push({
      key: keyOf(pos),
      pos,
      releaseAt: this.nowSec + this.opts.buttonHoldSec,
    });
  }

  isDoorOpen(pos: PosKey): boolean {
    return this.doorOpen.has(keyOf(pos));
  }

  currentPower(pos: PosKey, lookup: BlockLookup): PowerLevel {
    const map = this.recomputePower(lookup);
    return map.get(keyOf(pos)) ?? 0;
  }

  // Advance simulation by `dtSec`. Expired button presses are released;
  // if enough time has accumulated for a redstone tick, recompute power
  // and mirror door open/close state.
  tick(dtSec: number, lookup: BlockLookup): void {
    this.nowSec += dtSec;
    this.accumulator += dtSec;
    for (let i = this.buttonPress.length - 1; i >= 0; i--) {
      const ev = this.buttonPress[i];
      if (ev && ev.releaseAt <= this.nowSec) this.buttonPress.splice(i, 1);
    }
    if (this.accumulator < this.tickPeriodSec) return;
    this.accumulator = 0;
    const power = this.recomputePower(lookup);
    for (const k of this.doors) {
      const level = power.get(k) ?? 0;
      if (level >= 1) this.doorOpen.add(k);
      else this.doorOpen.delete(k);
    }
  }

  private recomputePower(lookup: BlockLookup): Map<string, PowerLevel> {
    const sources = this.sourcesScratch;
    sources.length = 0;
    // PosKey references are stored alongside the string key, so we
    // push the existing object rather than re-parsing the key into a
    // fresh {x,y,z} per source per tick.
    for (const pos of this.leverOn.values()) sources.push(pos);
    for (const ev of this.buttonPress) sources.push(ev.pos);
    for (const pos of this.plates.values()) sources.push(pos);
    // Torch: emits when the mount block is unpowered. To avoid circular
    // evaluation, first compute power without torches and then check mount
    // state. For M8 MVP, treat torches as always-on (constant sources).
    for (const pos of this.torches.values()) sources.push(pos);
    return computePower(sources, lookup);
  }
}

export type { BlockLookup, RedstoneBlock, RedstoneKind };
