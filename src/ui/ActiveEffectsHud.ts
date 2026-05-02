import { colorFor } from '../items/potion_color_for_effect';
import { isBeneficial } from '../game/potion_effect_timer';

export interface EffectEntry {
  id: string;
  amplifier: number;
  remainingSec: number;
}

export class ActiveEffectsHud {
  private readonly root: HTMLDivElement;
  private lastSig = '';

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'effects-hud');
    this.root.style.cssText = [
      'position:fixed',
      'right:8px',
      'top:38px',
      'display:flex',
      'flex-direction:column',
      'gap:3px',
      'pointer-events:none',
      'z-index:560',
      'font-family:sans-serif',
      'font-size:11px',
      'color:#fff',
      'text-shadow:1px 1px 0 rgba(0,0,0,0.85)',
    ].join(';');
    parent.appendChild(this.root);
  }

  render(effects: readonly EffectEntry[]): void {
    // Fast path for the empty case: no .map() + .join() + closure
    // allocations on every frame the player has no active effects.
    if (effects.length === 0) {
      if (this.lastSig === '') return;
      this.lastSig = '';
      this.root.replaceChildren();
      return;
    }
    // Manual concat — was `.map((e) => ...).join('|')` which allocated
    // a fresh closure + intermediate array on every call (and this
    // fires every frame whenever any effect is active). Same string
    // output, fewer intermediate allocations.
    let sig = '';
    for (let i = 0; i < effects.length; i++) {
      const e = effects[i]!;
      if (i > 0) sig += '|';
      sig += `${e.id}:${String(e.amplifier)}:${Math.ceil(e.remainingSec)}`;
    }
    if (sig === this.lastSig) return;
    this.lastSig = sig;
    const rows: HTMLDivElement[] = [];
    for (const e of effects) {
      const row = document.createElement('div');
      const beneficial = isBeneficial(e.id);
      row.style.cssText = [
        'display:flex',
        'align-items:center',
        'gap:5px',
        'padding:3px 7px',
        beneficial ? 'background:rgba(20,40,20,0.65)' : 'background:rgba(40,15,15,0.65)',
        beneficial ? 'border-left:3px solid #80ff80' : 'border-left:3px solid #ff7070',
        'border-radius:3px',
        'min-width:120px',
      ].join(';');
      const dot = document.createElement('span');
      const color = colorFor(e.id);
      const r = (color >> 16) & 0xff;
      const g = (color >> 8) & 0xff;
      const b = color & 0xff;
      dot.style.cssText = `width:10px;height:10px;border-radius:50%;background:rgb(${String(r)},${String(g)},${String(b)});display:inline-block;`;
      const label = document.createElement('span');
      const amp = e.amplifier > 0 ? ` ${'I'.repeat(Math.min(5, e.amplifier + 1))}` : '';
      const sec = Math.ceil(e.remainingSec);
      const mins = Math.floor(sec / 60);
      const remS = sec % 60;
      const timeStr =
        mins > 0 ? `${String(mins)}:${String(remS).padStart(2, '0')}` : `${String(remS)}s`;
      label.textContent = `${e.id}${amp} ${timeStr}`;
      row.appendChild(dot);
      row.appendChild(label);
      rows.push(row);
    }
    this.root.replaceChildren(...rows);
  }
}
