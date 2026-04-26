export interface CrosshairOpts {
  size: number;
  thickness: number;
  color: string;
}

const DEFAULTS: CrosshairOpts = {
  size: 14,
  thickness: 2,
  color: '#ffffffcc',
};

export class Crosshair {
  readonly root: HTMLDivElement;
  private readonly ring: SVGCircleElement;
  private readonly ringSvg: SVGSVGElement;
  private readonly ringCircumference: number;
  private lastFraction = 1;
  private lastTint: string | null | undefined = undefined;
  private tintTargets: HTMLElement[] = [];

  constructor(parent: HTMLElement, opts: Partial<CrosshairOpts> = {}) {
    const o = { ...DEFAULTS, ...opts };
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'crosshair');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'pointer-events:none',
      'z-index:40',
      `width:${String(o.size * 2)}px`,
      `height:${String(o.size * 2)}px`,
      'transform:translate(-50%,-50%)',
    ].join(';');
    const horiz = document.createElement('div');
    horiz.style.cssText = [
      'position:absolute',
      'left:0',
      `right:0`,
      'top:50%',
      `height:${String(o.thickness)}px`,
      `background:${o.color}`,
      'transform:translateY(-50%)',
      'mix-blend-mode:difference',
    ].join(';');
    const vert = document.createElement('div');
    vert.style.cssText = [
      'position:absolute',
      'top:0',
      'bottom:0',
      'left:50%',
      `width:${String(o.thickness)}px`,
      `background:${o.color}`,
      'transform:translateX(-50%)',
      'mix-blend-mode:difference',
    ].join(';');
    this.root.append(horiz, vert);

    const ringRadius = o.size + 4;
    const ringSize = ringRadius * 2 + 4;
    this.ringCircumference = 2 * Math.PI * ringRadius;
    this.ringSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.ringSvg.setAttribute('width', String(ringSize));
    this.ringSvg.setAttribute('height', String(ringSize));
    this.ringSvg.setAttribute('viewBox', `0 0 ${String(ringSize)} ${String(ringSize)}`);
    this.ringSvg.style.cssText = [
      'position:absolute',
      'left:50%',
      'top:50%',
      `width:${String(ringSize)}px`,
      `height:${String(ringSize)}px`,
      'transform:translate(-50%,-50%) rotate(-90deg)',
      'opacity:0',
      'transition:opacity 120ms',
    ].join(';');
    this.ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.ring.setAttribute('cx', String(ringSize / 2));
    this.ring.setAttribute('cy', String(ringSize / 2));
    this.ring.setAttribute('r', String(ringRadius));
    this.ring.setAttribute('fill', 'none');
    this.ring.setAttribute('stroke', '#ffffffcc');
    this.ring.setAttribute('stroke-width', '2');
    this.ring.setAttribute('stroke-dasharray', String(this.ringCircumference));
    this.ring.setAttribute('stroke-dashoffset', String(this.ringCircumference));
    this.ringSvg.appendChild(this.ring);
    this.root.appendChild(this.ringSvg);

    parent.appendChild(this.root);
  }

  setCooldown(fraction: number): void {
    const f = Math.max(0, Math.min(1, fraction));
    if (Math.abs(f - this.lastFraction) < 0.01) return;
    this.lastFraction = f;
    this.ring.setAttribute('stroke-dashoffset', String(this.ringCircumference * (1 - f)));
    this.ring.setAttribute('stroke', f >= 0.95 ? '#80ffa0' : '#ffffffcc');
    this.ringSvg.style.opacity = f >= 0.999 ? '0' : '1';
  }

  hide(): void {
    this.root.style.display = 'none';
  }

  show(): void {
    this.root.style.display = '';
  }

  private lastOpacity = -1;
  setOpacity(value: number): void {
    const v = Math.max(0, Math.min(1, value));
    if (v === this.lastOpacity) return;
    this.lastOpacity = v;
    this.root.style.opacity = String(v);
  }

  setTint(color: string | null): void {
    // Hot path — called every frame. Skip when nothing changed; cache
    // the non-svg child list since the children are static after init.
    if (color === this.lastTint) return;
    this.lastTint = color;
    if (this.tintTargets.length === 0) {
      for (const el of this.root.children) {
        if (el.tagName === 'svg') continue;
        this.tintTargets.push(el as HTMLElement);
      }
    }
    if (color === null) {
      for (const el of this.tintTargets) {
        el.style.background = '#ffffffcc';
        el.style.mixBlendMode = 'difference';
      }
    } else {
      for (const el of this.tintTargets) {
        el.style.background = color;
        el.style.mixBlendMode = 'normal';
      }
    }
  }
}
