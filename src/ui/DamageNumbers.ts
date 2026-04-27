interface DamageNumber {
  el: HTMLDivElement;
  worldX: number;
  worldY: number;
  worldZ: number;
  ageSec: number;
  lifeSec: number;
  // Diff cache for the el.style.display transition. Most damage numbers
  // stay visible (or stay hidden behind walls) for their entire life;
  // writing display='' or display='none' every frame triggers style
  // invalidation cumulatively even when the value is identical.
  visible: boolean;
}

export class DamageNumbers {
  private readonly layer: HTMLDivElement;
  private readonly active: DamageNumber[] = [];

  constructor(parent: HTMLElement) {
    this.layer = document.createElement('div');
    this.layer.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:15;overflow:hidden;';
    parent.appendChild(this.layer);
  }

  spawn(worldX: number, worldY: number, worldZ: number, amount: number, color = '#ff8080'): void {
    const el = document.createElement('div');
    el.textContent = `-${amount.toFixed(0)}`;
    el.style.cssText = [
      'position:absolute',
      'color:' + color,
      'font-family:monospace',
      'font-weight:700',
      'font-size:18px',
      'text-shadow:2px 2px 0 rgba(0,0,0,0.8)',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'will-change:transform,opacity',
    ].join(';');
    this.layer.appendChild(el);
    this.active.push({ el, worldX, worldY, worldZ, ageSec: 0, lifeSec: 1.0, visible: true });
  }

  tick(
    dtSec: number,
    project: (
      x: number,
      y: number,
      z: number,
    ) => { sx: number; sy: number; visible: boolean } | null,
  ): void {
    // Skip the loop entirely when nothing's active. Most frames have
    // no damage numbers floating; this avoids the function-call setup
    // and the project-callback parameter pass.
    if (this.active.length === 0) return;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const n = this.active[i]!;
      n.ageSec += dtSec;
      if (n.ageSec >= n.lifeSec) {
        n.el.remove();
        const last = this.active.length - 1;
        if (i !== last) this.active[i] = this.active[last]!;
        this.active.pop();
        continue;
      }
      const t = n.ageSec / n.lifeSec;
      const p = project(n.worldX, n.worldY + t * 1.4, n.worldZ);
      if (!p?.visible) {
        if (n.visible) {
          n.el.style.display = 'none';
          n.visible = false;
        }
        continue;
      }
      if (!n.visible) {
        n.el.style.display = '';
        n.visible = true;
      }
      n.el.style.left = `${p.sx.toFixed(1)}px`;
      n.el.style.top = `${p.sy.toFixed(1)}px`;
      n.el.style.opacity = String(1 - t);
    }
  }
}
