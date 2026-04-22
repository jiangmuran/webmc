// Sound instance pool. WebAudio sources are limited per browser; most
// implementations cap us at ~32 concurrent sounds. The pool assigns a
// priority to each instance, and when it's full, new low-priority sounds
// are dropped while high-priority ones evict the lowest-priority playing
// instance.

export interface SoundInstance {
  id: number;
  name: string;
  priority: number; // 0 = lowest
  startedAtSec: number;
  durationSec: number;
  stop: () => void;
}

export interface SoundPoolOptions {
  maxConcurrent: number;
}

export class SoundPool {
  private readonly maxConcurrent: number;
  private readonly active = new Map<number, SoundInstance>();
  private nextId = 1;

  constructor(opts: SoundPoolOptions) {
    this.maxConcurrent = opts.maxConcurrent;
  }

  tryPlay(
    name: string,
    priority: number,
    durationSec: number,
    nowSec: number,
    stop: () => void,
  ): SoundInstance | null {
    if (this.active.size < this.maxConcurrent) {
      return this.addInstance(name, priority, durationSec, nowSec, stop);
    }
    // Evict the lowest-priority playing instance if our priority is higher.
    let victim: SoundInstance | null = null;
    for (const inst of this.active.values()) {
      if (!victim || inst.priority < victim.priority) victim = inst;
    }
    if (victim && victim.priority < priority) {
      victim.stop();
      this.active.delete(victim.id);
      return this.addInstance(name, priority, durationSec, nowSec, stop);
    }
    return null;
  }

  // Sweep finished instances (age > duration).
  tick(nowSec: number): void {
    for (const [id, inst] of this.active) {
      if (nowSec - inst.startedAtSec >= inst.durationSec) {
        inst.stop();
        this.active.delete(id);
      }
    }
  }

  stopAll(): void {
    for (const inst of this.active.values()) inst.stop();
    this.active.clear();
  }

  get activeCount(): number {
    return this.active.size;
  }

  private addInstance(
    name: string,
    priority: number,
    durationSec: number,
    nowSec: number,
    stop: () => void,
  ): SoundInstance {
    const inst: SoundInstance = {
      id: this.nextId++,
      name,
      priority,
      startedAtSec: nowSec,
      durationSec,
      stop,
    };
    this.active.set(inst.id, inst);
    return inst;
  }
}
