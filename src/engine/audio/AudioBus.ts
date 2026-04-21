export interface AudioBusOptions {
  masterVolume: number;
  attenuationStart: number;
  attenuationMax: number;
}

const DEFAULTS: AudioBusOptions = {
  masterVolume: 0.4,
  attenuationStart: 2,
  attenuationMax: 16,
};

interface ListenerPose {
  x: number;
  y: number;
  z: number;
}

type ProceduralSound = (ctx: AudioContext, dest: AudioNode, t: number) => void;

// Short procedural impact sound: exponential-decay sine with a noise dusting.
const breakSound: ProceduralSound = (ctx, dest, t) => {
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.8, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain).connect(dest);
  osc.start(t);
  osc.stop(t + 0.15);
};

const placeSound: ProceduralSound = (ctx, dest, t) => {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(230, t + 0.05);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(gain).connect(dest);
  osc.start(t);
  osc.stop(t + 0.1);
};

const stepSound: ProceduralSound = (ctx, dest, t) => {
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(95, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.04);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(gain).connect(dest);
  osc.start(t);
  osc.stop(t + 0.08);
};

export const SOUNDS = {
  break: breakSound,
  place: placeSound,
  step: stepSound,
} as const;

export type SoundName = keyof typeof SOUNDS;

export class AudioBus {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private listener: ListenerPose = { x: 0, y: 0, z: 0 };
  private opts: AudioBusOptions;
  private unlocked = false;

  constructor(opts: Partial<AudioBusOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  attachUnlock(el: HTMLElement): void {
    const unlock = (): void => {
      this.ensureContext();
      el.removeEventListener('click', unlock);
      el.removeEventListener('touchstart', unlock);
      el.removeEventListener('keydown', unlock);
    };
    el.addEventListener('click', unlock);
    el.addEventListener('touchstart', unlock);
    el.addEventListener('keydown', unlock);
  }

  setMasterVolume(v: number): void {
    this.opts.masterVolume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.opts.masterVolume;
  }

  setListener(x: number, y: number, z: number): void {
    this.listener.x = x;
    this.listener.y = y;
    this.listener.z = z;
  }

  play(name: SoundName): void {
    this.play3D(name, this.listener.x, this.listener.y, this.listener.z);
  }

  play3D(name: SoundName, x: number, y: number, z: number): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const dx = x - this.listener.x;
    const dy = y - this.listener.y;
    const dz = z - this.listener.z;
    const dist = Math.hypot(dx, dy, dz);
    const attenuation =
      dist <= this.opts.attenuationStart
        ? 1
        : dist >= this.opts.attenuationMax
          ? 0
          : 1 -
            (dist - this.opts.attenuationStart) /
              (this.opts.attenuationMax - this.opts.attenuationStart);
    if (attenuation <= 0) return;
    const sound = SOUNDS[name];
    const gate = ctx.createGain();
    gate.gain.value = attenuation;
    gate.connect(this.master);
    sound(ctx, gate, ctx.currentTime);
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx && this.unlocked) return this.ctx;
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext;
      if (!AC) return null;
      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.opts.masterVolume;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      this.unlocked = this.ctx.state === 'running';
      return this.ctx;
    } catch {
      return null;
    }
  }
}
