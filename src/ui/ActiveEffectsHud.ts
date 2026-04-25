import { colorFor } from '../items/potion_color_for_effect';

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

  render(effects: ReadonlyArray<EffectEntry>): void {
    const sig = effects.map((e) => `${e.id}:${String(e.amplifier)}:${Math.ceil(e.remainingSec)}`).join('|');
    if (sig === this.lastSig) return;
    this.lastSig = sig;
    const rows: HTMLDivElement[] = [];
    for (const e of effects) {
      const row = document.createElement('div');
      row.style.cssText = [
        'display:flex',
        'align-items:center',
        'gap:5px',
        'padding:3px 7px',
        'background:rgba(0,0,0,0.55)',
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
      const timeStr = mins > 0 ? `${String(mins)}:${String(remS).padStart(2, '0')}` : `${String(remS)}s`;
      label.textContent = `${e.id}${amp} ${timeStr}`;
      row.appendChild(dot);
      row.appendChild(label);
      rows.push(row);
    }
    this.root.replaceChildren(...rows);
  }
}
