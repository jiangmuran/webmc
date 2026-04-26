export class CompassBar {
  private readonly root: HTMLDivElement;
  private readonly strip: HTMLDivElement;
  private readonly needle: HTMLDivElement;
  private readonly spawnMarker: HTMLDivElement;
  private readonly deathMarker: HTMLDivElement;
  private readonly WIDTH = 260;
  private readonly TICKS = 16;
  // Diff caches to skip transform / left writes when the rounded
  // value hasn't changed. setYaw fires every frame and most frames
  // the player isn't turning fast enough to move a tenth of a pixel.
  private lastStripPx: number | null = null;
  private lastSpawnPx: number | null = null;
  private lastDeathPx: number | null = null;
  private lastSpawnVisible = false;
  private lastDeathVisible = false;

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
    const labels = [
      'N',
      'NE',
      'E',
      'SE',
      'S',
      'SW',
      'W',
      'NW',
      'N',
      'NE',
      'E',
      'SE',
      'S',
      'SW',
      'W',
      'NW',
    ];
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

    this.spawnMarker = document.createElement('div');
    this.spawnMarker.title = 'Spawn';
    this.spawnMarker.style.cssText = [
      'position:absolute',
      'top:1px',
      'width:8px',
      'height:8px',
      'border-radius:50%',
      'background:#80ffa0',
      'border:1px solid rgba(0,0,0,0.6)',
      'transform:translateX(-50%)',
      'display:none',
      'pointer-events:none',
    ].join(';');
    this.root.appendChild(this.spawnMarker);

    this.deathMarker = document.createElement('div');
    this.deathMarker.title = 'Last death';
    this.deathMarker.style.cssText = [
      'position:absolute',
      'top:11px',
      'width:8px',
      'height:8px',
      'border-radius:50%',
      'background:#ff7080',
      'border:1px solid rgba(0,0,0,0.6)',
      'transform:translateX(-50%)',
      'display:none',
      'pointer-events:none',
    ].join(';');
    this.root.appendChild(this.deathMarker);

    parent.appendChild(this.root);
  }

  setDeathDir(angleToDeath: number | null, playerYaw: number): void {
    if (angleToDeath === null) {
      if (this.lastDeathVisible) {
        this.deathMarker.style.display = 'none';
        this.lastDeathVisible = false;
      }
      return;
    }
    let rel = angleToDeath - playerYaw;
    while (rel > Math.PI) rel -= 2 * Math.PI;
    while (rel < -Math.PI) rel += 2 * Math.PI;
    if (rel < -Math.PI / 2 || rel > Math.PI / 2) {
      if (this.lastDeathVisible) {
        this.deathMarker.style.display = 'none';
        this.lastDeathVisible = false;
      }
      return;
    }
    if (!this.lastDeathVisible) {
      this.deathMarker.style.display = 'block';
      this.lastDeathVisible = true;
    }
    const halfW = this.WIDTH / 2;
    const px = halfW + (rel / (Math.PI / 2)) * halfW;
    const rounded = Math.round(px * 10) / 10;
    if (rounded === this.lastDeathPx) return;
    this.lastDeathPx = rounded;
    this.deathMarker.style.left = `${rounded.toFixed(1)}px`;
  }

  setSpawnDir(angleToSpawn: number | null, playerYaw: number): void {
    if (angleToSpawn === null) {
      if (this.lastSpawnVisible) {
        this.spawnMarker.style.display = 'none';
        this.lastSpawnVisible = false;
      }
      return;
    }
    // Compute relative angle in [-PI, PI].
    let rel = angleToSpawn - playerYaw;
    while (rel > Math.PI) rel -= 2 * Math.PI;
    while (rel < -Math.PI) rel += 2 * Math.PI;
    // Visible range: ±90° (-π/2 to π/2). Beyond: hide.
    if (rel < -Math.PI / 2 || rel > Math.PI / 2) {
      if (this.lastSpawnVisible) {
        this.spawnMarker.style.display = 'none';
        this.lastSpawnVisible = false;
      }
      return;
    }
    if (!this.lastSpawnVisible) {
      this.spawnMarker.style.display = 'block';
      this.lastSpawnVisible = true;
    }
    const halfW = this.WIDTH / 2;
    const px = halfW + (rel / (Math.PI / 2)) * halfW;
    const rounded = Math.round(px * 10) / 10;
    if (rounded === this.lastSpawnPx) return;
    this.lastSpawnPx = rounded;
    this.spawnMarker.style.left = `${rounded.toFixed(1)}px`;
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
    // Round to one-decimal pixel grid; skip the transform write
    // when the rounded value hasn't moved.
    const rounded = Math.round(px * 10) / 10;
    if (rounded === this.lastStripPx) return;
    this.lastStripPx = rounded;
    this.strip.style.transform = `translateX(${rounded.toFixed(1)}px)`;
  }

  show(): void {
    this.root.style.display = '';
  }

  hide(): void {
    this.root.style.display = 'none';
  }
}
