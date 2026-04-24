// Tiny Web Audio procedural SFX — placeholder sounds for break/place/footstep
// so the game feels alive even without any baked audio assets in the repo.

export type SfxKind = 'break' | 'place' | 'step' | 'click' | 'hit';

export class ProceduralSfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  masterVolume = 0.35;

  attachUnlock(parent: HTMLElement): void {
    const unlock = (): void => {
      this.ensureCtx();
      if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
      parent.removeEventListener('click', unlock);
      parent.removeEventListener('keydown', unlock);
      parent.removeEventListener('touchstart', unlock);
    };
    parent.addEventListener('click', unlock);
    parent.addEventListener('keydown', unlock);
    parent.addEventListener('touchstart', unlock);
  }

  setMasterVolume(v: number): void {
    this.masterVolume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.masterVolume;
  }

  private ensureCtx(): void {
    if (this.ctx) return;
    const Ctx =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.masterVolume;
    this.master.connect(this.ctx.destination);
  }

  play(kind: SfxKind): void {
    this.ensureCtx();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(master);
    let freq = 440;
    let duration = 0.08;
    let type: OscillatorType = 'square';
    let peak = 0.25;
    switch (kind) {
      case 'break':
        freq = 200;
        duration = 0.12;
        type = 'sawtooth';
        peak = 0.3;
        break;
      case 'place':
        freq = 520;
        duration = 0.06;
        type = 'triangle';
        peak = 0.2;
        break;
      case 'step':
        freq = 140 + Math.random() * 40;
        duration = 0.05;
        type = 'sawtooth';
        peak = 0.12;
        break;
      case 'hit':
        freq = 90;
        duration = 0.15;
        type = 'square';
        peak = 0.35;
        break;
      case 'click':
        freq = 800;
        duration = 0.02;
        type = 'sine';
        peak = 0.15;
        break;
    }
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.5), now + duration);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  footstepIfMoving(moving: boolean, dtSec: number): void {
    if (!moving) {
      this.stepAccum = 0;
      return;
    }
    this.stepAccum += dtSec;
    if (this.stepAccum >= 0.42) {
      this.stepAccum = 0;
      this.play('step');
    }
  }
  private stepAccum = 0;
}
