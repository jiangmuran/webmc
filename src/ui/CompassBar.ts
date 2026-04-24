export class CompassBar {
  private readonly root: HTMLDivElement;
  private readonly strip: HTMLDivElement;
  private readonly needle: HTMLDivElement;
  private readonly WIDTH = 260;
  private readonly TICKS = 16;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:8px',
      'transform:translateX(-50%)',
      `width:${String(this.WIDTH)}px`,
      'height:22px',
      'background:rgba(10,14,20,0.55)',
      'border:1px solid rgba(255,255,255,0.12)',
      'border-radius:4px',
      'overflow:hidden',
      'pointer-events:none',
      'user-select:none',
      'z-index:12',
      'color:#eef',
      'font-family:monospace',
      'font-size:12px',
    ].join(';');

    this.strip = document.createElement('div');
    this.strip.style.cssText = [
      'position:absolute',
      'top:0',
      'bottom:0',
      `width:${String(this.WIDTH * 4)}px`,
      'display:flex',
      'align-items:center',
      'justify-content:space-around',
      'left:0',
      'transition:transform 0.05s linear',
    ].join(';');
    const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for (let i = 0; i < this.TICKS; i++) {
      const seg = document.createElement('div');
      seg.style.cssText = 'padding:0 6px;opacity:0.82;min-width:24px;text-align:center;';
      seg.textContent = labels[i] ?? '';
      if (labels[i] === 'N') seg.style.color = '#ff8a8a';
      this.strip.appendChild(seg);
    }
    this.root.appendChild(this.strip);

    this.needle = document.createElement('div');
    this.needle.style.cssText = [
      'position:absolute',
      'left:50%',
      'top:0',
      'bottom:0',
      'width:2px',
      'transform:translateX(-50%)',
      'background:rgba(255,240,120,0.8)',
    ].join(';');
    this.root.appendChild(this.needle);

    parent.appendChild(this.root);
  }

  setYaw(yaw: number): void {
    const twoPi = Math.PI * 2;
    const normalized = ((yaw % twoPi) + twoPi) % twoPi;
    const segmentWidth = (this.WIDTH * 4) / this.TICKS;
    const fullLoop = segmentWidth * 8;
    const center = this.WIDTH / 2 - segmentWidth / 2;
    const offset = (normalized / twoPi) * fullLoop;
    let px = (center + offset) % fullLoop;
    if (px > fullLoop / 2) px -= fullLoop;
    this.strip.style.transform = `translateX(${px.toFixed(1)}px)`;
  }

  show(): void {
    this.root.style.display = '';
  }

  hide(): void {
    this.root.style.display = 'none';
  }
}
